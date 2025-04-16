package com.security.EduNext.Auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.security.EduNext.Security.JwtService;
import com.security.EduNext.Entities.Token;
import com.security.EduNext.Entities.TokenType;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.TokenRepository;
import com.security.EduNext.Repositories.UserRepository;
import com.security.EduNext.Tfa.TwoFactorAuthenticationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import java.io.IOException;
import com.security.EduNext.Services.EmailService;
import jakarta.mail.MessagingException;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final TokenRepository tokenRepository;
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TwoFactorAuthenticationService tfaService;
    private final EmailService emailService;


    public AuthenticationResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .mfaEnabled(request.isMfaEnabled())
                .Image(request.getImage())
                .phoneNumber(request.getPhonenumber()) // Add this line
                .build();

        if (request.isMfaEnabled()) {
            String secret = tfaService.generateNewSecret();
            user.setSecret(secret);

            try {
                // Generate a 6-digit code from the secret
                String code = tfaService.generateCurrentCode(secret);
                emailService.sendMfaCode(user.getEmail(), code);
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send verification email", e);
            }
        }

        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .secretImageUri(tfaService.generateQrCodeImageUri(user.getSecret()))
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticateRequest request) {
        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Fetch user from repository
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier si l'utilisateur est banni
        if (user.isBanned()) {
            throw new RuntimeException("Votre compte est banni. Contactez l'administrateur.");
        }

        // Check if MFA is enabled
        if (user.isMfaEnabled()) {
            return AuthenticationResponse.builder()
                    .accessToken("")
                    .refreshToken("")
                    .mfaEnabled(true)
                    .role(user.getRole().name())  // Add role to response
                    .firstName(user.getFirstname()) // Ajouter prénom
                    .lastName(user.getLastname()) // Ajouter nom
                    .email(user.getEmail()) // Ajouter email
                    .userId(user.getId()) // Ajouter l'ID utilisateur
                    .build();
        }

        revokeAllUserTokens(user);


        // Générer un token si l'utilisateur n'est pas banni et MFA désactivé
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(user, accessToken); // AJOUTE ÇA


        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .mfaEnabled(false)
                .role(user.getRole().name())
                .firstName(user.getFirstname()) // Ajouter prénom
                .lastName(user.getLastname()) // Ajouter nom
                .email(user.getEmail()) // Ajouter email
                .userId(user.getId()) // Ajouter l'ID utilisateur
                .build();
    }







    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllByValidTokensByUser(user.getId());
        if(validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }


    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail =jwtService.extractUsername(refreshToken);
        if (userEmail != null ) {
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)){
                var accessToken = jwtService.generateToken(user);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .mfaEnabled(false)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {

        User user = repository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("No user found with %S", verificationRequest.getEmail())
                ));
        if (tfaService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())){
            throw new BadCredentialsException("Code is not correct");
        }
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }






}
