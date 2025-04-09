package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.OrderedProductsResponseDto;
import com.example.marketplacepi.dto.ReviewDto;

import java.io.IOException;

public interface ReviewService {
	OrderedProductsResponseDto getOrderedProductsDetailsByOrderId(Long orderId);
	
	ReviewDto giveReview(ReviewDto reviewDto) throws IOException ;
}
