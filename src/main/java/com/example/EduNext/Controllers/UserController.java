package com.example.EduNext.Controllers;


import com.example.EduNext.Auth.AuthenticationService;
import com.example.EduNext.Auth.UpdateUserRequest;
import com.example.EduNext.Entities.Role;
import com.example.EduNext.Entities.User;
import com.example.EduNext.Repositories.UserRepository;
import com.example.EduNext.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
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


    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }




}