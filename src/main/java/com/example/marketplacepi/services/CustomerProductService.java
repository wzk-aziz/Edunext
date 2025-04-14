package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.ProductDetailDto;
import com.example.marketplacepi.dto.ProductDto;

import java.util.List;

public interface CustomerProductService {
	List<ProductDto> getAllProducts();

	List<ProductDto> getAllProductsByName(String name);
	
	ProductDetailDto getProductDetailById(Long productId);

}
