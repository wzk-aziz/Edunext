package com.security.EduNext.Controllers;

import com.security.EduNext.Repositories.UserRepository;
import com.security.EduNext.Auth.AuthenticationService;
import com.security.EduNext.Auth.UpdateUserRequest;
import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Services.PdfService;
import com.security.EduNext.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final UserRepository userRepository;

    private final AuthenticationService authenticationService;

    private final PdfService pdfService;



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

    @GetMapping("/profile/me")
    public ResponseEntity<User> getMyProfile() {
        Integer userId = userService.getLoggedInUserId(); // Récupère l'ID de l'utilisateur connecté
        Optional<User> user = userService.getUserById(userId);

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    @GetMapping("/banned")
    public ResponseEntity<List<User>> getAllBannedUsers() {
        List<User> bannedUsers = userService.getAllBannedUsers();
        return ResponseEntity.ok(bannedUsers);
    }


    @GetMapping("/bannedByRole")
    public List<User> getBannedUsersByRole(@RequestParam Role role) {
        return userService.getBannedUsersByRole(role);
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadUserPdf(@PathVariable Integer id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayInputStream pdfStream = pdfService.generateUserPdf(userOptional.get());
        byte[] pdfBytes = pdfStream.readAllBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
                .attachment()
                .filename("user_profile_" + id + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }





}
