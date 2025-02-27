package com.security.EduNext.Auth;

import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            var response = service.register(request);
            // Si MFA est activé, on retourne la réponse avec l'image QR et les tokens
            if (request.isMfaEnabled()) {
                return ResponseEntity.ok(response);
            }
            // Si MFA n'est pas activé, on accepte la requête sans corps de réponse
            return ResponseEntity.accepted().build();
        } catch (RuntimeException e) {
            // En cas d'erreur (par exemple, email déjà existant), on retourne un BadRequest
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use!!");
        }
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticateRequest request
    )
    {
        return ResponseEntity.ok(service.authenticate(request));
    }


    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(service.verifyCode(verificationRequest));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }




}
