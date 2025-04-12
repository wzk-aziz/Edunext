package com.security.EduNext.Services;

import com.security.EduNext.Entities.ValidationResult;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RegistrationService {

    private static final List<String> BAD_WORDS = Arrays.asList("badwordd", "tit", "no");


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