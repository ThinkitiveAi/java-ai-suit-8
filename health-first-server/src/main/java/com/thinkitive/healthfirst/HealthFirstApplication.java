package com.thinkitive.healthfirst;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@EnableJpaAuditing
@OpenAPIDefinition(info = @Info(title = "HealthFirst API", version = "1.0.0", description = "API for HealthFirst application"))
public class HealthFirstApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthFirstApplication.class, args);
    }
} 