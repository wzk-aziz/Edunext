package com.example.marketplacepi.services;

import com.example.EduNext.Entities.User;
import com.example.EduNext.Repositories.UserRepository;
import com.example.marketplacepi.dto.AnalyticsResponse;
import com.example.marketplacepi.dto.OrderDto;
import com.example.marketplacepi.enums.OrderStatus;
import com.example.marketplacepi.models.Order;
import com.example.marketplacepi.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminOrderServiceImpl implements AdminOrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;  // Assurez-vous d'avoir accès au repository User



    // Récupérer toutes les commandes d'un utilisateur spécifique
    public List<OrderDto> getOrdersByUserId(Long userId) {
        // Récupérer l'utilisateur à partir de l'ID
        Optional<User> userOptional = userRepository.findById(Math.toIntExact(userId));
        if (!userOptional.isPresent()) {
            log.error("Utilisateur non trouvé avec l'ID: {}", userId);
            return Collections.emptyList();  // Retourner une liste vide si l'utilisateur n'est pas trouvé
        }

        User user = userOptional.get();

        // Récupérer les commandes de cet utilisateur
        List<Order> orders = orderRepository.findByUserId(Long.valueOf(user.getId()));

        // Convertir les commandes en DTO et ajouter les informations de l'utilisateur dans chaque commande
        return orders.stream().map(order -> {
            OrderDto orderDto = order.getOrderDto();
            orderDto.setUserFullName(user.getFirstname() + " " + user.getLastname());  // Ajouter le nom complet de l'utilisateur
            return orderDto;
        }).collect(Collectors.toList());
    }

    public List<OrderDto> getAllPlacedOrders() {
        List<Order> orderList = orderRepository.findAllByOrderStatusIn(List.of(OrderStatus.Placed, OrderStatus.Shipped, OrderStatus.Delivered));
        return orderList.stream().map(order -> {
            User user = order.getUser(); // Récupérer l'utilisateur associé à la commande
            OrderDto orderDto = order.getOrderDto(); // Convertir la commande en DTO
            orderDto.setUserFullName(user != null ? user.getFirstname() : "Unknown User"); // Ajouter l'utilisateur au DTO
            return orderDto;
        }).collect(Collectors.toList());
    }

    public OrderDto changeOrderStatus(Long orderId, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (Objects.equals(status, "Shipped")) {
                order.setOrderStatus(OrderStatus.Shipped);
            } else if (Objects.equals(status, "Delivered")) {
                order.setOrderStatus(OrderStatus.Delivered);
            }
            // Récupérer l'utilisateur pour ajouter à la commande
            User user = order.getUser();
            OrderDto orderDto = orderRepository.save(order).getOrderDto();
            orderDto.setUserFullName(user != null ? user.getFirstname() : "Unknown User");
            return orderDto;
        }
        return null;
    }

    public AnalyticsResponse calculateAnalytics() {
        LocalDate currentDate = LocalDate.now();
        LocalDate previousMonthDate = currentDate.minusMonths(1);

        Long currentMonthOrders = getTotalOrdersForMonths(currentDate.getMonthValue(), currentDate.getYear());
        Long previousMonthOrders = getTotalOrdersForMonths(previousMonthDate.getMonthValue(), previousMonthDate.getYear());

        Long currentMonthEarning = getTotalEarningsForMonth(currentDate.getMonthValue(), currentDate.getYear());
        Long previousMonthEarning = getTotalEarningsForMonth(previousMonthDate.getMonthValue(), previousMonthDate.getYear());

        Long placed = orderRepository.countByOrderStatus(OrderStatus.Placed);
        Long shipped = orderRepository.countByOrderStatus(OrderStatus.Shipped);
        Long delivered = orderRepository.countByOrderStatus(OrderStatus.Delivered);

        return new AnalyticsResponse(placed, shipped, delivered, currentMonthOrders, previousMonthOrders, currentMonthEarning, previousMonthEarning);
    }

    public Long getTotalOrdersForMonths(int month, int year) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month - 1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startOfMonth = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        Date endOfMonth = calendar.getTime();

        List<Order> orders = orderRepository.findByDateBetweenAndOrderStatus(startOfMonth, endOfMonth, OrderStatus.Delivered);
        return (long) orders.size();
    }

    public Long getTotalEarningsForMonth(int month, int year) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month - 1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startOfMonth = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        Date endOfMonth = calendar.getTime();

        List<Order> orders = orderRepository.findByDateBetweenAndOrderStatus(startOfMonth, endOfMonth, OrderStatus.Delivered);

        Long sum = 0L;
        for (Order order : orders) {
            sum += order.getAmount();
        }
        return sum;
    }
}
