package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.OrderedProductsResponseDto;
import com.example.marketplacepi.dto.ReviewDto;
import com.example.marketplacepi.services.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
@Slf4j
public class ReviewController {
	private final ReviewService reviewService;

	@GetMapping("/ordered-products/{orderId}")
	public ResponseEntity<OrderedProductsResponseDto> getOrderedProductDetailsByOrderId(@PathVariable Long orderId) {
		log.info("Received request to get ordered product details for order with ID: {}", orderId);
		OrderedProductsResponseDto responseDto = reviewService.getOrderedProductsDetailsByOrderId(orderId);
		return ResponseEntity.ok(responseDto);
	}

	@PostMapping("/review")
	public ResponseEntity<?> giveReview(@ModelAttribute ReviewDto reviewDto) throws IOException {
		log.info("Received request to submit review for product with ID: {}", reviewDto.getProductId());
		ReviewDto submittedReview = reviewService.giveReview(reviewDto);
		if (submittedReview == null) {
			log.warn("Failed to submit review for product with ID: {}", reviewDto.getProductId());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
		}
		log.info("Review submitted successfully for product with ID: {}", reviewDto.getProductId());
		return ResponseEntity.status(HttpStatus.CREATED).body(submittedReview);
	}
}
