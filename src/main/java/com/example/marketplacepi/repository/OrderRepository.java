package com.example.marketplacepi.repository;


import com.example.EduNext.Entities.User;
import com.example.marketplacepi.enums.OrderStatus;
import com.example.marketplacepi.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByUserId(Long userId);  // Récupérer les commandes par ID utilisateur
	List<Order> findAllByOrderStatusIn(List<OrderStatus> orderStatusList);

	Order findByOrderStatusAndUser(OrderStatus orderStatus, User user);

	Optional<Order> findByTrackingId(UUID trackingId);
	
	List<Order> findByDateBetweenAndOrderStatus(Date startOfMonth,Date endOfMonth,OrderStatus status);
	
	Long countByOrderStatus(OrderStatus status);

	Order findByOrderStatus(OrderStatus orderStatus);
	List<Order> findByOrderStatusIn(List<OrderStatus> statuses);
	List<Order> findAll();

}

