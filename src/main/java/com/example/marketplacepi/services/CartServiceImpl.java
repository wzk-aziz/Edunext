package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.AddProductInCartDto;
import com.example.marketplacepi.dto.CartItemsDto;
import com.example.marketplacepi.dto.OrderDto;
import com.example.marketplacepi.dto.PlaceOrderDto;
import com.example.marketplacepi.enums.OrderStatus;
import com.example.marketplacepi.exceptions.ValidationException;
import com.example.marketplacepi.models.*;
import com.example.marketplacepi.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;


@Service
@AllArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

	@Autowired
	private final OrderRepository orderRepository;

	@Autowired
	private final CartItemsRepository cartItemsRepository;

	@Autowired
	private final ProductRepository productRepository;

	@Autowired
	private final CouponRepository couponRepository;

	public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto) {
		// Rechercher un ordre actif (Pending)
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);

		// Si aucun ordre actif n'est trouvé, en créer un nouveau
		if (activeOrder == null) {
			log.info("Active order not found, creating a new order");
			activeOrder = new Order();
			activeOrder.setOrderStatus(OrderStatus.Pending);
			activeOrder.setAmount(0L);
			activeOrder.setTotalAmount(0L);
			activeOrder.setDiscount(0L);
			activeOrder.setCartItems(new ArrayList<>());  // Initialize the cartItems list
			orderRepository.save(activeOrder); // Sauvegarder le nouvel ordre
		}

		// Assurez-vous de toujours récupérer l'ordre actif avant chaque ajout
		activeOrder = orderRepository.findById(activeOrder.getId()).orElseThrow(() -> new RuntimeException("Order not found"));

		// Vérifier si le produit existe déjà dans le panier
		Optional<CartItems> optionalCartItems = cartItemsRepository.findByProductIdAndOrderId(
				addProductInCartDto.getProductId(), activeOrder.getId());

		if (optionalCartItems.isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Product already in cart");
		} else {
			// Ajouter le produit au panier
			Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
			if (optionalProduct.isPresent()) {
				CartItems cartItems = new CartItems();
				cartItems.setProduct(optionalProduct.get());
				cartItems.setPrice(optionalProduct.get().getPrice());
				cartItems.setQuantity(1L);
				cartItems.setOrder(activeOrder);

				// Sauvegarder l'élément du panier
				CartItems updatedCart = cartItemsRepository.save(cartItems);
				activeOrder.setTotalAmount(activeOrder.getTotalAmount() + cartItems.getPrice());
				activeOrder.setAmount(activeOrder.getAmount() + cartItems.getPrice());

				// Initialize cartItems list if null and add the new item
				if (activeOrder.getCartItems() == null) {
					activeOrder.setCartItems(new ArrayList<>());
				}
				activeOrder.getCartItems().add(updatedCart);

				orderRepository.save(activeOrder); // Sauvegarder l'ordre mis à jour

				return ResponseEntity.status(HttpStatus.CREATED).body(updatedCart);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
			}
		}
	}


	public OrderDto getCart() {
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);
		if (activeOrder == null) return null;

		List<CartItemsDto> cartItemsDtosList = activeOrder.getCartItems().stream().map(CartItems::getCartDto)
				.collect(Collectors.toList());

		OrderDto orderDto = new OrderDto();
		orderDto.setId(activeOrder.getId());
		orderDto.setAmount(activeOrder.getAmount());
		orderDto.setOrderStatus(activeOrder.getOrderStatus());
		orderDto.setDiscount(activeOrder.getDiscount());
		orderDto.setTotalAmount(activeOrder.getTotalAmount());
		orderDto.setCartItems(cartItemsDtosList);
		if (activeOrder.getCoupon() != null) {
			orderDto.setCouponCode(activeOrder.getCoupon().getCode());
			orderDto.setCouponName(activeOrder.getCoupon().getName());
		}
		return orderDto;
	}

	public OrderDto applyCoupon(String code) {
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);
		Coupon coupon = couponRepository.findByCode(code)
				.orElseThrow(() -> new ValidationException("Coupon not found"));
		if (couponIsExpired(coupon)) {
			throw new ValidationException("Coupon is expired");
		}
		double discountAmount = ((coupon.getDiscount() / 100.0) * activeOrder.getTotalAmount());
		double netAmount = activeOrder.getTotalAmount() - discountAmount;

		activeOrder.setAmount((long) netAmount);
		activeOrder.setDiscount((long) discountAmount);
		activeOrder.setCoupon(coupon);

		orderRepository.save(activeOrder);
		return activeOrder.getOrderDto();
	}

	public boolean couponIsExpired(Coupon coupon) {
		Date currentDate = new Date();
		Date expirationDate = coupon.getExpirationDate();
		return expirationDate != null && currentDate.after(expirationDate);
	}

	public OrderDto increaseProductQuantity(AddProductInCartDto addProductInCartDto) {
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);
		Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
		Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderId(
				optionalProduct.get().getId(), activeOrder.getId());

		if (optionalCartItem.isPresent()) {
			CartItems cartItems = optionalCartItem.get();
			Product product = optionalProduct.get();

			activeOrder.setAmount(activeOrder.getAmount() + product.getPrice());
			activeOrder.setTotalAmount(activeOrder.getTotalAmount() + product.getPrice());

			cartItems.setQuantity(cartItems.getQuantity() + 1);

			if (activeOrder.getCoupon() != null) {
				double discountAmount = ((activeOrder.getCoupon().getDiscount() / 100.0)
						* activeOrder.getTotalAmount());
				double netAmount = activeOrder.getTotalAmount() - discountAmount;

				activeOrder.setAmount((long) netAmount);
				activeOrder.setDiscount((long) discountAmount);
			}

			cartItemsRepository.save(cartItems);
			orderRepository.save(activeOrder);
			return activeOrder.getOrderDto();
		}
		return null;
	}

	public OrderDto decreaseProductQuantity(AddProductInCartDto addProductInCartDto) {
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);
		Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
		Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderId(
				optionalProduct.get().getId(), activeOrder.getId());

		if (optionalCartItem.isPresent()) {
			CartItems cartItems = optionalCartItem.get();
			Product product = optionalProduct.get();

			activeOrder.setAmount(activeOrder.getAmount() - product.getPrice());
			activeOrder.setTotalAmount(activeOrder.getTotalAmount() - product.getPrice());

			cartItems.setQuantity(cartItems.getQuantity() - 1);

			if (activeOrder.getCoupon() != null) {
				double discountAmount = ((activeOrder.getCoupon().getDiscount() / 100.0)
						* activeOrder.getTotalAmount());
				double netAmount = activeOrder.getTotalAmount() - discountAmount;

				activeOrder.setAmount((long) netAmount);
				activeOrder.setDiscount((long) discountAmount);
			}

			cartItemsRepository.save(cartItems);
			orderRepository.save(activeOrder);
			return activeOrder.getOrderDto();
		}
		return null;
	}

	public OrderDto placedOrder(PlaceOrderDto placeOrderDto) {
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);

		if (activeOrder == null) {
			log.info("There is no active pending order for the user");
			return null;
		}

		activeOrder.setOrderDescription(placeOrderDto.getOrderDescription());
		activeOrder.setAddress(placeOrderDto.getAddress());
		activeOrder.setDate(new Date());
		activeOrder.setOrderStatus(OrderStatus.Placed);
		activeOrder.setTrackingId(UUID.randomUUID());

		orderRepository.save(activeOrder);
		log.info("Updated order saved with ID: {}", activeOrder.getId());

		Order newOrder = new Order();
		newOrder.setAmount(0L);
		newOrder.setTotalAmount(0L);
		newOrder.setDiscount(0L);
		newOrder.setOrderStatus(OrderStatus.Pending);

		orderRepository.save(newOrder);
		log.info("New pending order created");

		return activeOrder.getOrderDto();
	}

	public List<OrderDto> getMyPlacedOrders() {
		return orderRepository
				.findByOrderStatusIn(List.of(OrderStatus.Shipped, OrderStatus.Placed, OrderStatus.Delivered))
				.stream().map(Order::getOrderDto).collect(Collectors.toList());
	}

	public OrderDto searchOrderByTrackingId(UUID trackingId) {
		Optional<Order> optionalOrder = orderRepository.findByTrackingId(trackingId);
		return optionalOrder.map(Order::getOrderDto).orElse(null);
	}
}
