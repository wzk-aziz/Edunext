package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.CategoryDto;
import com.example.marketplacepi.models.Category;
import com.example.marketplacepi.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;

	public Category createCategory(CategoryDto categoryDto) {
		log.info("Creating a new category: {}", categoryDto.getName());
		return categoryRepository.save(
				Category.builder()
						.name(categoryDto.getName())
						.description(categoryDto.getDescription())
						.build()
		);
	}

	public List<Category> getAllCategory() {
		log.info("Fetching all categories.");
		return categoryRepository.findAll();
	}
	public boolean deleteCategory(Long id) {
		log.info("Deleting category with ID: {}", id);
		Optional<Category> categoryOptional = categoryRepository.findById(id);
		if (categoryOptional.isPresent()) {
			categoryRepository.deleteById(id);
			return true;
		}
		return false;
	}
	// Nouvelle méthode pour mettre à jour une catégorie
	public Category updateCategory(Long categoryId, CategoryDto categoryDto) {
		log.info("Updating category with ID: {}", categoryId);
		Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
		if (categoryOptional.isPresent()) {
			Category category = categoryOptional.get();
			category.setName(categoryDto.getName());
			category.setDescription(categoryDto.getDescription());
			return categoryRepository.save(category);
		}
		return null;
	}
	public Category getCategoryById(Long id) {
		log.info("Fetching category with ID: {}", id);
		return categoryRepository.findById(id).orElse(null);
	}


}
