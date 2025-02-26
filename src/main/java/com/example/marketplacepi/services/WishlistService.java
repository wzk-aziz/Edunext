package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.WishlistDto;

import java.util.List;

public interface WishlistService {
	WishlistDto addProductToWishlist( WishlistDto wishlistDto);
	
	List<WishlistDto> getAllWishlists();
	public boolean removeProductFromWishlist(Long wishlistId);
}
