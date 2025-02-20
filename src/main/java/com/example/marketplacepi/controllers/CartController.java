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

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@Slf4j
public class CartController {
	private final CartService cartService;

	@PostMapping("/cart")
	public ResponseEntity<?> addProductToCart(@RequestBody AddProductInCartDto addProductInCartDto) {
		log.info("Received request to add product to cart");
		return cartService.addProductToCart(addProductInCartDto);
	}

	@GetMapping("/cart")
	public ResponseEntity<?> getCart() {
		log.info("Received request to get cart");
		OrderDto orderDto = cartService.getCart();
		return ResponseEntity.status(HttpStatus.OK).body(orderDto);
	}

	@GetMapping("/coupon/{code}")
	public ResponseEntity<?> applyCoupon(@PathVariable String code) {
		log.info("Received request to apply coupon '{}'", code);
		try {
			OrderDto orderDto = cartService.applyCoupon(code);
			return ResponseEntity.ok(orderDto);
		} catch (ValidationException e) {
			log.warn("Failed to apply coupon '{}'", code, e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PostMapping("/addition")
	public ResponseEntity<OrderDto> increaseProductQuantity(@RequestBody AddProductInCartDto addProductInCartDto) {
		log.info("Received request to increase quantity of product '{}'",
				addProductInCartDto.getProductId());
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(cartService.increaseProductQuantity(addProductInCartDto));
	}

	@PostMapping("/deduction")
	public ResponseEntity<OrderDto> decreaseProductQuantity(@RequestBody AddProductInCartDto addProductInCartDto) {
		log.info("Received request to decrease quantity of product '{}'",
				addProductInCartDto.getProductId());
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(cartService.decreaseProductQuantity(addProductInCartDto));
	}

	@PostMapping("/placedOrder")
	public ResponseEntity<OrderDto> placeOrder(@RequestBody PlaceOrderDto placeOrderDto) {
		log.info("Received request to place order");
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(cartService.placedOrder(placeOrderDto));
	}


}