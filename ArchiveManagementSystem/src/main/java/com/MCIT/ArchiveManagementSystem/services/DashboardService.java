package com.MCIT.ArchiveManagementSystem.services;

import com.MCIT.ArchiveManagementSystem.dtos.DashboardStatsDTO;
import com.MCIT.ArchiveManagementSystem.dtos.ManagementStatsDTO;
import com.MCIT.ArchiveManagementSystem.models.AppRole;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.repositories.*;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

    private final MakzanReceiptRepository makzanReceiptRepository;
    private final ArchiveRepository archiveRepository;
    private final SawanihRepository sawanihRepository;
    private final HifziyaHazariRepository hifziyaHazariRepository;
    private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
    private final MakzanAnnualReportRepository makzanAnnualReportRepository;
    private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
    private final UserRepository userRepository;

    private static final String[] AFGHAN_MONTHS = {
        "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله",
        "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"
    };

    // ========================================
    // Dashboard stats for user (by management)
    // ========================================
    public DashboardStatsDTO getDashboardStatsByUser(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().getRoleName() == AppRole.ROLE_ADMIN) {
            logger.info("🔑 Admin user - fetching all documents");
            return processAllDocuments(null);
        }

        if (user.getManagement() != null) {
            logger.info("👥 User belongs to management: {} (ID: {})", 
                user.getManagement().getManagementName(), 
                user.getManagement().getManagementId());
            
            return processAllDocuments(user.getManagement());
        }

        logger.warn("⚠️ User has no management assigned - returning empty stats");
        return createEmptyStats();
    }

    // ========================================
    // Process ALL document types based on management
    // ========================================
    private DashboardStatsDTO processAllDocuments(Management management) {
        Map<String, MonthlyCount> monthCounts = new LinkedHashMap<>();
        int weeklySender = 0, weeklyRecipient = 0, weeklyFile = 0;

        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        
        logger.info("📅 Today: {}, Week ago: {}", today, weekAgo);

        // Support multiple date formats (including timestamps)
        DateTimeFormatter[] formatters = {
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),  // ✅ NEW: With timestamp
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy")
        };

        // Process based on management type
        if (management == null) {
            // Admin - process all
            processArchiveDocuments(archiveRepository.findAll(), monthCounts, formatters, weekAgo, today);
            processSawanihDocuments(sawanihRepository.findAll(), monthCounts, formatters, weekAgo, today);
            processHifziyaHazariDocuments(hifziyaHazariRepository.findAll(), monthCounts, formatters, weekAgo, today);
            processHifziyaWaradaSaderaDocuments(hifziyaWaradaSaderaRepository.findAll(), monthCounts, formatters, weekAgo, today);
            processMakzanReceiptDocuments(makzanReceiptRepository.findAll(), monthCounts, formatters, weekAgo, today);
        } else {
            Long managementId = management.getManagementId();
            
            if (managementId == 1) {
                // Archive management
                logger.info("📚 Processing Archive documents");
                processArchiveDocuments(archiveRepository.findByManagement(management), monthCounts, formatters, weekAgo, today);
            } else if (managementId == 2) {
                // Hifziya management
                logger.info("📝 Processing Hifziya documents");
                processSawanihDocuments(sawanihRepository.findByManagement(management), monthCounts, formatters, weekAgo, today);
                processHifziyaHazariDocuments(hifziyaHazariRepository.findByManagement(management), monthCounts, formatters, weekAgo, today);
                processHifziyaWaradaSaderaDocuments(hifziyaWaradaSaderaRepository.findByManagement(management), monthCounts, formatters, weekAgo, today);
            } else if (managementId == 3) {
                // Makhzan management
                logger.info("🗃️ Processing Makhzan documents");
                processMakzanReceiptDocuments(makzanReceiptRepository.findByManagement(management), monthCounts, formatters, weekAgo, today);
            }
        }

        // Calculate weekly stats from monthCounts
        for (MonthlyCount count : monthCounts.values()) {
            weeklySender += count.weeklySender;
            weeklyRecipient += count.weeklyRecipient;
            weeklyFile += count.weeklyFile;
        }

        // Build result
        List<String> months = new ArrayList<>();
        List<Integer> senderData = new ArrayList<>();
        List<Integer> recipientData = new ArrayList<>();
        List<Integer> fileData = new ArrayList<>();

        for (String month : AFGHAN_MONTHS) {
            if (monthCounts.containsKey(month)) {
                months.add(month);
                MonthlyCount count = monthCounts.get(month);
                senderData.add(count.sender);
                recipientData.add(count.recipient);
                fileData.add(count.file);
            }
        }

        int totalSender = senderData.stream().mapToInt(Integer::intValue).sum();
        int totalRecipient = recipientData.stream().mapToInt(Integer::intValue).sum();
        int totalFile = fileData.stream().mapToInt(Integer::intValue).sum();

        logger.info("📊 Stats: Total Sender={}, Recipient={}, Files={} | Weekly: Sender={}, Recipient={}, Files={}", 
            totalSender, totalRecipient, totalFile, weeklySender, weeklyRecipient, weeklyFile);

        return DashboardStatsDTO.builder()
                .months(months)
                .senderData(senderData)
                .recipientData(recipientData)
                .fileData(fileData)
                .totalSender(totalSender)
                .totalRecipient(totalRecipient)
                .totalFile(totalFile)
                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                        .sender(weeklySender)
                        .recipient(weeklyRecipient)
                        .file(weeklyFile)
                        .build())
                .build();
    }

    // ========================================
    // Process Archive documents
    // ========================================
    private void processArchiveDocuments(List<?> documents, Map<String, MonthlyCount> monthCounts, 
                                        DateTimeFormatter[] formatters, LocalDate weekAgo, LocalDate today) {
        if (documents == null || documents.isEmpty()) {
            logger.info("No archive documents found");
            return;
        }
        
        logger.info("Processing {} archive documents", documents.size());
        
        for (Object doc : documents) {
            var archive = (com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive) doc;
            // Use incommingDate or outgoingDate
            String dateStr = archive.getSendDate() != null ? archive.getSendDate().toString() : archive.getDepartmentDate().toString();
            if (dateStr == null || dateStr.isEmpty()) continue;

            LocalDate docDate = parseDate(dateStr, formatters);
            if (docDate == null) continue;

            String monthName = getAfghanMonth(docDate);
            monthCounts.putIfAbsent(monthName, new MonthlyCount());
            MonthlyCount count = monthCounts.get(monthName);

            boolean isWithinWeek = !docDate.isBefore(weekAgo) && !docDate.isAfter(today);

            // Count as sender if has org
            if (archive.getSenderOrg() != null) {
                count.sender++;
                if (isWithinWeek) count.weeklySender++;
            }

            // Count as recipient if has docNo
            if (archive.getDocNo() != null && !archive.getDocNo().isEmpty()) {
                count.recipient++;
                if (isWithinWeek) count.weeklyRecipient++;
            }

            // Archives don't have files, so count document itself
            count.file++;
            if (isWithinWeek) count.weeklyFile++;
        }
    }

    // ========================================
    // Process Sawanih documents
    // ========================================
    private void processSawanihDocuments(List<?> documents, Map<String, MonthlyCount> monthCounts, 
                                        DateTimeFormatter[] formatters, LocalDate weekAgo, LocalDate today) {
        if (documents == null || documents.isEmpty()) {
            logger.info("No sawanih documents found");
            return;
        }
        
        logger.info("Processing {} sawanih documents", documents.size());
        
        for (Object doc : documents) {
            var sawanih = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih) doc;
            
            String dateStr = sawanih.getIncommingDate() != null ? sawanih.getIncommingDate().toString() : sawanih.getOutgoingDate().toString();
            if (dateStr == null || dateStr.isEmpty()) {
                logger.warn("⚠️ Sawanih id={} has no date", sawanih.getId());
                continue;
            }

            LocalDate docDate = parseDate(dateStr, formatters);
            if (docDate == null) {
                logger.warn("⚠️ Failed to parse sawanih date: {}", dateStr);
                continue;
            }

            logger.info("✅ Sawanih date parsed: {} -> {}", dateStr, docDate);
            
            String monthName = getAfghanMonth(docDate);
            monthCounts.putIfAbsent(monthName, new MonthlyCount());
            MonthlyCount count = monthCounts.get(monthName);

            boolean isWithinWeek = !docDate.isBefore(weekAgo) && !docDate.isAfter(today);
            logger.info("   Is within week? {} (date={}, weekAgo={}, today={})", isWithinWeek, docDate, weekAgo, today);

            if (sawanih.getOrg() != null) {
                count.sender++;
                if (isWithinWeek) count.weeklySender++;
            }

            if (sawanih.getFiles() != null && !sawanih.getFiles().isEmpty()) {
                count.recipient++;
                if (isWithinWeek) count.weeklyRecipient++;
            }

            // Count pages as files
            if (sawanih.getPageQuantity() != null && sawanih.getPageQuantity() > 0) {
                count.file += sawanih.getPageQuantity();
                if (isWithinWeek) count.weeklyFile += sawanih.getPageQuantity();
            }
        }
    }

    // ========================================
    // Process Hifziya Hazari documents
    // ========================================
    private void processHifziyaHazariDocuments(List<?> documents, Map<String, MonthlyCount> monthCounts, 
                                              DateTimeFormatter[] formatters, LocalDate weekAgo, LocalDate today) {
        if (documents == null || documents.isEmpty()) {
            logger.info("No hifziya hazari documents found");
            return;
        }
        
        logger.info("Processing {} hifziya hazari documents", documents.size());
        
        for (Object doc : documents) {
            var hifziya = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari) doc;
            
            // Use year as approximate date
            if (hifziya.getYear() == null) continue;
            
            LocalDate docDate = LocalDate.of(hifziya.getYear(), 1, 1);
            String monthName = getAfghanMonth(docDate);
            monthCounts.putIfAbsent(monthName, new MonthlyCount());
            MonthlyCount count = monthCounts.get(monthName);

            boolean isWithinWeek = !docDate.isBefore(weekAgo) && !docDate.isAfter(today);

            if (hifziya.getOrg() != null) {
                count.sender++;
                if (isWithinWeek) count.weeklySender++;
            }

            count.recipient++;
            if (isWithinWeek) count.weeklyRecipient++;

            // Count actual files
            if (hifziya.getFiles() != null && !hifziya.getFiles().isEmpty()) {
                count.file += hifziya.getFiles().size();
                if (isWithinWeek) count.weeklyFile += hifziya.getFiles().size();
            }
        }
    }

    // ========================================
    // Process Hifziya Warada Sadera documents
    // ========================================
    private void processHifziyaWaradaSaderaDocuments(List<?> documents, Map<String, MonthlyCount> monthCounts, 
                                                    DateTimeFormatter[] formatters, LocalDate weekAgo, LocalDate today) {
        if (documents == null || documents.isEmpty()) {
            logger.info("No hifziya warada sadera documents found");
            return;
        }
        
        logger.info("Processing {} hifziya warada sadera documents", documents.size());
        
        for (Object doc : documents) {
            var hifziya = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera) doc;
            
            String dateStr = hifziya.getIncommingDate() != null ? hifziya.getIncommingDate() : hifziya.getOutgoingDate();
            if (dateStr == null || dateStr.isEmpty()) {
                logger.warn("⚠️ HifziyaWaradaSadera id={} has no date", hifziya.getId());
                continue;
            }

            LocalDate docDate = parseDate(dateStr, formatters);
            if (docDate == null) {
                logger.warn("⚠️ Failed to parse hifziya warada date: {}", dateStr);
                continue;
            }

            logger.info("✅ HifziyaWaradaSadera date parsed: {} -> {}", dateStr, docDate);

            String monthName = getAfghanMonth(docDate);
            monthCounts.putIfAbsent(monthName, new MonthlyCount());
            MonthlyCount count = monthCounts.get(monthName);

            boolean isWithinWeek = !docDate.isBefore(weekAgo) && !docDate.isAfter(today);
            logger.info("   Is within week? {} (date={}, weekAgo={}, today={})", isWithinWeek, docDate, weekAgo, today);

            if (hifziya.getOrg() != null) {
                count.sender++;
                if (isWithinWeek) count.weeklySender++;
            }

            if (hifziya.getLetterNumber() != null && !hifziya.getLetterNumber().isEmpty()) {
                count.recipient++;
                if (isWithinWeek) count.weeklyRecipient++;
            }

            if (hifziya.getFiles() != null && !hifziya.getFiles().isEmpty()) {
                count.file += hifziya.getFiles().size();
                if (isWithinWeek) count.weeklyFile += hifziya.getFiles().size();
            }
        }
    }

    // ========================================
    // Process Makzan Receipt documents
    // ========================================
    private void processMakzanReceiptDocuments(List<?> documents, Map<String, MonthlyCount> monthCounts, 
                                              DateTimeFormatter[] formatters, LocalDate weekAgo, LocalDate today) {
        if (documents == null || documents.isEmpty()) {
            logger.info("No makzan receipt documents found");
            return;
        }
        
        logger.info("Processing {} makzan receipt documents", documents.size());
        
        for (Object doc : documents) {
            var receipt = (com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt) doc;
            
            if (receipt.getLetterDate() == null || receipt.getLetterDate().isEmpty()) continue;

            LocalDate docDate = parseDate(receipt.getLetterDate(), formatters);
            if (docDate == null) {
                logger.warn("⚠️ Invalid date format: {}", receipt.getLetterDate());
                continue;
            }

            String monthName = getAfghanMonth(docDate);
            monthCounts.putIfAbsent(monthName, new MonthlyCount());
            MonthlyCount count = monthCounts.get(monthName);

            boolean isWithinWeek = !docDate.isBefore(weekAgo) && !docDate.isAfter(today);

            if (receipt.getOrg() != null) {
                count.sender++;
                if (isWithinWeek) count.weeklySender++;
            }

            if (receipt.getLetterNo() != null && !receipt.getLetterNo().isEmpty()) {
                count.recipient++;
                if (isWithinWeek) count.weeklyRecipient++;
            }

            if (receipt.getFiles() != null && !receipt.getFiles().isEmpty()) {
                count.file += receipt.getFiles().size();
                if (isWithinWeek) count.weeklyFile += receipt.getFiles().size();
            }
        }
    }

    // ========================================
    // Helper: Parse date with multiple formats (including timestamps)
    // ========================================
    private LocalDate parseDate(String dateStr, DateTimeFormatter[] formatters) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        // Try parsing with all formatters
        for (DateTimeFormatter formatter : formatters) {
            try {
                // For formats with time, use LocalDateTime then extract date
                if (formatter.toString().contains("HH:mm:ss")) {
                    return java.time.LocalDateTime.parse(dateStr.trim(), formatter).toLocalDate();
                } else {
                    return LocalDate.parse(dateStr.trim(), formatter);
                }
            } catch (Exception e) {
                // Try next format
            }
        }
        
        return null;
    }

    // ========================================
    // Management-level aggregated stats (Admin view)
    // ========================================
    public ManagementStatsDTO getManagementStats() {
        long archivesCount = archiveRepository.count();
        long sawanihCount = sawanihRepository.count();
        long hifziyaHazariCount = hifziyaHazariRepository.count();
        long hifziyaWaradaSaderaCount = hifziyaWaradaSaderaRepository.count();
        long makzanReceiptsCount = makzanReceiptRepository.count();
        long makzanAnnualReportsCount = makzanAnnualReportRepository.count();
        long makzanSubmissionReportsCount = makzanSubmissionReportRepository.count();

        long totalDocuments = archivesCount + sawanihCount + hifziyaHazariCount +
                hifziyaWaradaSaderaCount + makzanReceiptsCount + makzanAnnualReportsCount +
                makzanSubmissionReportsCount;

        return ManagementStatsDTO.builder()
                .managementName("All Managements")
                .archives(archivesCount)
                .sawanih(sawanihCount)
                .hifziyaHazari(hifziyaHazariCount)
                .hifziyaWaradaSadera(hifziyaWaradaSaderaCount)
                .makzanReceipts(makzanReceiptsCount)
                .makzanAnnualReports(makzanAnnualReportsCount)
                .makzanSubmissionReports(makzanSubmissionReportsCount)
                .totalDocuments(totalDocuments)
                .build();
    }

    // ========================================
    // Get stats for all managements (Admin view)
    // ========================================
    public List<ManagementStatsDTO> getAllManagementStats(List<Management> allManagements) {
        return allManagements.stream()
                .map(management -> {
                    long archivesCount = archiveRepository.countByManagement(management);
                    long sawanihCount = sawanihRepository.countByManagement(management);
                    long hifziyaHazariCount = hifziyaHazariRepository.countByManagement(management);
                    long hifziyaWaradaSaderaCount = hifziyaWaradaSaderaRepository.countByManagement(management);
                    long makzanReceiptsCount = makzanReceiptRepository.countByManagement(management);
                    long makzanAnnualReportsCount = makzanAnnualReportRepository.countByManagement(management);
                    long makzanSubmissionReportsCount = makzanSubmissionReportRepository.countByManagement(management);

                    long totalDocuments = archivesCount + sawanihCount + hifziyaHazariCount +
                            hifziyaWaradaSaderaCount + makzanReceiptsCount + makzanAnnualReportsCount +
                            makzanSubmissionReportsCount;

                    return ManagementStatsDTO.builder()
                            .managementName(management.getManagementName())
                            .archives(archivesCount)
                            .sawanih(sawanihCount)
                            .hifziyaHazari(hifziyaHazariCount)
                            .hifziyaWaradaSadera(hifziyaWaradaSaderaCount)
                            .makzanReceipts(makzanReceiptsCount)
                            .makzanAnnualReports(makzanAnnualReportsCount)
                            .makzanSubmissionReports(makzanSubmissionReportsCount)
                            .totalDocuments(totalDocuments)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ========================================
    // Helper: create empty dashboard stats
    // ========================================
    private DashboardStatsDTO createEmptyStats() {
        return DashboardStatsDTO.builder()
                .months(new ArrayList<>())
                .senderData(new ArrayList<>())
                .recipientData(new ArrayList<>())
                .fileData(new ArrayList<>())
                .totalSender(0)
                .totalRecipient(0)
                .totalFile(0)
                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                        .sender(0)
                        .recipient(0)
                        .file(0)
                        .build())
                .build();
    }

    // ========================================
    // Helper: Afghan month name
    // ========================================
    private String getAfghanMonth(LocalDate date) {
        return AFGHAN_MONTHS[date.getMonthValue() - 1];
    }

    // ========================================
    // Helper class to count monthly data
    // ========================================
    private static class MonthlyCount {
        int sender = 0;
        int recipient = 0;
        int file = 0;
        int weeklySender = 0;
        int weeklyRecipient = 0;
        int weeklyFile = 0;
    }
}