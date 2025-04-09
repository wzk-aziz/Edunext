package tn.esprit.tutoring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                configurer.defaultContentType(MediaType.APPLICATION_JSON);
            }

            @Override
            public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
                MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
                converter.setSupportedMediaTypes(List.of(
                    MediaType.APPLICATION_JSON,
                    MediaType.valueOf("application/json;charset=UTF-8")
                ));
                converters.add(converter);
            }
        };
    }
}