package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.repositories.ManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class EmailManagementMappingService {

    @Autowired
    private ManagementRepository managementRepository;

    // Email domain to Management mapping
    // You can move this to database for dynamic configuration
    private static final Map<String, String> EMAIL_TO_MANAGEMENT_MAP = new HashMap<>() {{
        put("finance@company.com", "Finance Management");
        put("hr@company.com", "HR Management");
        put("it@company.com", "IT Management");
        put("sales@company.com", "Sales Management");
        // Add more mappings as needed
    }};

    /**
     * Get management based on email
     */
    public Optional<Management> getManagementByEmail(String email) {
        // Direct email match
        if (EMAIL_TO_MANAGEMENT_MAP.containsKey(email.toLowerCase())) {
            String managementName = EMAIL_TO_MANAGEMENT_MAP.get(email.toLowerCase());
            return managementRepository.findByManagementName(managementName);
        }

        // Domain-based match
        String domain = extractDomain(email);
        for (Map.Entry<String, String> entry : EMAIL_TO_MANAGEMENT_MAP.entrySet()) {
            if (entry.getKey().endsWith("@" + domain)) {
                return managementRepository.findByManagementName(entry.getValue());
            }
        }

        // Check if management exists with same name as email prefix
        String emailPrefix = email.substring(0, email.indexOf("@"));
        return managementRepository.findByManagementName(
                capitalizeFirst(emailPrefix) + " Management");
    }

    /**
     * Extract domain from email
     */
    private String extractDomain(String email) {
        int atIndex = email.indexOf("@");
        if (atIndex > 0 && atIndex < email.length() - 1) {
            return email.substring(atIndex + 1).toLowerCase();
        }
        return "";
    }

    /**
     * Capitalize first letter
     */
    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    /**
     * Add email-management mapping dynamically
     */
    public void addMapping(String email, String managementName) {
        EMAIL_TO_MANAGEMENT_MAP.put(email.toLowerCase(), managementName);
    }

    /**
     * Get all mappings
     */
    public Map<String, String> getAllMappings() {
        return new HashMap<>(EMAIL_TO_MANAGEMENT_MAP);
    }
}
