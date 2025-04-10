package com.security.EduNext.Services;

import com.security.EduNext.Entities.ValidationResult;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RegistrationService {

    private static final List<String> BAD_WORDS = Arrays.asList("badword", "tit", "no");

    public ValidationResult validateRegistration(String firstname, String lastname, String email, String password) {
        // Vérifier le prénom
        String badWord = containsBadWords(firstname);
        if (badWord != null) {
            return new ValidationResult(false, "firstname", badWord);
        }

        // Vérifier le nom
        badWord = containsBadWords(lastname);
        if (badWord != null) {
            return new ValidationResult(false, "lastname", badWord);
        }

        // Vérifier l'email
        badWord = containsBadWords(email);
        if (badWord != null) {
            return new ValidationResult(false, "email", badWord);
        }

        // Vérifier le mot de passe
        badWord = containsBadWords(password);
        if (badWord != null) {
            return new ValidationResult(false, "password", badWord);
        }

        return new ValidationResult(true);
    }

    private String containsBadWords(String input) {
        if (input == null) {
            return null;
        }

        String inputLower = input.toLowerCase();
        for (String badWord : BAD_WORDS) {
            if (inputLower.contains(badWord.toLowerCase())) {
                return badWord;
            }
        }
        return null;
    }
}