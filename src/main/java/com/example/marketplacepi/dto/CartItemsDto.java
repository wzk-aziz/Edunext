package com.example.marketplacepi.dto;

import lombok.AllArgsConstructor;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CartItemsDto {
	private Long id;
	private Long price;
	private Long quantity;
	private Long productId;
	private Long orderId;
	private String productName;
	private byte[] returnedImage;
	private Integer userId;
	private String userFullName;

}
