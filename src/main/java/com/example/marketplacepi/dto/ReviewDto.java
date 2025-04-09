package com.example.marketplacepi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ReviewDto {
	private Long id;

	private Long rating;

	private String description;

	private MultipartFile img;
	
	private byte[] returnedImg;

	private Long productId;

}
