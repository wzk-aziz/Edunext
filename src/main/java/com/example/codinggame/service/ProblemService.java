package com.example.codinggame.service;

import com.example.codinggame.entity.Problem;
import com.example.codinggame.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {
    private final ProblemRepository repository;

    @Autowired
    public ProblemService(ProblemRepository repository) {
        this.repository = repository;
    }

    public Problem create(Problem problem) {
        return repository.save(problem);
    }

    public Problem get(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Problem update(Long id, Problem problem) {
        if (repository.existsById(id)) {
            problem.setId(id);
            return repository.save(problem);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Problem> list() {
        return repository.findAll();
    }
}