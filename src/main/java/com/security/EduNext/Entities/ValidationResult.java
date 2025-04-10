package com.security.EduNext.Entities;

public class ValidationResult {
    private boolean valid;
    private String invalidField;
    private String badWord;

    // Constructeurs, getters et setters
    public ValidationResult(boolean valid) {
        this.valid = valid;
    }

    public ValidationResult(boolean valid, String invalidField, String badWord) {
        this.valid = valid;
        this.invalidField = invalidField;
        this.badWord = badWord;
    }

    // Getters et setters
    public boolean isValid() {
        return valid;
    }

    public String getInvalidField() {
        return invalidField;
    }

    public String getBadWord() {
        return badWord;
    }
}


