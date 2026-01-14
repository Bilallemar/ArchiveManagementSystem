package com.MCIT.ArchiveManagementSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.MCIT.ArchiveManagementSystem.dtos.UserDTO;
import com.MCIT.ArchiveManagementSystem.models.Role;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
import com.MCIT.ArchiveManagementSystem.services.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserService userService;
    
    @Autowired
    UserRepository userRepository;

    // ✅ ADD THIS NEW ENDPOINT
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersWithManagement() {
        List<User> users = userRepository.findAll();
        
        List<Map<String, Object>> usersWithManagement = users.stream()
            .map(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", user.getUserId());
                userInfo.put("userName", user.getUserName());
                userInfo.put("email", user.getEmail());
                userInfo.put("createdDate", user.getCreatedDate());
                
                // Add role info with clean name
                Map<String, Object> roleInfo = new HashMap<>();
                String roleName = user.getRole().getRoleName().name(); // "ROLE_ADMIN" or "ROLE_USER"
                String cleanRoleName = roleName.replace("ROLE_", ""); // "ADMIN" or "USER"
                roleInfo.put("roleName", cleanRoleName);
                roleInfo.put("isAdmin", roleName.equals("ROLE_ADMIN"));
                userInfo.put("role", roleInfo);
                
                // Add management info
                if (user.getManagement() != null) {
                    Map<String, Object> managementInfo = new HashMap<>();
                    managementInfo.put("managementId", user.getManagement().getManagementId());
                    managementInfo.put("managementName", user.getManagement().getManagementName());
                    userInfo.put("management", managementInfo);
                } else {
                    userInfo.put("management", null);
                }
                
                return userInfo;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(usersWithManagement);
    }

    // YOUR EXISTING ENDPOINTS BELOW - DON'T CHANGE THESE
    
    @GetMapping("/getusers")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/update-role")
    public ResponseEntity<String> updateUserRole(@RequestParam Long userId, 
                                                 @RequestParam String roleName) {
        userService.updateUserRole(userId, roleName);
        return ResponseEntity.ok("User role updated");
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PutMapping("/update-lock-status")
    public ResponseEntity<String> updateAccountLockStatus(@RequestParam Long userId,
                                                          @RequestParam boolean lock) {
        userService.updateAccountLockStatus(userId, lock);
        return ResponseEntity.ok("Account lock status updated");
    }

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return userService.getAllRoles();
    }

    @PutMapping("/update-expiry-status")
    public ResponseEntity<String> updateAccountExpiryStatus(@RequestParam Long userId,
                                                            @RequestParam boolean expire) {
        userService.updateAccountExpiryStatus(userId, expire);
        return ResponseEntity.ok("Account expiry status updated");
    }

    @PutMapping("/update-enabled-status")
    public ResponseEntity<String> updateAccountEnabledStatus(@RequestParam Long userId,
                                                             @RequestParam boolean enabled) {
        userService.updateAccountEnabledStatus(userId, enabled);
        return ResponseEntity.ok("Account enabled status updated");
    }

    @PutMapping("/update-credentials-expiry-status")
    public ResponseEntity<String> updateCredentialsExpiryStatus(@RequestParam Long userId, 
                                                                @RequestParam boolean expire) {
        userService.updateCredentialsExpiryStatus(userId, expire);
        return ResponseEntity.ok("Credentials expiry status updated");
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestParam Long userId,
                                                 @RequestParam String password) {
        try {
            userService.updatePassword(userId, password);
            return ResponseEntity.ok("Password updated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}