package com.example.EduNext.Services;


import org.jvnet.hk2.annotations.Service;

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