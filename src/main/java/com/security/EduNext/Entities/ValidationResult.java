package com.security.EduNext.Entities;


public class ValidationResult {
    private boolean isValid;
    private String field;
    private String badWord;

    public ValidationResult(boolean isValid) {
        this.isValid = isValid;
    }

    public ValidationResult(boolean isValid, String field, String badWord) {
        this.isValid = isValid;
        this.field = field;
        this.badWord = badWord;
    }

    public boolean isValid() {
        return isValid;
    }

    public String getField() {
        return field;
    }

    public String getBadWord() {
        return badWord;
    }
}
