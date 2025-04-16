package com.example.marketplacepi.repository;


import com.example.marketplacepi.models.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByProductIdAndUserId(Long productId, Long userId); // Trouver un produit dans la wishlist d'un utilisateur
    List<Wishlist> findByUserId(Long userId); // Trouver toutes les wishlists d'un utilisateur
    Optional<Wishlist> findByProductId(Long productId);
}
