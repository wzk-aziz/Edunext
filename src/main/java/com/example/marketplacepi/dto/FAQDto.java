package com.example.marketplacepi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class FAQDto {
	private Long id;
	
	private String question;
	
	private String answer;
	
	private Long productId;
}
