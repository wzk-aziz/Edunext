package com.security.EduNext.Security;



import org.springframework.boot.CommandLineRunner;  // Correct import
import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import com.security.EduNext.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequestEntityConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Désactivation de la protection CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**", "/api/v1/users/**", "/forgotPassword/**").permitAll()  // Permet l'accès à ces routes
                        .anyRequest().authenticated()  // Toute autre requête nécessite une authentification
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Configuration pour une session stateless
                )
                .authenticationProvider(authenticationProvider)  // Utilisation du provider d'authentification
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // Ajout du filtre JWT
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout") // URL de déconnexion personnalisée
                        .addLogoutHandler(logoutHandler)  // Handler de déconnexion
                        .logoutSuccessHandler(logoutSuccessHandler())  // Handler personnalisé après déconnexion
                );

        return http.build();
    }

  /*  @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Désactivation de la protection CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**", "/api/v1/users/**" ,"/api/v1/auth/request-password-reset").permitAll()// Permet l'accès à ces routes
                        .anyRequest().authenticated()  // Toute autre requête nécessite une authentification
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Configuration pour une session stateless
                )
                .authenticationProvider(authenticationProvider)  // Utilisation du provider d'authentification
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // Ajout du filtre JWT
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout") // URL de déconnexion personnalisée
                        .addLogoutHandler(logoutHandler)  // Handler de déconnexion
                        .logoutSuccessHandler(logoutSuccessHandler())  // Handler personnalisé après déconnexion
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/api/v1/auth/login")  // Page de login personnalisée
                        .authorizationEndpoint(authz -> authz
                                .baseUri("/oauth2/authorize")  // URI de base pour l'autorisation OAuth2
                        )
                        .tokenEndpoint(token -> token
                                .accessTokenResponseClient(new DefaultAuthorizationCodeTokenResponseClient())  // Utilisation du client par défaut
                        )
                );
        return http.build();  // Appelez build une seule fois à la fin
    }*/

    //Role of admin is in ApplicationConfig class












    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> SecurityContextHolder.clearContext();  // Efface le contexte de sécurité lors de la déconnexion
    }
}


