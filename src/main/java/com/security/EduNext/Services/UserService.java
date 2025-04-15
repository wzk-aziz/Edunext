
package com.security.EduNext.Services;

import com.security.EduNext.Auth.UpdateUserRequest;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Entities.Role;  // Make sure to import the Role enum
import com.security.EduNext.Repositories.TokenRepository;
import com.security.EduNext.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {


    private final UserRepository userRepository;

    private final TokenRepository tokenRepository;

    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Method to get users by role
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public void banUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setBanned(true);
        userRepository.save(user);
    }

    public void unbanUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setBanned(false);
        userRepository.save(user);
    }

    public List<User> getAllBannedUsers() {
        return userRepository.findByBannedTrue();
    }

    public List<User> getBannedUsersByRole(Role role) {
        return userRepository.findBannedUsersByRole(role);
    }




    public User updateUser(UpdateUserRequest request, Integer userId) {
        // Récupérer l'ID de l'utilisateur connecté
        Integer loggedInUserId = getLoggedInUserId();  // Implémentez cette méthode selon votre configuration de sécurité

        // Vérifier si l'utilisateur connecté est un administrateur
        boolean isAdmin = isAdmin(loggedInUserId);  // Vous devez implémenter cette méthode pour vérifier si l'utilisateur est admin

        // Si l'utilisateur n'est pas un admin, il ne peut mettre à jour que son propre profil
        if (!isAdmin && !userId.equals(loggedInUserId)) {
            throw new RuntimeException("Vous ne pouvez pas modifier un autre profil.");
        }

        Optional<User> existingUserOptional = userRepository.findById(userId);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            // Mise à jour des champs avec les données du request
            existingUser.setFirstname(request.getFirstname());
            existingUser.setLastname(request.getLastname());
            existingUser.setEmail(request.getEmail());
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            existingUser.setPassword(encodedPassword); // Utilisez le mot de passe encodé ici
            existingUser.setMfaEnabled(request.isMfaEnabled());
            // existingUser.setRole(request.getRole()); // si besoin de mettre à jour le rôle

            // Sauvegarde l'utilisateur mis à jour
            return userRepository.save(existingUser);
        }

        throw new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId);
    }

    // Méthode pour obtenir l'ID de l'utilisateur connecté

    // Méthode pour obtenir l'ID de l'utilisateur connecté
    public Integer getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // If you're using JWT and storing email as subject
        String email = authentication.getName(); // This gets the subject from JWT token
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }


    // Méthode pour vérifier si l'utilisateur est un admin
    private boolean isAdmin(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && user.get().getRole().equals("ADMIN");  // Vérifiez le rôle de l'utilisateur
    }


    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }








}
