package com.MCIT.ArchiveManagementSystem.controller;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {

   @GetMapping("/api/csrf-token")
public ResponseEntity<?> csrfToken(HttpServletRequest request) {
    CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());

    if (token == null) {
        // که token null وي، مناسب ځواب ورکول
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)  // 204 No Content
                .body("CSRF token not available");
    }

    // که token موجود وي، هغه بیرته واستوي
    return ResponseEntity.ok(token);
}

}



