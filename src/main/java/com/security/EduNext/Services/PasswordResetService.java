package com.security.EduNext.Services;

import com.security.EduNext.Entities.PasswordResetToken;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.PasswordResetTokenRepository;
import com.security.EduNext.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PasswordResetService {


    private final UserRepository userRepository;


    private final PasswordResetTokenRepository tokenRepository;


    private final PasswordEncoder passwordEncoder;


    private final EmailService emailService;



    @Transactional
    public void createPasswordResetTokenForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PasswordResetToken existingToken = tokenRepository.findByUser(user);
        if (existingToken != null) {
            tokenRepository.delete(existingToken);
        }

        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());

    }

    @Transactional
    public void validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            throw new RuntimeException("Invalid token");
        }

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token has expired");
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            throw new RuntimeException("Invalid token");
        }

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
