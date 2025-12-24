// package com.MCIT.ArchiveManagementSystem.controller;

// import com.MCIT.ArchiveManagementSystem.models.User;
// import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/debug")
// @RequiredArgsConstructor
// public class DebugController {

//     private final UserRepository userRepository;
//     private final MakzanReceiptRepository makzanReceiptRepository;

//     /**
//      * DEBUG ENDPOINT - Check user and org info
//      * DELETE THIS CONTROLLER AFTER DEBUGGING!
//      */
//     @GetMapping("/user-info")
//     public ResponseEntity<Map<String, Object>> getUserDebugInfo(Authentication authentication) {
//         Map<String, Object> debug = new HashMap<>();
        
//         String username = authentication.getName();
//         debug.put("username", username);
        
//         User user = userRepository.findByUserName(username).orElse(null);
        
//         if (user == null) {
//             debug.put("error", "User not found");
//             return ResponseEntity.ok(debug);
//         }
        
//         debug.put("userId", user.getUserId());
//         debug.put("role", user.getRole().getRoleName().toString());
//         debug.put("hasOrg", user.getOrg() != null);
        
//         if (user.getOrg() != null) {
//             debug.put("orgId", user.getOrg().getId());
//             debug.put("orgName", user.getOrg().getName());
            
//             // Count receipts for this org
//             long receiptCount = makzanReceiptRepository.countByOrg(user.getOrg());
//             debug.put("receiptCount", receiptCount);
            
//             // Get all receipts for this org
//             var receipts = makzanReceiptRepository.findByOrg(user.getOrg());
//             debug.put("receiptsFound", receipts.size());
            
//             if (!receipts.isEmpty()) {
//                 debug.put("sampleReceiptId", receipts.get(0).getId());
//                 debug.put("sampleLetterDate", receipts.get(0).getLetterDate());
//             }
//         } else {
//             debug.put("orgId", null);
//             debug.put("orgName", null);
//             debug.put("receiptCount", 0);
//         }
        
//         // Total receipts in system
//         debug.put("totalReceiptsInSystem", makzanReceiptRepository.count());
        
//         return ResponseEntity.ok(debug);
//     }
// }