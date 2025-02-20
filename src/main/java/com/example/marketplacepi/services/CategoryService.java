package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.CategoryDto;
import com.example.marketplacepi.models.Category;

import java.util.List;

public interface CategoryService {
	 Category createCategory(CategoryDto categoryDto);
	 List<Category> getAllCategory();

	boolean deleteCategory(Long categoryId);
}
