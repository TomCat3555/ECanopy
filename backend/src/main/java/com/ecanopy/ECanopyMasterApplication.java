package com.ecanopy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.*;

/**
 * E-CANOPY Master - Comprehensive Society Management System
 * Spring Boot Application Entry Point
 * 
 * @author E-CANOPY Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@org.springframework.scheduling.annotation.EnableAsync
@org.springframework.scheduling.annotation.EnableScheduling
public class ECanopyMasterApplication {

    public static void main(String[] args) {
        SpringApplication.run(ECanopyMasterApplication.class, args);
    }

}
