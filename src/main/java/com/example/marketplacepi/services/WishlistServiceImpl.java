package com.example.marketplacepi.services;

import com.example.EduNext.Entities.User;
import com.example.EduNext.Repositories.UserRepository;
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
	private final UserRepository userRepository; // Déclarer l'injection du UserRepository

	// Ajouter un produit à la wishlist d'un utilisateur
	public WishlistDto addProductToWishlist(Long userId, WishlistDto wishlistDto) {
		// Vérifier que l'ID du produit et de l'utilisateur sont valides
		if (wishlistDto.getProductId() == null || userId == null) {
			log.error("Product ID or User ID is null in the wishlist DTO");
			return null;
		}

		Optional<Product> optionalProduct = productRepository.findById(wishlistDto.getProductId());
		Optional<User> optionalUser = userRepository.findById(Math.toIntExact(userId)); // Vérifier si l'utilisateur existe

		if (optionalProduct.isPresent() && optionalUser.isPresent()) {
			// Vérifier si le produit est déjà dans la wishlist de l'utilisateur
			Optional<Wishlist> existingWishlist = wishlistRepository.findByProductIdAndUserId(wishlistDto.getProductId(), userId);

			if (existingWishlist.isPresent()) {
				log.info("Product with ID {} is already in the wishlist of user with ID {}.", wishlistDto.getProductId(), userId);
				return null;  // Le produit est déjà dans la wishlist, on ne l'ajoute pas
			}

			// Ajouter le produit à la wishlist de l'utilisateur
			Wishlist wishlist = new Wishlist();
			wishlist.setProduct(optionalProduct.get());  // Associer le produit trouvé à la wishlist
			wishlist.setUser(optionalUser.get());        // Associer l'utilisateur à la wishlist

			log.info("Product with ID {} added to the wishlist of user with ID {}.", wishlistDto.getProductId(), userId);
			return wishlistRepository.save(wishlist).getWishlistDto();  // Sauvegarder la wishlist et retourner le DTO
		}

		log.error("Failed to add product to wishlist. Product or User not found.");
		return null;
	}

	// Récupérer la wishlist d'un utilisateur
	public List<WishlistDto> getAllWishlists(Long userId) {
		List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);  // Récupère la wishlist de l'utilisateur
		log.info("Retrieved wishlist for user with ID {}.", userId);
		return wishlist.stream().map(Wishlist::getWishlistDto).collect(Collectors.toList());
	}

	// Retirer un produit de la wishlist d'un utilisateur
	public boolean removeProductFromWishlist(Long userId, Long productId) {
		Optional<Wishlist> wishlistItem = wishlistRepository.findByProductIdAndUserId(productId, userId);

		if (wishlistItem.isPresent()) {
			wishlistRepository.delete(wishlistItem.get());
			log.info("Product with ID {} removed from the wishlist of user with ID {}.", productId, userId);
			return true;
		}

		log.warn("Product with ID {} not found in the wishlist of user with ID {}.", productId, userId);
		return false;
	}
}
