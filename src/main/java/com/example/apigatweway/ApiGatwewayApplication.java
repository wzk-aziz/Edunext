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
                .route("exam-service", r -> r.path("/api/exams/**")
                        .uri("lb://exam-service"))
                .route("exam-route", r -> r.path("/api/exams/**")
                        .uri("lb://EduNext"))
                .route("EduNext", r -> r.path("/api/v1/auth/**")
                        .uri("lb://EduNext"))
                .route("EduNext", r -> r.path("/api/v1/users/**")
                        .uri("lb://EduNext"))
                .build();

    }
}


