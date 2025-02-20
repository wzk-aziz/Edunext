package com.example.marketplacepi.models;

import com.example.marketplacepi.dto.OrderDto;
import com.example.marketplacepi.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId;  // Identifiant unique pour le panier
    private String orderDescription;

    private Date date;

    private Long amount;

    private String address;

    private String payment;

    private OrderStatus orderStatus;

    private Long totalAmount;

    private Long discount;

    private UUID trackingId;


    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "coupon_id", referencedColumnName = "id")
    private Coupon coupon;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "order")
    private List<CartItems> cartItems;

    public OrderDto getOrderDto() {

        return OrderDto.builder()
                .id(id)
                .orderDescription(orderDescription)
                .date(date)
                .amount(amount)
                .address(address)
                .totalAmount(totalAmount)
                .discount(discount)
                .payment(payment)
                .orderStatus(orderStatus)
                .trackingId(trackingId)
                .couponName(coupon != null ? coupon.getName() : null)
                .build();

    }

}

