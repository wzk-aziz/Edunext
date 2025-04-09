package com.esprit.microservice.coursesandquizes.Repository;

import com.esprit.microservice.coursesandquizes.Entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}