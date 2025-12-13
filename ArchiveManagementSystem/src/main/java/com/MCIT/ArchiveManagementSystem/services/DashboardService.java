// // FILE: DashboardService.java
// // Location: src/main/java/com/MCIT/ArchiveManagementSystem/services/DashboardService.java
// package com.MCIT.ArchiveManagementSystem.services;

// import com.MCIT.ArchiveManagementSystem.dtos.DashboardStatsDTO;
// import com.MCIT.ArchiveManagementSystem.dtos.ManagementStatsDTO;
// import com.MCIT.ArchiveManagementSystem.dtos.OrgStatsDTO;
// import com.MCIT.ArchiveManagementSystem.models.AppRole;
// import com.MCIT.ArchiveManagementSystem.models.Management;
// import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
// import com.MCIT.ArchiveManagementSystem.models.User;
// import com.MCIT.ArchiveManagementSystem.repositories.*;
// import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;

// import lombok.RequiredArgsConstructor;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.time.format.DateTimeFormatter;
// import java.util.*;
// import java.util.stream.Collectors;
// import java.util.List;
// import java.util.stream.Stream;

// @Service
// @RequiredArgsConstructor
// public class DashboardService {

//     private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

//     private final MakzanReceiptRepository makzanReceiptRepository;
//     private final ArchiveRepository archiveRepository;
//     private final SawanihRepository sawanihRepository;
//     private final HifziyaHazariRepository hifziyaHazariRepository;
//     private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
//     private final MakzanAnnualReportRepository makzanAnnualReportRepository;
//     private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
//     private final UserRepository userRepository;
//     private final OrgRepository orgRepository;

//     private static final String[] AFGHAN_MONTHS = {
//         "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله",
//         "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"
//     };

