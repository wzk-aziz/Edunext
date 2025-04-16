package com.example.marketplacepi.models;

import com.example.marketplacepi.dto.CartItemsDto;
import com.example.EduNext.Entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CartItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long price;

    private Long quantity;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;



    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;


    public CartItemsDto getCartDto() {
        return CartItemsDto.builder()
                .id(id)
                .price(price)
                .productId(product.getId())
                .quantity(quantity)
                .productName(product.getName())
                .returnedImage(product.getImg())
                .userId(user != null ? user.getId() : null)
                .userFullName(user != null ? user.getFirstname() + " " + user.getLastname() : null)
                .build();
    }
}

