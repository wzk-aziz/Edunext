package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.AddProductInCartDto;
import com.example.marketplacepi.dto.OrderDto;
import com.example.marketplacepi.dto.PlaceOrderDto;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface CartService {
	ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto, Long userId);
	OrderDto getCart(Long userId);
	OrderDto applyCoupon(String code, Long userId);
	OrderDto increaseProductQuantity(AddProductInCartDto addProductInCartDto, Long userId);
	OrderDto decreaseProductQuantity(AddProductInCartDto addProductInCartDto, Long userId);
	OrderDto placedOrder(PlaceOrderDto placeOrderDto, Long userId);
	ResponseEntity<?> removeProductFromCart(Long productId, Long userId);
}
