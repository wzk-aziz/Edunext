package tn.esprit.livesessions;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class LiveSessionsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LiveSessionsApplication.class, args);
    }

}
