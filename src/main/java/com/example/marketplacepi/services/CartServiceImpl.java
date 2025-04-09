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



	@Override
	public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto) {

		System.out.println(addProductInCartDto.toString());

		// Récupérer la commande active (en attente)
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);

		if (activeOrder == null) {
			log.info("Active order not found, creating a new order.");
			activeOrder = new Order();
			activeOrder.setOrderStatus(OrderStatus.Pending);
			activeOrder.setTotalAmount(0L);
			activeOrder.setAmount(0L);
			activeOrder.setCartItems(new ArrayList<>()); // Initialiser la liste des articles
			activeOrder = orderRepository.save(activeOrder);
		}

		// Vérifier si le produit existe
		Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
		if (!optionalProduct.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
		}
		Product product = optionalProduct.get();

		// Vérifier si le produit est déjà dans le panier
		Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderId(
				product.getId(), activeOrder.getId());

		CartItems cartItem;
		if (optionalCartItem.isPresent()) {
			// Si le produit est déjà dans le panier, augmenter la quantité
			cartItem = optionalCartItem.get();
			cartItem.setQuantity(cartItem.getQuantity() + 1);
		} else {
			// Sinon, ajouter un nouveau produit
			cartItem = new CartItems();
			cartItem.setProduct(product);
			cartItem.setPrice(product.getPrice());
			cartItem.setQuantity(1L);
			cartItem.setOrder(activeOrder);
			activeOrder.getCartItems().add(cartItem);
		}

		// Sauvegarder le nouvel état de l'élément
		cartItemsRepository.save(cartItem);

		// Recalculer le montant total
		long newTotalAmount = activeOrder.getCartItems().stream()
				.mapToLong(item -> item.getPrice() * item.getQuantity())
				.sum();

		activeOrder.setTotalAmount(newTotalAmount);
		activeOrder.setAmount(newTotalAmount);

		orderRepository.save(activeOrder);

		return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
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

		// Vérifier si le coupon est expiré
		if (couponIsExpired(coupon)) {
			throw new ValidationException("Coupon is expired");
		}

		// Vérifier si le nombre d'utilisations du coupon a atteint la limite
		if (coupon.getUsageCount() >= coupon.getMaxUsage()) {
			throw new ValidationException("Coupon usage limit reached");
		}

		// Appliquer le coupon à la commande active
		double discountAmount = ((coupon.getDiscount() / 100.0) * activeOrder.getTotalAmount());
		double netAmount = activeOrder.getTotalAmount() - discountAmount;

		activeOrder.setAmount((long) netAmount);
		activeOrder.setDiscount((long) discountAmount);
		activeOrder.setCoupon(coupon);

		// Incrémente le nombre d’utilisations du coupon
		coupon.setUsageCount(coupon.getUsageCount() + 1);
		couponRepository.save(coupon);

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

	@Override
	public OrderDto placedOrder(PlaceOrderDto placeOrderDto) {
		// Récupérer la commande en attente
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);

		if (activeOrder == null) {
			log.info("Aucune commande en attente active trouvée.");
			return null;
		}

		// Mise à jour des détails de la commande
		activeOrder.setOrderDescription(placeOrderDto.getOrderDescription());
		activeOrder.setAddress(placeOrderDto.getAddress());
		activeOrder.setDate(new Date());
		activeOrder.setOrderStatus(OrderStatus.Placed);
		activeOrder.setTrackingId(UUID.randomUUID());

		// Sauvegarde de la commande mise à jour
		orderRepository.save(activeOrder);
		log.info("Commande mise à jour et enregistrée avec ID: {}", activeOrder.getId());

		// Création d'une nouvelle commande en attente
		Order newOrder = new Order();
		newOrder.setAmount(0L);
		newOrder.setTotalAmount(0L);
		newOrder.setDiscount(0L);
		newOrder.setOrderStatus(OrderStatus.Pending);

		// Sauvegarde de la nouvelle commande en attente
		orderRepository.save(newOrder);
		log.info("Nouvelle commande en attente créée : {}", newOrder.toString());

		// Retourner le DTO de la commande passée
		return activeOrder.getOrderDto();
	}


	@Override
	public ResponseEntity<?> removeProductFromCart(Long productId) {
		// Recherche de la commande active (statut "Pending")
		Order activeOrder = orderRepository.findByOrderStatus(OrderStatus.Pending);
		if (activeOrder == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Active order not found");
		}

		// Recherche de l'élément du panier par l'ID du produit et l'ID de la commande active
		Optional<CartItems> cartItemOptional = cartItemsRepository.findByProductIdAndOrderId(productId, activeOrder.getId());

		if (!cartItemOptional.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found in the cart");
		}

		// Si l'élément existe, on le supprime du panier
		CartItems cartItem = cartItemOptional.get();
		long productPrice = cartItem.getPrice();
		long quantity = cartItem.getQuantity();

		// Suppression de l'élément du panier
		activeOrder.getCartItems().remove(cartItem);
		cartItemsRepository.delete(cartItem);

		// Mise à jour du montant total de la commande
		activeOrder.setTotalAmount(activeOrder.getTotalAmount() - (productPrice * quantity));
		activeOrder.setAmount(activeOrder.getTotalAmount());

		// Si un coupon est appliqué, on recalcul la réduction
		if (activeOrder.getCoupon() != null) {
			double discountAmount = ((activeOrder.getCoupon().getDiscount() / 100.0) * activeOrder.getTotalAmount());
			double netAmount = activeOrder.getTotalAmount() - discountAmount;

			activeOrder.setAmount((long) netAmount);
			activeOrder.setDiscount((long) discountAmount);
		}

		// Sauvegarde des modifications de la commande
		orderRepository.save(activeOrder);

		return ResponseEntity.status(HttpStatus.OK).body("Product removed from cart");
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