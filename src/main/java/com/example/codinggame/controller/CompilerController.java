package com.example.codinggame.controller;

import com.example.codinggame.entity.Compiler;
import com.example.codinggame.service.CompilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compilers")
public class CompilerController {

    private final CompilerService service;

    @Autowired
    public CompilerController(CompilerService service) {
        this.service = service;
    }

    @PostMapping
    public Compiler create(@RequestBody Compiler compiler) {
        return service.create(compiler);
    }

    @GetMapping("/{id}")
    public Compiler get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public Compiler update(@PathVariable Long id, @RequestBody Compiler compiler) {
        return service.update(id, compiler);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping
    public List<Compiler> list() {
        return service.list();
    }
}
