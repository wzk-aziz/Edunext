package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.AddProductInCartDto;
import com.example.marketplacepi.dto.OrderDto;
import com.example.marketplacepi.dto.PlaceOrderDto;
import com.example.marketplacepi.exceptions.ValidationException;
import com.example.marketplacepi.services.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@Slf4j
public class CartController {
	private final CartService cartService;

	@PostMapping("/add")
	public ResponseEntity<?> addProductToCart(@RequestBody AddProductInCartDto addProductInCartDto) {
		return cartService.addProductToCart(addProductInCartDto);
	}

	// Obtenir les produits du panier
	@GetMapping("/cart")
	public ResponseEntity<OrderDto> getCart() {
		OrderDto cart = cartService.getCart();
		return cart != null ? ResponseEntity.ok(cart) : ResponseEntity.noContent().build();
	}

	// Appliquer un coupon au panier
	@PostMapping("/apply-coupon/{code}")
	public ResponseEntity<OrderDto> applyCoupon(@PathVariable String code) {
		return ResponseEntity.ok(cartService.applyCoupon(code));
	}

	// Augmenter la quantité d'un produit
	@PostMapping("/increase-quantity")
	public ResponseEntity<OrderDto> increaseProductQuantity(@RequestBody AddProductInCartDto addProductInCartDto) {
		return ResponseEntity.ok(cartService.increaseProductQuantity(addProductInCartDto));
	}

	// Diminuer la quantité d'un produit
	@PostMapping("/decrease-quantity")
	public ResponseEntity<OrderDto> decreaseProductQuantity(@RequestBody AddProductInCartDto addProductInCartDto) {
		return ResponseEntity.ok(cartService.decreaseProductQuantity(addProductInCartDto));
	}

	// Passer une commande
	@PostMapping("/place-order")
	public ResponseEntity<OrderDto> placeOrder(@RequestBody PlaceOrderDto placeOrderDto) {
		return ResponseEntity.ok(cartService.placedOrder(placeOrderDto));
	}

	// Rechercher une commande par tracking ID
	@GetMapping("/search/{trackingId}")
	public ResponseEntity<OrderDto> searchOrderByTrackingId(@PathVariable String trackingId) {
		return ResponseEntity.ok(cartService.searchOrderByTrackingId(UUID.fromString(trackingId)));
	}
	// New endpoint to remove a product from the cart
	@DeleteMapping("/api/customer/cart/{productId}")
	public ResponseEntity<?> removeProductFromCart(@PathVariable Long productId) {
		return cartService.removeProductFromCart(productId);
	}


}