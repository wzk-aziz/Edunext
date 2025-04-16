package com.security.EduNext.OAuth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.security.EduNext.Auth.AuthenticationResponse;
import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.UserRepository;
import com.security.EduNext.Security.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");
        String pictureUrl = (String) attributes.get("picture");

        // Check if user exists in your database
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Create new user if not exists
                    User newUser = User.builder()
                            .firstname(firstName)
                            .lastname(lastName)
                            .email(email)
                            .role(Role.LEARNER) // Default role
                            .Image(pictureUrl)
                            .mfaEnabled(false)
                            .build();
                    return userRepository.save(newUser);
                });

        // Generate JWT token
        String jwtToken = jwtService.generateToken(user);

        // Check if it's an API request
        if (isApiRequest(request)) {
            // Return JSON response for API clients
            response.setContentType("application/json");
            response.getWriter().write(new ObjectMapper().writeValueAsString(
                    AuthenticationResponse.builder()
                            .accessToken(jwtToken)
                            .mfaEnabled(false)
                            .build()
            ));
        } else {
            // Redirect for browser flow
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/oauth2/redirect")
                    .queryParam("token", jwtToken)
                    .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }
    }

    private boolean isApiRequest(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With")) ||
                request.getHeader("Accept") != null &&
                        request.getHeader("Accept").contains("application/json");
    }
}

