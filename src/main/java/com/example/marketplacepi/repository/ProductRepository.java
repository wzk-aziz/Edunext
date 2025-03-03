package com.example.marketplacepi.repository;


import com.example.marketplacepi.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findAllByNameContaining(String title);
	List<Product> findByNameContainingIgnoreCase(String name);

	List<Product> findByCategory_NameIgnoreCase(String category);

	List<Product> findByPriceBetween(Double priceMin, Double priceMax);
	List<Product> findByNameContainingIgnoreCaseAndCategory_NameIgnoreCaseAndPriceBetween(
			String name, String category, Double priceMin, Double priceMax
	);
}
