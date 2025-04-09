package com.security.EduNext;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class EduNextApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduNextApplication.class, args);
	}

}
