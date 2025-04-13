package com.example.marketplacepi.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;


@Data
@Builder
public class ProductDto {
	private Long id;
	
	private String name;
	
	private Long price;
	
	private String description;

	private byte[] byteImg;
	
	private Long categoryId;
	
	private String categoryName; 
	
	private MultipartFile img;	
	
	private Long quantity;
}
