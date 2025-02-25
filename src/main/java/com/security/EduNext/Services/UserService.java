package com.security.EduNext.Services;

import com.security.EduNext.Entities.User;
import com.security.EduNext.Entities.Role;  // Make sure to import the Role enum
import com.security.EduNext.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {


    private final UserRepository userRepository;
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Method to get users by role
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}
