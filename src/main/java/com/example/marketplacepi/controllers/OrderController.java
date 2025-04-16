package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.AnalyticsResponse;
import com.example.marketplacepi.dto.OrderDto;
import com.example.marketplacepi.services.AdminOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

	private final AdminOrderService adminOrderService;

	@GetMapping("/myOrders/{userId}")
	public ResponseEntity<List<OrderDto>> getOrdersByUserId(@PathVariable Long userId) {
		// Appel à la méthode dans AdminOrderService pour récupérer les commandes d'un utilisateur spécifique
		List<OrderDto> orders = adminOrderService.getOrdersByUserId(userId);
		if (orders.isEmpty()) {
			return ResponseEntity.noContent().build();  // Retourner un code 204 si aucune commande n'est trouvée
		}
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/placedOrders")
	public ResponseEntity<List<OrderDto>> getAllPlacedOrders() {
		log.info("Received request to get all placed orders");
		List<OrderDto> orders = adminOrderService.getAllPlacedOrders();
		log.info("Returning {} placed orders", orders.size());
		return ResponseEntity.ok(orders);
	}

	@PutMapping("/order/{orderId}/{status}")
	public ResponseEntity<?> changeOrderStatus(@PathVariable Long orderId, @PathVariable String status) {
		log.info("Received request to change order status for orderId: {} to status: {}", orderId, status);
		OrderDto orderDto = adminOrderService.changeOrderStatus(orderId, status);
		if (orderDto == null) {
			log.warn("Failed to change order status for orderId: {}", orderId);
			return ResponseEntity.badRequest().body("Something Went Wrong!!");
		}
		log.info("Successfully changed order status for orderId: {} to status: {}", orderId, status);
		return ResponseEntity.ok(orderDto);
	}

	@GetMapping("/order/analytics")
	public ResponseEntity<AnalyticsResponse> getAnalytics() {
		log.info("Received request to get order analytics");
		AnalyticsResponse analytics = adminOrderService.calculateAnalytics();
		log.info("Returning analytics response");
		return ResponseEntity.ok(analytics);
	}
}
