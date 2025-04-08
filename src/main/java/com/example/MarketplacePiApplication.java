package com.example.marketplacepi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.example.EduNext", "com.example.marketplacepi"})

public class MarketplacePiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MarketplacePiApplication.class, args);
	}

}
