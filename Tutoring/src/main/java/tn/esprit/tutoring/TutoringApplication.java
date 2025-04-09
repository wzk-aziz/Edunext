package tn.esprit.tutoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class TutoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(TutoringApplication.class, args);
    }

}
