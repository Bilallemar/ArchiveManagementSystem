package com.MCIT.ArchiveManagementSystem.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.dtos.UserDTO;
import com.MCIT.ArchiveManagementSystem.models.AppRole;
import com.MCIT.ArchiveManagementSystem.models.Role;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.repositories.RoleRepository;
import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
import com.MCIT.ArchiveManagementSystem.security.response.MessageResponse;
import com.MCIT.ArchiveManagementSystem.services.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

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
                    userInfo.put("enabled", user.isEnabled()); // ← ADD

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
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");
            String roleName = request.get("role");

            // Check if username already exists
            if (userRepository.existsByUserName(username)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("این نام کاربری قبلاً ثبت شده است"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("این ایمیل قبلاً ثبت شده است"));
            }

            User user = new User(username, email, passwordEncoder.encode(password));
            user.setEnabled(true);
            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setCredentialsNonExpired(true);

            // Set role
            // CORRECT — convert String to AppRole enum
            Role role = roleRepository.findByRoleName(AppRole.valueOf(roleName))
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(role);

            userRepository.save(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "کاربر بریالیتوب سره جوړ شو");
            response.put("userId", user.getUserId());
            return ResponseEntity.ok(response);
            // return ResponseEntity.ok(new MessageResponse("کاربر با موفقیت ایجاد شد"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("خطا در ایجاد کاربر: " + e.getMessage()));
        }
    }

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

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete-user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEnabled(false);
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("کاربر غیر فعال شو"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("ستونزه: " + e.getMessage()));
        }
    }
}