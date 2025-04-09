package com.example.codinggame.controller;

import com.example.codinggame.entity.Problem;
import com.example.codinggame.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problems")
@CrossOrigin(origins = "http://localhost:4200")
public class ProblemController {

    private final ProblemService service;
    @Autowired
    public ProblemController(ProblemService service) {
        this.service = service;
    }


    @PostMapping
    public Problem create(@RequestBody Problem problem) { return service.create(problem); }

    @GetMapping("/{id}")
    public Problem get(@PathVariable Long id) { return service.get(id); }

    @PutMapping("/{id}")
    public Problem update(@PathVariable Long id, @RequestBody Problem problem) { return service.update(id, problem); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping
    public List<Problem> list() { return service.list(); }
}