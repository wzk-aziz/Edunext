package com.example.marketplacepi.services;

import com.example.EduNext.Entities.User;
import com.example.EduNext.Repositories.UserRepository;
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

	@Autowired
	private final UserRepository userRepository;  // Ajouter la dépendance UserRepository

	@Override
	public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto, Long userId) {
		System.out.println(addProductInCartDto.toString());

		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		User user = userOptional.get();

		// Récupérer la commande active (en attente)
		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);

		if (activeOrder == null) {
			log.info("Active order not found for user {}, creating a new order.", user.getUsername());
			activeOrder = new Order();
			activeOrder.setOrderStatus(OrderStatus.Pending);
			activeOrder.setTotalAmount(0L);
			activeOrder.setAmount(0L);
			activeOrder.setCartItems(new ArrayList<>()); // Initialiser la liste des articles
			activeOrder.setUser(user);  // Lier l'ordre à l'utilisateur
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
			cartItem.setUser(user);
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

	public OrderDto getCart(Long userId) {
		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			return null;
		}

		User user = userOptional.get();

		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);
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

	public OrderDto applyCoupon(String code, Long userId) {
		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			return null;
		}

		User user = userOptional.get();

		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);
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

	public OrderDto increaseProductQuantity(AddProductInCartDto addProductInCartDto, Long userId) {
		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			return null;
		}

		User user = userOptional.get();

		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);
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

	public OrderDto decreaseProductQuantity(AddProductInCartDto addProductInCartDto, Long userId) {
		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			return null;
		}

		User user = userOptional.get();

		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);
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
	public OrderDto placedOrder(PlaceOrderDto placeOrderDto, Long userId) {
		log.info("Début de la méthode placedOrder pour l'utilisateur ID: {}", userId);

		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			log.warn("Utilisateur avec ID {} non trouvé.", userId);
			return null;
		}

		User user = userOptional.get();
		log.info("Utilisateur trouvé: {}", user.getUsername());

		// Récupérer la commande en attente
		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);
		if (activeOrder == null) {
			log.info("Aucune commande en attente active trouvée pour l'utilisateur ID: {}", userId);
			return null;
		}

		log.info("Commande active trouvée avec ID: {}", activeOrder.getId());

		// Mise à jour des détails de la commande
		activeOrder.setOrderDescription(placeOrderDto.getOrderDescription());
		activeOrder.setAddress(placeOrderDto.getAddress());
		activeOrder.setDate(new Date());
		activeOrder.setOrderStatus(OrderStatus.Placed);
		activeOrder.setTrackingId(UUID.randomUUID());
		log.info("Commande mise à jour avec la nouvelle description et l'adresse.");

		// Sauvegarde de la commande mise à jour
		orderRepository.save(activeOrder);
		log.info("Commande mise à jour et enregistrée avec ID: {}", activeOrder.getId());

		// Création d'une nouvelle commande en attente
		Order newOrder = new Order();
		newOrder.setAmount(0L);
		newOrder.setTotalAmount(0L);
		newOrder.setDiscount(0L);
		newOrder.setOrderStatus(OrderStatus.Pending);
		newOrder.setUser(user);  // Lier la nouvelle commande à l'utilisateur
		log.info("Création d'une nouvelle commande en attente pour l'utilisateur ID: {}", userId);

		// Sauvegarde de la nouvelle commande en attente
		orderRepository.save(newOrder);
		log.info("Nouvelle commande en attente créée avec ID: {}", newOrder.getId());

		// Retourner le DTO de la commande passée
		log.info("Retour du DTO de la commande passée avec ID: {}", activeOrder.getId());
		return activeOrder.getOrderDto();
	}


	@Override
	public ResponseEntity<?> removeProductFromCart(Long productId, Long userId) {
		// Vérifier si l'utilisateur existe
		Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
		if (!userOptional.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		User user = userOptional.get();

		// Recherche de la commande active (statut "Pending")
		Order activeOrder = orderRepository.findByOrderStatusAndUser(OrderStatus.Pending, user);
		if (activeOrder == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Active order not found");
		}

		// Recherche de l'élément du panier à supprimer
		Optional<CartItems> cartItemOptional = cartItemsRepository.findByProductIdAndOrderId(productId, activeOrder.getId());
		if (!cartItemOptional.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not in cart");
		}

		CartItems cartItem = cartItemOptional.get();
		activeOrder.setAmount(activeOrder.getAmount() - (cartItem.getPrice() * cartItem.getQuantity()));
		activeOrder.setTotalAmount(activeOrder.getTotalAmount() - (cartItem.getPrice() * cartItem.getQuantity()));

		// Supprimer l'élément du panier
		cartItemsRepository.delete(cartItem);

		// Sauvegarder les changements dans la commande
		orderRepository.save(activeOrder);

		return ResponseEntity.status(HttpStatus.OK).body("Product removed from cart successfully");
	}
}