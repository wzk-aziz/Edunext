package com.example.codinggame.service;

import com.example.codinggame.entity.Language;
import com.example.codinggame.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageService {
    private final LanguageRepository repository;

    @Autowired
    public LanguageService(LanguageRepository repository) {
        this.repository = repository;
    }

    public Language create(Language language) {
        return repository.save(language);
    }

    public Language get(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Language update(Long id, Language language) {
        if (repository.existsById(id)) {
            language.setId(id);
            return repository.save(language);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Language> list() {
        return repository.findAll();
    }
}
