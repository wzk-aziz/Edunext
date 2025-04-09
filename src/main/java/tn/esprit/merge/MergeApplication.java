package tn.esprit.merge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class MergeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MergeApplication.class, args);
	}

}
