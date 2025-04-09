package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication(scanBasePackages = {"com.example.EduNext", "com.example.marketplacepi","com.example.exam_service","com.example.codinggame"})
@EnableEurekaServer
public class CodingGameApplication {
    public static void main(String[] args) {
        SpringApplication.run(CodingGameApplication.class, args);
    }

    // Ajout de la configuration CORS ici


}
