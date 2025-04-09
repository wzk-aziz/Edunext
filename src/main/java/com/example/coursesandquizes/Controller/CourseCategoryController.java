package com.example.coursesandquizes.Controller;


import com.example.coursesandquizes.Entities.CourseCategory;
import com.example.coursesandquizes.Service.CourseCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/categories")
public class CourseCategoryController {
    private final CourseCategoryService courseCategoryService;

    public CourseCategoryController(CourseCategoryService courseCategoryService) {
        this.courseCategoryService = courseCategoryService;
    }

    @GetMapping("/all")
    public List<CourseCategory> getAllCategories() {
        return courseCategoryService.getAllCategories();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestBody CourseCategory courseCategory) {
        try {
            CourseCategory saved = courseCategoryService.saveCategory(courseCategory);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating courseCategory: " + e.getMessage());
        }
    }
@GetMapping("/{id}")
public ResponseEntity<CourseCategory> getCategoryById(@PathVariable Long id) {
    return courseCategoryService.getCategoryById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
}

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            courseCategoryService.deleteCategory(id);
            return ResponseEntity.ok("CourseCategory deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting category: " + e.getMessage());
        }
    }
}
