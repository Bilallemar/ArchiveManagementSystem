// package com.MCIT.ArchiveManagementSystem.controller;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RestController;
// import lombok.RequiredArgsConstructor;

// import com.MCIT.ArchiveManagementSystem.dtos.ManagementStatsDTO;
// import com.MCIT.ArchiveManagementSystem.models.Org;
// import com.MCIT.ArchiveManagementSystem.services.ManagementStatsService;

// @RestController
// @RequiredArgsConstructor
// public class ManagementStatsController {

//     private final ManagementStatsService managementStatsService;

//     // مثال: GET /api/stats/1
//     @GetMapping("/api/stats/{orgId}")
//     public ManagementStatsDTO getStats(@PathVariable Integer orgId) {
//         Org org = new Org();
//         org.setId(orgId); // که Org نور fields هم غواړي، اضافه یې کړئ
//         return managementStatsService.getStatsForOrg(org);
//     }
// }
