package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.WishlistDto;

import java.util.List;

public interface WishlistService {

	// Ajouter un produit à la wishlist d'un utilisateur
	WishlistDto addProductToWishlist(Long userId, WishlistDto wishlistDto);

	// Récupérer toutes les wishlists d'un utilisateur spécifique
	List<WishlistDto> getAllWishlists(Long userId);

	// Retirer un produit de la wishlist d'un utilisateur
	boolean removeProductFromWishlist(Long userId, Long productId);
}
