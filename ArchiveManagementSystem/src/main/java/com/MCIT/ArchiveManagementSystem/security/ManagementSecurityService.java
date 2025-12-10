package com.MCIT.ArchiveManagementSystem.security;

import com.MCIT.ArchiveManagementSystem.models.AppRole;
import com.MCIT.ArchiveManagementSystem.security.services.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ManagementSecurityService {
    
    /**
     * Check if user has access to specific management
     * Admins can access everything, regular users only their assigned management
     */
    public void validateManagementAccess(Long requiredManagementId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        System.out.println("🔍 DEBUG: Is authenticated: " + (authentication != null && authentication.isAuthenticated()));
        
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("❌ DEBUG: User not authenticated");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        
        // Get principal
        Object principal = authentication.getPrincipal();
        System.out.println("🔍 DEBUG: Principal type: " + principal.getClass().getName());
        
        // Check if principal is String (happens during error handling)
        if (principal instanceof String) {
            System.out.println("❌ DEBUG: Principal is String (anonymous user)");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        
        // Check if user is admin - admins can access everything
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        System.out.println("🔍 DEBUG: User: " + userDetails.getUsername());
        System.out.println("🔍 DEBUG: Is Admin: " + isAdmin);
        System.out.println("🔍 DEBUG: User Management: " + 
            (userDetails.getManagement() != null ? userDetails.getManagement().getManagementId() : "NULL"));
        System.out.println("🔍 DEBUG: Required Management: " + requiredManagementId);
        
        if (isAdmin) {
            System.out.println("✅ DEBUG: Admin access granted");
            return; // Admin has access to all managements
        }
        
        // Check if user has management assigned
        if (userDetails.getManagement() == null) {
            System.out.println("❌ DEBUG: User has no management assigned");
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, 
                "User is not assigned to any management"
            );
        }
        
        // Check if user's management matches required management
        Long userManagementId = userDetails.getManagement().getManagementId();
        if (!userManagementId.equals(requiredManagementId)) {
            System.out.println("❌ DEBUG: Management mismatch - User: " + userManagementId + 
                             ", Required: " + requiredManagementId);
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, 
                "Access denied. This resource belongs to a different management. " +
                "Your management: " + userDetails.getManagement().getManagementName()
            );
        }
        
        System.out.println("✅ DEBUG: Management access granted");
    }
}