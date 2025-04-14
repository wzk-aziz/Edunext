package com.example.marketplacepi.models;

import com.example.marketplacepi.dto.WishlistDto;
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
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;



    public WishlistDto getWishlistDto() {
        return WishlistDto.builder()
                .id(id)
                .productId(product.getId())
                .returnedImg(product.getImg())
                .productName(product.getName())
                .productDescription(product.getDescription())
                .price(product.getPrice())
                .build();
    }

}

