package com.example.codinggame.service;

import com.example.codinggame.entity.Compiler;
import com.example.codinggame.repository.CompilerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompilerService {

    private final CompilerRepository repository;

    @Autowired
    public CompilerService(CompilerRepository repository) {
        this.repository = repository;
    }

    public Compiler create(Compiler compiler) {
        return repository.save(compiler);
    }

    public Compiler get(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Compiler update(Long id, Compiler compiler) {
        if (repository.existsById(id)) {
            compiler.setId(id);
            return repository.save(compiler);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Compiler> list() {
        return repository.findAll();
    }
}
