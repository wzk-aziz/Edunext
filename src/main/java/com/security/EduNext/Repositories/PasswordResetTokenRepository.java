package com.security.EduNext.Repositories;

import com.security.EduNext.Entities.PasswordResetToken;
import com.security.EduNext.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(User user);
    void deleteByUser(User user);
}
