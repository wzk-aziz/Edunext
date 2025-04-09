package com.example.EduNext.OAuth2;

import com.example.EduNext.Entities.Role;
import com.example.EduNext.Repositories.UserRepository;
import com.example.EduNext.Security.JwtService;
import com.example.EduNext.Entities.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Create new user if not exists
                    User newUser = User.builder()
                            .email(email)
                            .firstname(name != null ? name.split(" ")[0] : "")
                            .lastname(name != null && name.split(" ").length > 1 ? name.split(" ")[1] : "")
                            .role(Role.USER)
                            .mfaEnabled(false)
                            .build();
                    return userRepository.save(newUser);
                });

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Redirect to frontend with token
        String redirectUrl = "/oauth2/redirect?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}