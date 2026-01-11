

package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.security.services.UserDetailsImpl;
import com.MCIT.ArchiveManagementSystem.services.ManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managements")
public class ManagementController {

    @Autowired
    private ManagementService managementService;

    @GetMapping
    public ResponseEntity<List<Management>> getAllManagements(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (isAdmin) {
            return ResponseEntity.ok(managementService.getAllManagements());
        }
        
        if (userDetails.getManagement() != null) {
            return ResponseEntity.ok(
                List.of(managementService.getManagementById(
                    userDetails.getManagement().getManagementId()))
            );
        }
        
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<?> createManagement(@RequestBody Management management,
                                              Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only administrators can create managements");
        }
        
        Management created = managementService.createManagement(management);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

  @GetMapping("/{id}")
public ResponseEntity<?> getManagementById(@PathVariable Long id, 
                                           Authentication authentication) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    
    // DEBUG: Print management info
    System.out.println("DEBUG: User Management ID: " + 
        (userDetails.getManagement() != null ? userDetails.getManagement().getManagementId() : "NULL"));
    System.out.println("DEBUG: Requested ID: " + id);
    System.out.println("DEBUG: User Authorities: " + userDetails.getAuthorities());

    boolean isAdmin = userDetails.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    
    System.out.println("DEBUG: Is Admin: " + isAdmin);
    
    if (!isAdmin) {
        if (userDetails.getManagement() == null) {
            System.out.println("DEBUG: Management is NULL!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not assigned to any management");
        }
        
        if (!userDetails.getManagement().getManagementId().equals(id)) {
            System.out.println("DEBUG: Management ID mismatch! User has: " + 
                userDetails.getManagement().getManagementId() + ", Requested: " + id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only access your assigned management");
        }
    }

    Management management = managementService.getManagementById(id);
    return ResponseEntity.ok(management);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManagement(@PathVariable Long id,
                                              Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only administrators can delete managements");
        }
        
        managementService.deleteManagement(id);
        return ResponseEntity.ok("Management deleted successfully.");
    }
    
    @GetMapping("/my-management")
    public ResponseEntity<?> getMyManagement(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (userDetails.getManagement() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("You are not assigned to any management");
        }
        
        Management management = managementService.getManagementById(
                userDetails.getManagement().getManagementId());
        return ResponseEntity.ok(management);
    }
}