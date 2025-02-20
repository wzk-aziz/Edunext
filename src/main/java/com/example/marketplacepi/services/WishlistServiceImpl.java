package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.WishlistDto;
import com.example.marketplacepi.models.Product;
import com.example.marketplacepi.models.Wishlist;
import com.example.marketplacepi.repository.ProductRepository;
import com.example.marketplacepi.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistServiceImpl implements WishlistService{

	private final ProductRepository productRepository;
	private final WishlistRepository wishlistRepository;

	public WishlistDto addProductToWishlist(WishlistDto wishlistDto) {
		// Vérifier que l'ID du produit est valide
		if (wishlistDto.getProductId() == null) {
			log.error("Product ID is null in the wishlist DTO");
			return null;
		}

		Optional<Product> optionalProduct = productRepository.findById(wishlistDto.getProductId());

		if (optionalProduct.isPresent()) {
			Wishlist wishlist = new Wishlist();
			wishlist.setProduct(optionalProduct.get());  // Associer le produit trouvé à la wishlist

			log.info("Product with ID {} added to wishlist.", wishlistDto.getProductId());
			return wishlistRepository.save(wishlist).getWishlistDto();  // Sauvegarder la wishlist et retourner le DTO
		}

		log.error("Failed to add product to wishlist. Product not found.");
		return null;
	}


	public List<WishlistDto> getAllWishlists() {
		List<Wishlist> wishlist = wishlistRepository.findAll();  // Récupère toutes les wishlists sans filtrer par utilisateur
		log.info("Retrieved all wishlists.");
		return wishlist.stream().map(Wishlist::getWishlistDto).collect(Collectors.toList());
	}


}
