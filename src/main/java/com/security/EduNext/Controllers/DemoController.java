package com.security.EduNext.Controllers;

import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.UserRepository;
import com.security.EduNext.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class DemoController {

    private final UserRepository userRepository;
    private final UserService userService;


    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Endpoint to get users by role (e.g., LEARNER, TEACHER)
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable Role role) {
        return userService.getUsersByRole(role);
    }



    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hello from secured endpoint!");
    }



}
