package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.ProductDto;
import com.example.marketplacepi.models.Category;
import com.example.marketplacepi.models.Product;
import com.example.marketplacepi.repository.CategoryRepository;
import com.example.marketplacepi.repository.ProductRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;



import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;


    private static final String PDF_DIRECTORY = "uploads/pdfs/";

    public String savePdf(MultipartFile file) {
        try {
            // Crée un nom de fichier unique pour éviter les conflits
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Spécifie le répertoire de stockage des fichiers PDF
            Path path = Paths.get(PDF_DIRECTORY + fileName);

            // Crée le répertoire si nécessaire
            Files.createDirectories(path.getParent());

            // Sauvegarde le fichier sur le disque
            Files.write(path, file.getBytes());

            // Retourne le chemin où le fichier PDF a été sauvegardé
            return path.toString();
        } catch (IOException e) {
            log.error("Error saving PDF file", e);
            throw new RuntimeException("Error saving PDF file", e);
        }
    }

    public Optional<Product> getProduit(Long id) {
        return productRepository.findById(id);
    }
    public ProductDto addProduct(ProductDto productDto) throws Exception {
        log.info("Adding a new product: {}", productDto.getName());

        // Récupère la catégorie associée
        Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow();

        // Crée le produit sans le PDF
        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .img(productDto.getImg().getBytes())  // Traitement de l'image
                .category(category)
                .build();

        // Vérifie si un fichier PDF a été téléchargé
        if (productDto.getPdf() != null && !productDto.getPdf().isEmpty()) {
            // Sauvegarde le fichier PDF et obtient son chemin
            String pdfPath = savePdf(productDto.getPdf());
            product.setPdfPath(pdfPath);  // Associe le chemin du PDF au produit
        }

        // Sauvegarde le produit dans la base de données
        Product savedProduct = productRepository.save(product);

        // Retourne le DTO du produit sauvegardé
        return savedProduct.getDto();
    }



    public List<ProductDto> getAllProducts() {
        log.info("Fetching all products.");
        List<Product> products = productRepository.findAll();
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductsByName(String name) {
        log.info("Fetching all products by name: {}", name);
        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public boolean deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ProductDto getProductById(Long productId) {
        log.info("Fetching product with ID: {}", productId);
        Optional<Product> optionalProduct = productRepository.findById(productId);
        return optionalProduct.map(Product::getDto).orElse(null);
    }
    public List<ProductDto> searchProducts(String name, String category, Double priceMin, Double priceMax, String sortBy) {
        log.info("Recherche de produits avec filtres : name={}, category={}, priceMin={}, priceMax={}, sortBy={}",
                name, category, priceMin, priceMax, sortBy);

        List<Product> products;

        if (name != null && category != null && priceMin != null && priceMax != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndCategory_NameIgnoreCaseAndPriceBetween(name, category, priceMin, priceMax);
        } else if (name != null) {
            products = productRepository.findByNameContainingIgnoreCase(name);
        } else if (category != null) {
            products = productRepository.findByCategory_NameIgnoreCase(category);
        } else if (priceMin != null && priceMax != null) {
            products = productRepository.findByPriceBetween(priceMin, priceMax);
        } else {
            products = productRepository.findAll();
        }

        // Ajout de la logique de tri
        switch (sortBy) {
            case "priceAsc":
                products.sort(Comparator.comparing(Product::getPrice));
                break;
            case "priceDesc":
                products.sort(Comparator.comparing(Product::getPrice).reversed());
                break;
            case "name":
            default:
                products.sort(Comparator.comparing(Product::getName));
                break;
        }

        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public ProductDto updateProduct(Long productId, ProductDto productDto) {
        log.info("Updating product with ID: {}", productId);
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Optional<Category> optionalCategory = categoryRepository.findById(productDto.getCategoryId());

        if (optionalProduct.isPresent() && optionalCategory.isPresent()) {
            Product product = optionalProduct.get().toBuilder()
                    .name(productDto.getName())
                    .price(productDto.getPrice())
                    .description(productDto.getDescription())
                    .category(optionalCategory.get())
                    .img(productDto.getByteImg() != null ? productDto.getByteImg() : optionalProduct.get().getImg())
                    .build();
            Product savedProduct = productRepository.save(product);
            return savedProduct.getDto();
        }
        return null;
    }

}