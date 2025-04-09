package com.example.codinggame.controller;

import com.example.codinggame.entity.Language;
import com.example.codinggame.service.LanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200") // Autorise Angular
@RestController
@RequestMapping("/languages")
public class LanguageController {
    private final LanguageService service;

    @Autowired
    public LanguageController(LanguageService service) {
        this.service = service;
    }

    @PostMapping
    public Language create(@RequestBody Language language) {
        return service.create(language);
    }

    @GetMapping("/{id}")
    public Language get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public Language update(@PathVariable Long id, @RequestBody Language language) {
        return service.update(id, language);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping
    public List<Language> list() {
        return service.list();
    }
}
