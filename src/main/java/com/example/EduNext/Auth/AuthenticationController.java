package com.example.EduNext.Auth;

import com.example.EduNext.Repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import com.example.EduNext.Entities.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;



    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestPart("request") String requestJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            RegisterRequest request = mapper.readValue(requestJson, RegisterRequest.class);

            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                request.setImage(fileName);

                // uploadDir doit être défini dans vos propriétés (@Value("${upload.dir}"))
                File uploadDirectory = new File(uploadDir);
                if (!uploadDirectory.exists()) {
                    uploadDirectory.mkdirs();
                }

                File dest = new File(uploadDirectory, fileName);
                file.transferTo(dest);
            }

            var response = service.register(request);

            if (request.isMfaEnabled()) {
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.accepted().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use!!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred!");
        }
    }

    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            // Chemin complet du fichier à partir du nom du fichier
            File file = new File(uploadDir + "/" + fileName);

            // Vérifie si le fichier existe
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Crée une ressource à partir du fichier
            Resource resource = new FileSystemResource(file);

            // Détecte le type du contenu
            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(file.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }

            // Retourne le fichier comme une ressource avec le bon content-type
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/user/image")
    public ResponseEntity<String> getUserImage(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || user.getImage() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }

        String imageUrl = "/api/v1/auth/files/" + user.getImage();
        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }







    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticateRequest request
    )
    {
        return ResponseEntity.ok(service.authenticate(request));
    }


    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(service.verifyCode(verificationRequest));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping
    public ResponseEntity<String> hello() {
        return  ResponseEntity.ok("hello from social medias");
    }


    @GetMapping("/redirect")
    public ResponseEntity<AuthenticationResponse> handleOAuth2Redirect(@RequestParam String token) {
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(token)
                .mfaEnabled(false)
                .build());
    }




}