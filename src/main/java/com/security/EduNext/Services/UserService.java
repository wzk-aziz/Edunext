package com.security.EduNext.Services;

import com.security.EduNext.Auth.UpdateUserRequest;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Entities.Role;  // Make sure to import the Role enum
import com.security.EduNext.Repositories.TokenRepository;
import com.security.EduNext.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {


    private final UserRepository userRepository;

    private final TokenRepository tokenRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Method to get users by role
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public boolean deleteUserById(Integer userId) {

        tokenRepository.deleteByUserId(userId);

        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }


    public User updateUser(UpdateUserRequest request, Integer userId) {
        Optional<User> existingUserOptional = userRepository.findById(userId);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            // Mise à jour des champs avec les données du request
            existingUser.setFirstname(request.getFirstname());
            existingUser.setLastname(request.getLastname());
            existingUser.setEmail(request.getEmail());
            existingUser.setPassword(request.getPassword());
            existingUser.setMfaEnabled(request.isMfaEnabled());
            // existingUser.setRole(request.getRole()); // si besoin de mettre à jour le rôle

            // Sauvegarde l'utilisateur mis à jour
            return userRepository.save(existingUser);
        }

        throw new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId);
    }




}
