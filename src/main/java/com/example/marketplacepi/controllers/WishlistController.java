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

	@PostMapping("/wishlist")
	public ResponseEntity<?> addProductToWishlist(@RequestBody WishlistDto wishlistDto) {
		log.info("Received request to add product to wishlist");

		// Vérifier que l'id du produit n'est pas nul
		if (wishlistDto.getProductId() == null) {
			log.error("Product ID is null");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product ID cannot be null");
		}

		WishlistDto postedWishlistDto = wishlistService.addProductToWishlist(wishlistDto);

		return postedWishlistDto != null
				? ResponseEntity.status(HttpStatus.CREATED).body(postedWishlistDto)
				: ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produit non trouvé");
	}


	@GetMapping("/wishlist")
	public ResponseEntity<List<WishlistDto>> getWishlist() {
		log.info("Received request to get wishlist");
		return ResponseEntity.ok(wishlistService.getAllWishlists());
	}
	@DeleteMapping("/wishlist/{wishlistId}")
	public ResponseEntity<Void> removeProductFromWishlist(@PathVariable Long wishlistId) {
		log.info("Received request to delete wishlist with ID: {}", wishlistId);
		boolean deleted = wishlistService.removeProductFromWishlist(wishlistId);
		if (deleted) {
			log.info("wishlist with ID: {} deleted successfully", wishlistId);
			return ResponseEntity.noContent().build();
		} else {
			log.warn("wishlist with ID: {} not found", wishlistId);
			return ResponseEntity.notFound().build();
		}
	}

}