package com.example.coursesandquizes.Service;

import com.example.coursesandquizes.Entities.CourseCategory;
import com.example.coursesandquizes.Repository.CourseCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseCategoryService {

    private final CourseCategoryRepository courseCategoryRepository;

    public CourseCategoryService(CourseCategoryRepository courseCategoryRepository) {
        this.courseCategoryRepository = courseCategoryRepository;
    }

    public List<CourseCategory> getAllCategories() {
        return courseCategoryRepository.findAll();
    }

    public Optional<CourseCategory> getCategoryById(Long id) {
        return courseCategoryRepository.findById(id);
    }

    public CourseCategory saveCategory(CourseCategory courseCategory) {
        return courseCategoryRepository.save(courseCategory);
    }

    public void deleteCategory(Long id) {
        courseCategoryRepository.deleteById(id);
    }
}
