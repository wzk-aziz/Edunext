package com.example.marketplacepi.services;



import com.example.marketplacepi.dto.ProductDto;
import com.example.marketplacepi.models.Product;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface AdminProductService {

    ProductDto addProduct(ProductDto productDto) throws Exception;

    List<ProductDto> getAllProducts();

    List<ProductDto> getAllProductsByName(String name);

    boolean deleteProduct(Long id);

    ProductDto getProductById(Long productId);

    ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException;
    Optional<Product> getProduit(Long id);
    List<ProductDto> searchProducts(String name, String category, Double priceMin, Double priceMax, String sortBy);
}
