package com.security.EduNext.Services;

import com.security.EduNext.Entities.PasswordResetToken;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.PasswordResetTokenRepository;
import com.security.EduNext.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PasswordResetService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SmsService smsService;

    @Transactional
    public void createPasswordResetTokenForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password reset requested for non-existent email: {}", email);
                    return new RuntimeException("User not found");
                });

        // Clean up any existing tokens
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());

        // Send SMS if phone number exists
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) {
            smsService.sendPasswordResetSMS(user.getPhoneNumber(), token.getToken());
        } else {
            logger.warn("User {} has no phone number registered, skipping SMS", email);
        }
    }

    @Transactional
    public void validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    logger.warn("Invalid password reset token attempted: {}", token);
                    return new RuntimeException("Invalid token");
                });

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            logger.warn("Expired token attempted: {}", token);
            throw new RuntimeException("Token has expired");
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);

        logger.info("Password successfully reset for user: {}", user.getEmail());
    }
}