//     // --------------------------------------
//     // Dashboard stats for user (by management)
//     // --------------------------------------
//     public DashboardStatsDTO getDashboardStatsByUser(String username) {
//         User user = userRepository.findByUserName(username)
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         if (user.getRole().getRoleName() == AppRole.ROLE_ADMIN) {
//             logger.info("🔑 Admin user - fetching all receipts");
//             return processReceipts(makzanReceiptRepository.findAll());
//         }

//         if (user.getManagement() != null) {
//             logger.info("👥 User belongs to management: {}", user.getManagement().getManagementName());
//             return processReceipts(makzanReceiptRepository.findByManagement(user.getManagement()));
//         }

//         logger.warn("⚠️ User has no management assigned - returning empty stats");
//         return createEmptyStats();
//     }

//     // --------------------------------------
//     // Dashboard stats by Management object
//     // --------------------------------------
//     public DashboardStatsDTO getDashboardStatsByManagement(Management management) {
//         if (management == null) return createEmptyStats();
//         List<MakzanReceipt> receipts = makzanReceiptRepository.findByManagement(management);
//         return processReceipts(receipts);
//     }

//     // --------------------------------------
//     // Core logic to process receipts
//     // --------------------------------------
//     private DashboardStatsDTO processReceipts(List<MakzanReceipt> receipts) {
//         if (receipts == null || receipts.isEmpty()) return createEmptyStats();

//         Map<String, MonthlyCount> monthCounts = new LinkedHashMap<>();
//         int weeklySender = 0, weeklyRecipient = 0, weeklyFile = 0;

//         LocalDate today = LocalDate.now();
//         LocalDate weekAgo = today.minusDays(7);
//         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

//         for (MakzanReceipt receipt : receipts) {
//             if (receipt.getLetterDate() == null || receipt.getLetterDate().isEmpty()) continue;

//             try {
//                 LocalDate letterDate = LocalDate.parse(receipt.getLetterDate(), formatter);
//                 String monthName = getAfghanMonth(letterDate);
//                 monthCounts.putIfAbsent(monthName, new MonthlyCount());
//                 MonthlyCount count = monthCounts.get(monthName);

//                 if (receipt.getOrg() != null) {
//                     count.sender++;
//                     if (!letterDate.isBefore(weekAgo) && !letterDate.isAfter(today)) weeklySender++;
//                 }

//                 if (receipt.getLetterNo() != null && !receipt.getLetterNo().isEmpty()) {
//                     count.recipient++;
//                     if (!letterDate.isBefore(weekAgo) && !letterDate.isAfter(today)) weeklyRecipient++;
//                 }

//                 if (receipt.getFiles() != null && !receipt.getFiles().isEmpty()) {
//                     count.file += receipt.getFiles().size();
//                     if (!letterDate.isBefore(weekAgo) && !letterDate.isAfter(today)) weeklyFile += receipt.getFiles().size();
//                 }

//             } catch (Exception e) {
//                 logger.warn("⚠️ Invalid date format for receipt: {}", receipt.getLetterDate());
//             }
//         }

//         List<String> months = new ArrayList<>();
//         List<Integer> senderData = new ArrayList<>();
//         List<Integer> recipientData = new ArrayList<>();
//         List<Integer> fileData = new ArrayList<>();

//         for (String month : AFGHAN_MONTHS) {
//             if (monthCounts.containsKey(month)) {
//                 months.add(month);
//                 MonthlyCount count = monthCounts.get(month);
//                 senderData.add(count.sender);
//                 recipientData.add(count.recipient);
//                 fileData.add(count.file);
//             }
//         }

//         int totalSender = senderData.stream().mapToInt(Integer::intValue).sum();
//         int totalRecipient = recipientData.stream().mapToInt(Integer::intValue).sum();
//         int totalFile = fileData.stream().mapToInt(Integer::intValue).sum();

//         return DashboardStatsDTO.builder()
//                 .months(months)
//                 .senderData(senderData)
//                 .recipientData(recipientData)
//                 .fileData(fileData)
//                 .totalSender(totalSender)
//                 .totalRecipient(totalRecipient)
//                 .totalFile(totalFile)
//                 .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
//                         .sender(weeklySender)
//                         .recipient(weeklyRecipient)
//                         .file(weeklyFile)
//                         .build())
//                 .build();
//     }

//     // --------------------------------------
//     // Management-level aggregated stats
//     // --------------------------------------
//     public ManagementStatsDTO getManagementStats() {
//         long archivesCount = archiveRepository.count();
//         long sawanihCount = sawanihRepository.count();
//         long hifziyaHazariCount = hifziyaHazariRepository.count();
//         long hifziyaWaradaSaderaCount = hifziyaWaradaSaderaRepository.count();
//         long makzanReceiptsCount = makzanReceiptRepository.count();
//         long makzanAnnualReportsCount = makzanAnnualReportRepository.count();
//         long makzanSubmissionReportsCount = makzanSubmissionReportRepository.count();

//         long totalDocuments = archivesCount + sawanihCount + hifziyaHazariCount +
//                 hifziyaWaradaSaderaCount + makzanReceiptsCount + makzanAnnualReportsCount +
//                 makzanSubmissionReportsCount;

//         return ManagementStatsDTO.builder()
//                 .archives(archivesCount)
//                 .sawanih(sawanihCount)
//                 .hifziyaHazari(hifziyaHazariCount)
//                 .hifziyaWaradaSadera(hifziyaWaradaSaderaCount)
//                 .makzanReceipts(makzanReceiptsCount)
//                 .makzanAnnualReports(makzanAnnualReportsCount)
//                 .makzanSubmissionReports(makzanSubmissionReportsCount)
//                 .totalDocuments(totalDocuments)
//                 .build();
//     }

//     // --------------------------------------
//     // Management-based stats list (instead of org)
//     // --------------------------------------
//     public List<ManagementStatsDTO> getAllManagementStats(List<Management> allManagements) {
//   return allManagements.stream()
//         .map((Management management) -> {
//             long receiptCount = makzanReceiptRepository.countByManagement(management);
//             long totalCount = receiptCount;
//             return ManagementStatsDTO.builder()
//                     .managementName(management.getManagementName())
//                     .makzanReceipts(receiptCount)
//                     .totalDocuments(totalCount)
//                     .build();
//         })
//         .collect(Collectors.toList());

//     }

//     // --------------------------------------
//     // Helper: create empty dashboard stats
//     // --------------------------------------
//     private DashboardStatsDTO createEmptyStats() {
//         return DashboardStatsDTO.builder()
//                 .months(new ArrayList<>())
//                 .senderData(new ArrayList<>())
//                 .recipientData(new ArrayList<>())
//                 .fileData(new ArrayList<>())
//                 .totalSender(0)
//                 .totalRecipient(0)
//                 .totalFile(0)
//                 .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
//                         .sender(0)
//                         .recipient(0)
//                         .file(0)
//                         .build())
//                 .build();
//     }

//     // --------------------------------------
//     // Helper: Afghan month name
//     // --------------------------------------
//     private String getAfghanMonth(LocalDate date) {
//         return AFGHAN_MONTHS[date.getMonthValue() - 1];
//     }

//     // --------------------------------------
//     // Helper class to count monthly data
//     // --------------------------------------
//     private static class MonthlyCount {
//         int sender = 0;
//         int recipient = 0;
//         int file = 0;
//     }
// }
