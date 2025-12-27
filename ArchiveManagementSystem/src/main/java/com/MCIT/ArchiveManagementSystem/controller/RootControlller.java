package com.MCIT.ArchiveManagementSystem.controller;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootControlller {
 @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "running");
        response.put("message", "Archive Management System API is running");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "health", "/health",
            "api", "/api",
            "auth", "/api/auth/public/signin"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Archive Management System");
        return ResponseEntity.ok(response);
    }
}




