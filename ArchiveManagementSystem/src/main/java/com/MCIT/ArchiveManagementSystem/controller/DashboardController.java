package com.MCIT.ArchiveManagementSystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.dtos.AdminHijriMonthlyStatsDTO;
import com.MCIT.ArchiveManagementSystem.dtos.DashboardStatsDTO;
import com.MCIT.ArchiveManagementSystem.dtos.ManagementStatsDTO;
import com.MCIT.ArchiveManagementSystem.services.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
// REMOVED: @CrossOrigin(origins = "*") - CORS is handled in WebConfig
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get dashboard statistics for the current user
     * Shows monthly data for sender, recipient, and files
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        String username = authentication.getName();
        DashboardStatsDTO stats = dashboardService.getDashboardStatsByUser(username);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get all management statistics (Admin only)
     * Shows counts for all document types across all managements
     */
    @GetMapping("/management-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ManagementStatsDTO> getManagementStats() {
        ManagementStatsDTO stats = dashboardService.getManagementStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/hijri-monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminHijriMonthlyStatsDTO> getAdminHijriMonthlyStats() {
        AdminHijriMonthlyStatsDTO stats = dashboardService.getAdminHijriMonthlyStats();
        return ResponseEntity.ok(stats);
    }
    /**
     * Get statistics by organization (Admin only)
     * Shows document counts grouped by organization
     */
    // @GetMapping("/org-stats")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<List<OrgStatsDTO>> getOrgStats() {
    // List<OrgStatsDTO> stats = dashboardService.getOrgStats();
    // return ResponseEntity.ok(stats);
    // }
}