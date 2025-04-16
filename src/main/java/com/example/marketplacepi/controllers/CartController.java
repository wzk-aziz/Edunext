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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@Slf4j
public class CartController {
	private final CartService cartService;

	@PostMapping("/add/{userId}")
	public ResponseEntity<?> addProductToCart(@RequestBody AddProductInCartDto dto, @PathVariable Long userId) {
		try {
			// Ajouter le produit au panier avec l'ID de l'utilisateur
			return cartService.addProductToCart(dto, userId);
		} catch (Exception e) {
			e.printStackTrace();

			Map<String, Object> error = new HashMap<>();
			error.put("message", "Erreur lors de l'ajout du produit");
			error.put("status", "error");

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	// Obtenir les produits du panier
	@GetMapping("/cart/{userId}")
	public ResponseEntity<?> getCart(@PathVariable Long userId) {
		try {
			OrderDto orderDto = cartService.getCart(userId);
			if (orderDto == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Panier vide ou non trouvé");
			}
			return ResponseEntity.status(HttpStatus.OK).body(orderDto);
		} catch (Exception e) {
			e.printStackTrace();

			Map<String, Object> error = new HashMap<>();
			error.put("message", "Erreur lors de la récupération du panier");
			error.put("status", "error");

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}


	// Appliquer un coupon
	@PostMapping("/applyCoupon")
	public ResponseEntity<?> applyCoupon(@RequestParam String code, @RequestParam Long userId) {
		try {
			OrderDto orderDto = cartService.applyCoupon(code, userId);
			if (orderDto == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Commande non trouvée");
			}
			return ResponseEntity.status(HttpStatus.OK).body(orderDto);
		} catch (ValidationException e) {
			Map<String, Object> error = new HashMap<>();
			error.put("message", e.getMessage());
			error.put("status", "error");

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		} catch (Exception e) {
			e.printStackTrace();

			Map<String, Object> error = new HashMap<>();
			error.put("message", "Erreur lors de l'application du coupon");
			error.put("status", "error");

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}

	// Passer une commande
	@PostMapping("/place-order/{userId}")
	public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderDto placeOrderDto, @PathVariable Long userId) {
		try {
			OrderDto orderDto = cartService.placedOrder(placeOrderDto, userId);
			if (orderDto == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Commande invalide ou non trouvée");
			}
			return ResponseEntity.status(HttpStatus.CREATED).body(orderDto);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, Object> error = new HashMap<>();
			error.put("message", "Erreur lors de la commande");
			error.put("status", "error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}


	// Supprimer un produit du panier
	@DeleteMapping("/remove")
	public ResponseEntity<?> removeProductFromCart(@RequestParam Long productId, @RequestParam Long userId) {
		try {
			return cartService.removeProductFromCart(productId, userId);
		} catch (Exception e) {
			e.printStackTrace();

			Map<String, Object> error = new HashMap<>();
			error.put("message", "Erreur lors de la suppression du produit");
			error.put("status", "error");

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}
	@PostMapping("/increase-quantity/{userId}")
	public ResponseEntity<OrderDto> increaseProductQuantity(
			@RequestBody AddProductInCartDto addProductInCartDto,
			@PathVariable Long userId) {
		return ResponseEntity.ok(cartService.increaseProductQuantity(addProductInCartDto, userId));
	}
	@PostMapping("/decrease-quantity/{userId}")
	public ResponseEntity<OrderDto> decreaseProductQuantity(
			@RequestBody AddProductInCartDto addProductInCartDto,
			@PathVariable Long userId) {
		return ResponseEntity.ok(cartService.decreaseProductQuantity(addProductInCartDto, userId));
	}

}
