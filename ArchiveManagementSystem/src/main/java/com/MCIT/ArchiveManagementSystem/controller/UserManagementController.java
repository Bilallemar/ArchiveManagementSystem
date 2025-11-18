package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.repositories.ManagementRepository;
import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
import com.MCIT.ArchiveManagementSystem.security.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-management")
// @CrossOrigin(origins = "*", maxAge = 3600)
public class UserManagementController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ManagementRepository managementRepository;

    /**
     * Assign a user to a management (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<?> assignUserToManagement(
            @RequestParam Long userId,
            @RequestParam Long managementId) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Management management = managementRepository.findById(managementId)
                .orElseThrow(() -> new RuntimeException("Management not found"));
        
        user.setManagement(management);
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse(
                "User assigned to management successfully"));
    }

    /**
     * Remove user from management (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/unassign")
    public ResponseEntity<?> unassignUserFromManagement(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setManagement(null);
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse(
                "User removed from management successfully"));
    }

    /**
     * Get all users in a specific management
     */
    @GetMapping("/management/{managementId}/users")
    public ResponseEntity<?> getUsersByManagement(@PathVariable Long managementId) {
        Management management = managementRepository.findById(managementId)
                .orElseThrow(() -> new RuntimeException("Management not found"));
        
        List<Map<String, Object>> users = management.getUsers().stream()
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("userId", user.getUserId());
                    userInfo.put("username", user.getUserName());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("role", user.getRole().getRoleName());
                    return userInfo;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }

    /**
     * Get users without management assignment (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/unassigned-users")
    public ResponseEntity<?> getUnassignedUsers() {
        List<User> allUsers = userRepository.findAll();
        
        List<Map<String, Object>> unassignedUsers = allUsers.stream()
                .filter(user -> user.getManagement() == null)
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("userId", user.getUserId());
                    userInfo.put("username", user.getUserName());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("role", user.getRole().getRoleName());
                    return userInfo;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(unassignedUsers);
    }

    /**
     * Bulk assign users to management (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk-assign")
    public ResponseEntity<?> bulkAssignUsersToManagement(
            @RequestBody Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        List<Long> userIds = (List<Long>) request.get("userIds");
        Long managementId = ((Number) request.get("managementId")).longValue();
        
        Management management = managementRepository.findById(managementId)
                .orElseThrow(() -> new RuntimeException("Management not found"));
        
        int assignedCount = 0;
        for (Long userId : userIds) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setManagement(management);
                userRepository.save(user);
                assignedCount++;
            }
        }
        
        return ResponseEntity.ok(new MessageResponse(
                assignedCount + " users assigned to management successfully"));
    }

    /**
     * Get management statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getManagementStatistics() {
        List<Management> managements = managementRepository.findAll();
        
        List<Map<String, Object>> statistics = managements.stream()
                .map(management -> {
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("managementId", management.getManagementId());
                    stats.put("managementName", management.getManagementName());
                    stats.put("userCount", management.getUsers().size());
                    return stats;
                })
                .collect(Collectors.toList());
        
        long unassignedCount = userRepository.findAll().stream()
                .filter(user -> user.getManagement() == null)
                .count();
        
        Map<String, Object> response = new HashMap<>();
        response.put("managementStatistics", statistics);
        response.put("unassignedUserCount", unassignedCount);
        
        return ResponseEntity.ok(response);
    }
}