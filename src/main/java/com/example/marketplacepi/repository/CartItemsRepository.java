package com.example.marketplacepi.repository;


import com.example.marketplacepi.models.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemsRepository extends JpaRepository<CartItems, Long>{


    Optional<CartItems> findByProductIdAndOrderId(Long productId, Long id);


}
