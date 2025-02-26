package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.CategoryDto;
import com.example.marketplacepi.models.Category;
import com.example.marketplacepi.services.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/category")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryDto categoryDto) {
        log.info("Received request to create category with name: {}", categoryDto.getName());
        Category category = categoryService.createCategory(categoryDto);
        log.info("Category created with ID: {}", category.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        log.info("Received request to get category with ID: {}", categoryId);
        Category category = categoryService.getCategoryById(categoryId);
        if (category != null) {
            log.info("Category with ID: {} found", categoryId);
            return ResponseEntity.ok(category);
        } else {
            log.warn("Category with ID: {} not found", categoryId);
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategory() {
        log.info("Received request to get all categories");
        List<Category> categories = categoryService.getAllCategory();
        log.info("Returning {} categories", categories.size());
        return ResponseEntity.ok(categories);
    }
    @DeleteMapping("/category/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        log.info("Received request to delete category with ID: {}", categoryId);
        boolean deleted = categoryService.deleteCategory(categoryId);
        if (deleted) {
            log.info("Category with ID: {} deleted successfully", categoryId);
            return ResponseEntity.noContent().build();  // Retourne un 204 No Content en cas de succès
        } else {
            log.warn("Category with ID: {} not found", categoryId);
            return ResponseEntity.notFound().build();  // Retourne un 404 Not Found si la catégorie n'est pas trouvée
        }
    }
    // Nouvelle méthode pour mettre à jour une catégorie
    @PutMapping("/category/{categoryId}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryDto categoryDto) {
        log.info("Received request to update category with ID: {}", categoryId);
        Category updatedCategory = categoryService.updateCategory(categoryId, categoryDto);
        if (updatedCategory != null) {
            log.info("Category with ID: {} updated successfully", categoryId);
            return ResponseEntity.ok(updatedCategory);  // Retourne un 200 OK avec la catégorie mise à jour
        } else {
            log.warn("Category with ID: {} not found", categoryId);
            return ResponseEntity.notFound().build();  // Retourne un 404 Not Found si la catégorie n'est pas trouvée
        }
    }

}
