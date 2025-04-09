package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.FAQDto;
import com.example.marketplacepi.dto.ProductDto;
import com.example.marketplacepi.models.Product;
import com.example.marketplacepi.services.AdminProductService;
import com.example.marketplacepi.services.FAQService;
import org.springframework.core.io.UrlResource; // Ajout de l'import pour UrlResource

import org.springframework.core.io.Resource;  // Assurez-vous que c'est cet import
import org.springframework.core.io.UrlResource;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

	private final AdminProductService adminProductService;
	private final FAQService faqService;

	@PostMapping("/product")
	public ResponseEntity<ProductDto> addProduct(@ModelAttribute ProductDto productDto,
												 @RequestParam("pdf") MultipartFile pdfFile) throws Exception {
		log.info("Received request to add a product with name: {}", productDto.getName());

		// Ajout du fichier PDF dans le DTO et appel du service
		productDto.setPdf(pdfFile);

		ProductDto productDto1 = adminProductService.addProduct(productDto);

		log.info("Product added with ID: {}", productDto1.getId());
		return ResponseEntity.status(HttpStatus.CREATED).body(productDto1);
	}

	@GetMapping("/product/{productId}/pdf")
	public ResponseEntity<Resource> downloadPdf(@PathVariable Long productId) throws IOException {
		Optional<Product> productOptional = adminProductService.getProduit(productId);

		if (!productOptional.isPresent()) {
			return ResponseEntity.notFound().build();
		}

		Product product = productOptional.get();
		String pdfPath = product.getPdfPath();

		// Charge le fichier PDF
		Path path = Paths.get(pdfPath);
		Resource resource = new UrlResource(path.toUri());

		if (resource.exists() || resource.isReadable()) {
			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path.getFileName() + "\"")
					.body(resource);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}


	@GetMapping("/products")
	public ResponseEntity<List<ProductDto>> getAllProduct() {
		log.info("Received request to get all products");
		List<ProductDto> productDtos = adminProductService.getAllProducts();
		log.info("Returning {} products", productDtos.size());
		return ResponseEntity.ok(productDtos);
	}

	@GetMapping("/search/{name}")
	public ResponseEntity<List<ProductDto>> getAllProductByName(@PathVariable String name) {
		log.info("Received request to get products by name: {}", name);
		List<ProductDto> productDtos = adminProductService.getAllProductsByName(name);
		log.info("Returning {} products with name: {}", productDtos.size(), name);
		return ResponseEntity.ok(productDtos);
	}

	@DeleteMapping("/product/{productId}")
	public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
		log.info("Received request to delete product with ID: {}", productId);
		boolean deleted = adminProductService.deleteProduct(productId);
		if (deleted) {
			log.info("Product with ID: {} deleted successfully", productId);
			return ResponseEntity.noContent().build();
		} else {
			log.warn("Product with ID: {} not found", productId);
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/faq/{productId}")
	public ResponseEntity<FAQDto> postFAQ(@PathVariable Long productId, @RequestBody FAQDto faqDto) {
		log.info("Received request to add FAQ for product with ID: {}", productId);
		FAQDto createdFAQ = faqService.postFAQ(productId, faqDto);
		log.info("FAQ added for product with ID: {}", productId);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdFAQ);
	}

	@GetMapping("/product/{productId}")
	public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId) {
		log.info("Received request to get product by ID: {}", productId);
		ProductDto productDto = adminProductService.getProductById(productId);
		if (productDto != null) {
			log.info("Returning product with ID: {}", productId);
			return ResponseEntity.ok(productDto);
		} else {
			log.warn("Product with ID: {} not found", productId);
			return ResponseEntity.notFound().build();
		}
	}
	@GetMapping("/search")
	public List<ProductDto> searchProducts(
			@RequestParam(required = false) String name,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) Double priceMin,
			@RequestParam(required = false) Double priceMax,
			@RequestParam(required = false, defaultValue = "name") String sortBy) {  // Valeur par défaut : tri par nom
		return adminProductService.searchProducts(name, category, priceMin, priceMax, sortBy);
	}

	@PutMapping("/product/{productId}")
	public ResponseEntity<ProductDto> updateProduct(@PathVariable Long productId, @ModelAttribute ProductDto productDto) throws IOException, IOException {
		log.info("Received request to update product with ID: {}", productId);
		ProductDto updatedProduct = adminProductService.updateProduct(productId, productDto);
		if (updatedProduct != null) {
			log.info("Product with ID: {} updated successfully", productId);
			return ResponseEntity.ok(updatedProduct);
		} else {
			log.warn("Product with ID: {} not found for update", productId);
			return ResponseEntity.notFound().build();
		}
	}


}
