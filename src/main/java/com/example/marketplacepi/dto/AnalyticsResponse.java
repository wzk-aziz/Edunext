package com.example.marketplacepi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class AnalyticsResponse {

	private Long placed;
	
	private Long shipped;
	
	private Long delivered;
	
	private Long currentMonthOrders;
	
	private Long previousMonthOrders;
	
	private Long currentMonthEarnings;
	
	private Long previousMonthEarnings;
	
}
