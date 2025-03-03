package com.example.marketplacepi.services;



import com.example.marketplacepi.dto.AnalyticsResponse;
import com.example.marketplacepi.dto.OrderDto;

import java.util.List;

public interface AdminOrderService {
    List<OrderDto> getAllPlacedOrders();

    OrderDto changeOrderStatus(Long orderId, String status);

    AnalyticsResponse calculateAnalytics();

    Long getTotalOrdersForMonths(int month, int year);

    Long getTotalEarningsForMonth(int month, int year);
}
