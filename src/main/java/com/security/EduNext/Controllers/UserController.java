package com.security.EduNext.Controllers;

import com.security.EduNext.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import com.security.EduNext.Auth.AuthenticationService;
import com.security.EduNext.Auth.UpdateUserRequest;
import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final UserRepository userRepository;

    private final AuthenticationService authenticationService;



    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users); // Renvoie les utilisateurs avec un code 200 OK
    }


    @GetMapping("/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        Role roleEnum = Role.valueOf(role.toUpperCase());  // Convertit le String en enum Role
        List<User> users = userService.getUsersByRole(roleEnum);
        return ResponseEntity.ok(users);
    }


    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from secured endpoint!"); // Endpoint de test
    }

    @PutMapping("/ban/{id}")
    public ResponseEntity<String> banUser(@PathVariable Integer id) {
        userService.banUser(id);
        return ResponseEntity.ok("Utilisateur banni avec succès");
    }

    @PutMapping("/unban/{id}")
    public ResponseEntity<String> unbanUser(@PathVariable Integer id) {
        userService.unbanUser(id);
        return ResponseEntity.ok("Utilisateur débanni avec succès");
    }


    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody UpdateUserRequest request) {
        // Vous pouvez ici valider ou transformer la requête si nécessaire
        return userService.updateUser(request, id);
    }


}
