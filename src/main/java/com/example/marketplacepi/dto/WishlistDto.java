package com.example.marketplacepi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class WishlistDto {
	
	private Long productId;
	
	private Long id;
	
	private String productName;
	
	private String productDescription;
	
	private byte[] returnedImg;
	
	private Long price;
	
}
