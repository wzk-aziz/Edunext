package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.OrderedProductsResponseDto;
import com.example.marketplacepi.dto.ProductDto;
import com.example.marketplacepi.dto.ReviewDto;
import com.example.marketplacepi.models.*;
import com.example.marketplacepi.repository.OrderRepository;
import com.example.marketplacepi.repository.ProductRepository;
import com.example.marketplacepi.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public OrderedProductsResponseDto getOrderedProductsDetailsByOrderId(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        OrderedProductsResponseDto orderedProductsResponseDto = new OrderedProductsResponseDto();
        if (optionalOrder.isPresent()) {
            orderedProductsResponseDto.setOrderAmount(optionalOrder.get().getAmount());

            List<ProductDto> productDtoList = new ArrayList<>();
            for (CartItems cartItems : optionalOrder.get().getCartItems()) {
                ProductDto productDto = ProductDto.builder()
                        .id(cartItems.getProduct().getId())
                        .name(cartItems.getProduct().getName())
                        .price(cartItems.getPrice())
                        .quantity(cartItems.getQuantity())
                        .byteImg(cartItems.getProduct().getImg())
                        .build();

                productDtoList.add(productDto);
            }

            orderedProductsResponseDto.setProductDtoList(productDtoList);
        }
        log.info("Retrieved ordered products details for order ID: {}", orderId);
        return orderedProductsResponseDto;
    }

    public ReviewDto giveReview(ReviewDto reviewDto) throws IOException {
        Optional<Product> optionalProduct = productRepository.findById(reviewDto.getProductId());

        if (optionalProduct.isPresent()) {
            Review review = new Review();

            review.setDescription(reviewDto.getDescription());
            review.setRating(reviewDto.getRating());
            review.setProduct(optionalProduct.get()); // On lie simplement à un produit

            log.info("Review details set for product ID: {}", reviewDto.getProductId());

            if (reviewDto.getImg() != null) {
                review.setImg(reviewDto.getImg().getBytes());
            }

            return reviewRepository.save(review).getDto();
        }
        log.error("Failed to give review. Product not found.");
        return null;
    }

}
