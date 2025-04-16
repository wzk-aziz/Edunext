package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.WishlistDto;
import com.example.marketplacepi.services.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
@Slf4j
public class WishlistController {
	private final WishlistService wishlistService;

	// Ajouter un produit à la wishlist de l'utilisateur
	@PostMapping("/wishlist/{userId}")
	public ResponseEntity<?> addProductToWishlist(@PathVariable Long userId, @RequestBody WishlistDto wishlistDto) {
		log.info("Received request to add product to wishlist for user with ID {}", userId);

		// Vérifier que l'id du produit n'est pas nul
		if (wishlistDto.getProductId() == null) {
			log.error("Product ID is null");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product ID cannot be null");
		}

		WishlistDto postedWishlistDto = wishlistService.addProductToWishlist(userId, wishlistDto);

		return postedWishlistDto != null
				? ResponseEntity.status(HttpStatus.CREATED).body(postedWishlistDto)
				: ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found or already in wishlist");
	}

	// Récupérer toutes les wishlists de l'utilisateur
	@GetMapping("/wishlist/{userId}")
	public ResponseEntity<List<WishlistDto>> getWishlist(@PathVariable Long userId) {
		log.info("Received request to get wishlist for user with ID {}", userId);
		return ResponseEntity.ok(wishlistService.getAllWishlists(userId));
	}

	// Retirer un produit de la wishlist de l'utilisateur
	@DeleteMapping("/wishlist/{userId}/product/{productId}")
	public ResponseEntity<Void> removeProductFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
		log.info("Received request to delete product with ID: {} from wishlist of user with ID {}", productId, userId);
		boolean deleted = wishlistService.removeProductFromWishlist(userId, productId);
		if (deleted) {
			log.info("Product with ID: {} removed from wishlist of user with ID {}", productId, userId);
			return ResponseEntity.noContent().build();
		} else {
			log.warn("Product with ID: {} not found in wishlist of user with ID {}", productId, userId);
			return ResponseEntity.notFound().build();
		}
	}
}
