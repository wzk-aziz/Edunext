package com.example.marketplacepi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class PlaceOrderDto {


	private String address;
	
	private String orderDescription;
	
}
