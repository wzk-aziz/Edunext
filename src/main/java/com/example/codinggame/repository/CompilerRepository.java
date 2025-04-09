package com.example.codinggame.repository;

import com.example.codinggame.entity.Compiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompilerRepository extends JpaRepository<Compiler, Long> {
}
