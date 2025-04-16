package com.example.apigatweway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatwewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatwewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
               // .route("exam-service", r -> r.path("/api/exams/**")
                 //       .uri("lb://exam-service"))

                .route("CERTIFICATE-SERVICE", r -> r.path("/generate")
                        .uri("lb://certificate-service"))  // Génération du certificat
                .route("DOWNLOAD-CERTIFICATE", r -> r.path("/certificates/**")
                        .uri("lb://certificate-service"))  // Téléchargement du certificat

                .route("marketplace-service", r -> r.path("/api/customer/**", "/api/admin/**", "/api/admin/coupons/**", "/api/payments/**", "/api/donations/**")
                        .uri("lb://MARKETPLACE-SERVICE"))

               //pi
                .route("exam-route", r -> r.path("/api/exams/**")
                        .uri("lb://EXAM-SERVICE"))
                .route("cert-route", r -> r.path("/api/certificates/**")
                        .uri("lb://EXAM-SERVICE"))


                .route("EduNext", r -> r.path("/api/v1/auth/**")
                        .uri("lb://EXAM-SERVICE"))
                .route("EduNext", r -> r.path("/api/v1/users/**")
                        .uri("lb://EXAM-SERVICE"))
                .build();

    }
}


