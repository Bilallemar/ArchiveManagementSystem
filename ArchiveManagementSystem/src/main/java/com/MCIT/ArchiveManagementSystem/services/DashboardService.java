package com.MCIT.ArchiveManagementSystem.services;

import java.time.LocalDate;
import java.time.chrono.HijrahDate;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.MCIT.ArchiveManagementSystem.dtos.AdminHijriMonthlyStatsDTO;
import com.MCIT.ArchiveManagementSystem.dtos.DashboardStatsDTO;
import com.MCIT.ArchiveManagementSystem.dtos.ManagementStatsDTO;
import com.MCIT.ArchiveManagementSystem.models.AppRole;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.User;
import com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakhzanWaradaSadera;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;
import com.MCIT.ArchiveManagementSystem.repositories.UserRepository;
import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakhzanWaradaSaderaRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanAnnualReportRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;
import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanSubmissionReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

        private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);
        private final MakhzanWaradaSaderaRepository makhzanWaradaSaderaRepository;
        private final MakzanReceiptRepository makzanReceiptRepository;
        private final ArchiveRepository archiveRepository;
        private final SawanihRepository sawanihRepository;
        private final HifziyaHazariRepository hifziyaHazariRepository;
        private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
        private final MakzanAnnualReportRepository makzanAnnualReportRepository;
        private final MakzanSubmissionReportRepository makzanSubmissionReportRepository;
        private final UserRepository userRepository;

        // =============================================
        // MAIN ENTRY POINT
        // =============================================
        public DashboardStatsDTO getDashboardStatsByUser(String username) {
                User user = userRepository.findByUserName(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getRole().getRoleName() == AppRole.ROLE_ADMIN) {
                        logger.info("Admin user - building admin stats");
                        return buildAdminStats();
                }

                if (user.getManagement() != null) {
                        Long managementId = user.getManagement().getManagementId();
                        logger.info("Manager user - management ID: {}", managementId);
                        if (managementId == 1)
                                return buildArchiveStats(user.getManagement());
                        if (managementId == 2)
                                return buildHifziyaStats(user.getManagement());
                        if (managementId == 3)
                                return buildMakhzanStats(user.getManagement());
                }

                logger.warn("No management assigned - returning empty stats");
                return createEmptyStats();
        }

        // =============================================
        // ADMIN
        // Card1: Total Archive, Card2: Total Hifziya, Card3: Total Makhzan
        // Chart: all docs per month (1 bar)
        // Donut: Archive vs Hifziya vs Makhzan
        // =============================================
        private DashboardStatsDTO buildAdminStats() {
                long totalArchive = archiveRepository.count();
                long totalHifziya = sawanihRepository.count()
                                + hifziyaHazariRepository.count()
                                + hifziyaWaradaSaderaRepository.count();
                long totalMakhzan = makzanReceiptRepository.count()
                                + makzanAnnualReportRepository.count()
                                + makzanSubmissionReportRepository.count();
                long totalDocuments = totalArchive + totalHifziya + totalMakhzan;

                Map<String, Integer> monthCounts = new TreeMap<>();
                addArchiveDatesToMap(archiveRepository.findAll(), monthCounts);
                addSawanihDatesToMap(sawanihRepository.findAll(), monthCounts);
                addHifziyaHazariDatesToMap(hifziyaHazariRepository.findAll(), monthCounts);
                addHifziyaWaradaSaderaDatesToMap(hifziyaWaradaSaderaRepository.findAll(), monthCounts);
                addMakzanReceiptDatesToMap(makzanReceiptRepository.findAll(), monthCounts);
                addMakzanAnnualDatesToMap(makzanAnnualReportRepository.findAll(), monthCounts);
                addMakzanSubmissionDatesToMap(makzanSubmissionReportRepository.findAll(), monthCounts);

                List<String> months = new ArrayList<>(monthCounts.keySet());
                List<Integer> fileData = new ArrayList<>(monthCounts.values());
                int weeklyTotal = calculateWeeklyTotal(monthCounts);

                logger.info("Admin - Archive:{}, Hifziya:{}, Makhzan:{}, Total:{}, Months:{}",
                                totalArchive, totalHifziya, totalMakhzan, totalDocuments, months.size());

                return DashboardStatsDTO.builder()
                                .months(months)
                                .fileData(fileData)
                                .waradaData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .saderaData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .senderData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .recipientData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .totalArchive(totalArchive)
                                .totalHifziya(totalHifziya)
                                .totalMakhzan(totalMakhzan)
                                .totalDocuments(totalDocuments)
                                .totalWarada(0).totalSadera(0)
                                .totalSawanih(0).totalHifziyaHazari(0).totalHifziyaWaradaSadera(0)
                                .totalMakzanReceipt(0).totalAnnualReport(0).totalSubmissionReport(0)
                                .totalFile((int) totalDocuments).totalSender(0).totalRecipient(0)
                                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                                                .sender(0).recipient(0).file(weeklyTotal).build())
                                .build();
        }

        // =============================================
        // ARCHIVE MANAGER
        // Card1: Total Incoming (Warada), Card2: Total Outgoing (Sadera), Card3: This
        // month
        // Chart: Incoming vs Outgoing bars by month
        // ✅ FIX: enum values are INCOMING / OUTGOING
        // =============================================
        private DashboardStatsDTO buildArchiveStats(Management management) {
                List<?> allDocs = archiveRepository.findByManagement(management);

                // ✅ FIXED: use INCOMING / OUTGOING not WARADA / SADERA
                List<?> incomingDocs = allDocs.stream()
                                .filter(d -> {
                                        var doc = (com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive) d;
                                        return doc.getDirection() != null &&
                                                        doc.getDirection().toString().toUpperCase()
                                                                        .contains("INCOMING");
                                }).collect(Collectors.toList());

                List<?> outgoingDocs = allDocs.stream()
                                .filter(d -> {
                                        var doc = (com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive) d;
                                        return doc.getDirection() != null &&
                                                        doc.getDirection().toString().toUpperCase()
                                                                        .contains("OUTGOING");
                                }).collect(Collectors.toList());

                long totalWarada = incomingDocs.size(); // Incoming = Warada
                long totalSadera = outgoingDocs.size(); // Outgoing = Sadera
                long totalArchive = allDocs.size();

                // Build separate month maps for each direction, pre-seeded with all 12 months
                Map<String, Integer> incomingMap = initCurrentYearMonths();
                Map<String, Integer> outgoingMap = initCurrentYearMonths();
                addArchiveDatesToMap(incomingDocs, incomingMap);
                addArchiveDatesToMap(outgoingDocs, outgoingMap);

                List<String> months = new ArrayList<>(incomingMap.keySet());

                List<Integer> waradaData = months.stream()
                                .map(m -> incomingMap.getOrDefault(m, 0))
                                .collect(Collectors.toList());
                List<Integer> saderaData = months.stream()
                                .map(m -> outgoingMap.getOrDefault(m, 0))
                                .collect(Collectors.toList());
                List<Integer> fileData = months.stream()
                                .map(m -> incomingMap.getOrDefault(m, 0) + outgoingMap.getOrDefault(m, 0))
                                .collect(Collectors.toList());

                // Weekly = current month total
                Map<String, Integer> totalMap = new TreeMap<>();
                addArchiveDatesToMap(allDocs, totalMap);
                int weeklyTotal = calculateWeeklyTotal(totalMap);

                logger.info("Archive - Incoming(Warada):{}, Outgoing(Sadera):{}, Total:{}, Months:{}",
                                totalWarada, totalSadera, totalArchive, months.size());

                return DashboardStatsDTO.builder()
                                .months(months)
                                .fileData(fileData)
                                .waradaData(waradaData)
                                .saderaData(saderaData)
                                .senderData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .recipientData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .totalArchive(totalArchive).totalHifziya(0).totalMakhzan(0)
                                .totalDocuments(totalArchive)
                                .totalWarada(totalWarada)
                                .totalSadera(totalSadera)
                                .totalSawanih(0).totalHifziyaHazari(0).totalHifziyaWaradaSadera(0)
                                .totalMakzanReceipt(0).totalAnnualReport(0).totalSubmissionReport(0)
                                .totalFile((int) totalArchive).totalSender(0).totalRecipient(0)
                                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                                                .sender(0).recipient(0).file(weeklyTotal).build())
                                .build();
        }

        // =============================================
        // HIFZIYA MANAGER
        // Card1: Sawanih total, Card2: HifziyaHazari total, Card3: HifziyaWaradaSadera
        // total
        // Chart: 3 separate bars by month
        // =============================================
        private void addCreatedDateToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.Auditable) d;
                        if (doc.getCreatedDate() != null)
                                addToMap(doc.getCreatedDate().toLocalDate(), map);
                }
        }

        private DashboardStatsDTO buildHifziyaStats(Management management) {
                List<?> sawanihDocs = sawanihRepository.findByManagement(management);
                List<?> allHazariDocs = hifziyaHazariRepository.findByManagement(management);
                List<?> waradaSaderaDocs = hifziyaWaradaSaderaRepository.findByManagement(management);

                List<?> hazariDocs = allHazariDocs.stream()
                                .filter(d -> {
                                        var doc = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari) d;
                                        return doc.getIsIndraj() != null && !doc.getIsIndraj();
                                }).collect(Collectors.toList());

                List<?> indrajDocs = allHazariDocs.stream()
                                .filter(d -> {
                                        var doc = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari) d;
                                        return doc.getIsIndraj() != null && doc.getIsIndraj();
                                }).collect(Collectors.toList());

                long totalSawanih = sawanihDocs.size();
                long totalHazari = hazariDocs.size();
                long totalIndraj = indrajDocs.size();
                long totalHifziyaWaradaSadera = waradaSaderaDocs.size();
                long totalHifziya = totalSawanih + totalHazari + totalIndraj + totalHifziyaWaradaSadera;

                // ✅ Hazari and Indraj use YEAR map — Sawanih uses YYYY-MM map
                // We merge all into a common key set
                // For Sawanih: keys like "2025-08", for Hazari/Indraj: keys like "1446"
                // Since they are different formats, we keep them SEPARATE
                // X-axis will show Hijri years for Hazari/Indraj chart
                Map<String, Integer> hazariMap = initCurrentYearMonths();
                Map<String, Integer> indrajMap = initCurrentYearMonths();
                addCreatedDateToMap(hazariDocs, hazariMap);
                addCreatedDateToMap(indrajDocs, indrajMap);

                List<String> months = new ArrayList<>(hazariMap.keySet());

                List<Integer> waradaData = months.stream()
                                .map(m -> hazariMap.getOrDefault(m, 0)).collect(Collectors.toList());
                List<Integer> saderaData = months.stream()
                                .map(m -> indrajMap.getOrDefault(m, 0)).collect(Collectors.toList());
                List<Integer> fileData = new ArrayList<>(Collections.nCopies(months.size(), 0));

                int weeklyTotal = calculateWeeklyTotal(new TreeMap<>());

                logger.info("Hifziya - Sawanih:{}, Hazari:{}, Indraj:{}, Total:{}",
                                totalSawanih, totalHazari, totalIndraj, totalHifziya);

                return DashboardStatsDTO.builder()
                                .months(months) // ✅ Now contains Hijri years: "1444","1445"...
                                .fileData(fileData)
                                .waradaData(waradaData)
                                .saderaData(saderaData)
                                .senderData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .recipientData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .totalArchive(0).totalHifziya(totalHifziya).totalMakhzan(0)
                                .totalDocuments(totalHifziya)
                                .totalWarada(0).totalSadera(0)
                                .totalSawanih(totalSawanih)
                                .totalHifziyaHazari(totalHazari)
                                .totalHifziyaWaradaSadera(totalIndraj)
                                .totalMakzanReceipt(0).totalAnnualReport(0).totalSubmissionReport(0)
                                .totalFile((int) totalHifziya).totalSender(0).totalRecipient(0)
                                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                                                .sender(0).recipient(0).file(weeklyTotal).build())
                                .build();
        }

        // =============================================
        // MAKHZAN MANAGER
        // Card1: MakzanReceipt total, Card2: AnnualReport total, Card3:
        // SubmissionReport total
        // Chart: 3 separate bars by month
        // =============================================
        private DashboardStatsDTO buildMakhzanStats(Management management) {
                List<?> receiptDocs = makzanReceiptRepository.findByManagement(management);
                List<?> annualDocs = makzanAnnualReportRepository.findByManagement(management);
                List<?> submissionDocs = makzanSubmissionReportRepository.findByManagement(management);

                long totalMakzanReceipt = receiptDocs.size();
                long totalAnnualReport = annualDocs.size();
                long totalSubmissionReport = submissionDocs.size();
                long totalMakhzan = totalMakzanReceipt + totalAnnualReport + totalSubmissionReport;

                Map<String, Integer> receiptMap = initCurrentYearMonths();
                Map<String, Integer> annualMap = initCurrentYearMonths();
                Map<String, Integer> submissionMap = initCurrentYearMonths();

                addMakzanReceiptDatesToMap(receiptDocs, receiptMap);
                addMakzanAnnualDatesToMap(annualDocs, annualMap);
                addMakzanSubmissionDatesToMap(submissionDocs, submissionMap);

                List<String> months = new ArrayList<>(receiptMap.keySet());

                // waradaData = Receipt bars
                // saderaData = Annual bars
                // fileData = Submission bars
                List<Integer> waradaData = months.stream()
                                .map(m -> receiptMap.getOrDefault(m, 0)).collect(Collectors.toList());
                List<Integer> saderaData = months.stream()
                                .map(m -> annualMap.getOrDefault(m, 0)).collect(Collectors.toList());
                List<Integer> fileData = months.stream()
                                .map(m -> submissionMap.getOrDefault(m, 0)).collect(Collectors.toList());

                Map<String, Integer> totalMap = new TreeMap<>();
                addMakzanReceiptDatesToMap(receiptDocs, totalMap);
                addMakzanAnnualDatesToMap(annualDocs, totalMap);
                addMakzanSubmissionDatesToMap(submissionDocs, totalMap);
                int weeklyTotal = calculateWeeklyTotal(totalMap);

                logger.info("Makhzan - Receipt:{}, Annual:{}, Submission:{}, Total:{}",
                                totalMakzanReceipt, totalAnnualReport, totalSubmissionReport, totalMakhzan);

                return DashboardStatsDTO.builder()
                                .months(months)
                                .fileData(fileData)
                                .waradaData(waradaData)
                                .saderaData(saderaData)
                                .senderData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .recipientData(new ArrayList<>(Collections.nCopies(months.size(), 0)))
                                .totalArchive(0).totalHifziya(0).totalMakhzan(totalMakhzan)
                                .totalDocuments(totalMakhzan)
                                .totalWarada(0).totalSadera(0)
                                .totalSawanih(0).totalHifziyaHazari(0).totalHifziyaWaradaSadera(0)
                                .totalMakzanReceipt(totalMakzanReceipt)
                                .totalAnnualReport(totalAnnualReport)
                                .totalSubmissionReport(totalSubmissionReport)
                                .totalFile((int) totalMakhzan).totalSender(0).totalRecipient(0)
                                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                                                .sender(0).recipient(0).file(weeklyTotal).build())
                                .build();
        }

        // =============================================
        // HELPERS: Add entity dates to YYYY-MM map
        // =============================================
        private void addArchiveDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.ArchiveManagement.Archive) d;
                        LocalDate date = doc.getSendDate() != null ? doc.getSendDate() : doc.getDepartmentDate();
                        if (date != null)
                                addToMap(date, map);
                }
        }

        private void addSawanihDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih) d;
                        LocalDate date = doc.getIncommingDate() != null
                                        ? doc.getIncommingDate()
                                        : doc.getOutgoingDate();
                        if (date != null)
                                addToMap(date, map);
                }
        }

        private void addHifziyaHazariDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaHazari) d;
                        if (doc.getYear() == null)
                                continue;
                        // ✅ Only accept valid Hijri years, store directly as string
                        // Accept both Hijri (1400-1500) and Gregorian (2000-2100)
                        if ((doc.getYear() < 1400 || doc.getYear() > 1500) &&
                                        (doc.getYear() < 2000 || doc.getYear() > 2100)) {
                                logger.warn("Skipping invalid year: {}", doc.getYear());
                                continue;
                        }
                        map.merge(String.valueOf(doc.getYear()), 1, Integer::sum);
                }
        }

        private void addHifziyaWaradaSaderaDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.HifziyaWaradaSadera) d;
                        LocalDate date = doc.getIncommingDate() != null
                                        ? doc.getIncommingDate()
                                        : doc.getOutgoingDate();
                        if (date != null)
                                addToMap(date, map);
                }
        }

        private void addMakzanReceiptDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt) d;
                        LocalDate date = doc.getLetterDate();
                        if (date != null)
                                addToMap(date, map);
                }
        }

        private void addMakzanAnnualDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanAnnualReport) d;
                        if (doc.getYear() != null)
                                addToMap(LocalDate.of(doc.getYear(), 1, 1), map);
                }
        }

        private void addMakzanSubmissionDatesToMap(List<?> docs, Map<String, Integer> map) {
                for (Object d : docs) {
                        var doc = (com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanSubmissionReport) d;
                        if (doc.getYear() != null)
                                addToMap(LocalDate.of(doc.getYear(), 1, 1), map);
                }
        }

        // =============================================
        // HELPER: Add to YYYY-MM map — skip invalid years
        // =============================================
        private void addToMap(LocalDate date, Map<String, Integer> map) {
                String key = date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                if (!map.containsKey(key))
                        return;
                map.merge(key, 1, Integer::sum);
        }

        private Map<String, Integer> initCurrentYearMonths() {
                Map<String, Integer> map = new TreeMap<>();
                int year = LocalDate.now().getYear();
                for (int m = 1; m <= 12; m++) {
                        map.put(year + "-" + String.format("%02d", m), 0);
                }
                return map;
        }
        // =============================================
        // HELPER: Parse date string — multiple formats
        // =============================================
        // private LocalDate parseDate(String dateStr) {
        // if (dateStr == null || dateStr.trim().isEmpty())
        // return null;
        // DateTimeFormatter[] formatters = {
        // DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
        // DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        // DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"),
        // DateTimeFormatter.ofPattern("yyyy/MM/dd"),
        // DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"),
        // DateTimeFormatter.ofPattern("dd-MM-yyyy"),
        // DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"),
        // DateTimeFormatter.ofPattern("dd/MM/yyyy"),
        // };
        // for (DateTimeFormatter formatter : formatters) {
        // try {
        // if (formatter.toString().contains("HourOfDay")) {
        // return java.time.LocalDateTime.parse(dateStr.trim(),
        // formatter).toLocalDate();
        // }
        // return LocalDate.parse(dateStr.trim(), formatter);
        // } catch (Exception e) {
        // /* try next */ }
        // }
        // logger.warn("Could not parse date: {}", dateStr);
        // return null;
        // }

        // =============================================
        // HELPER: Weekly = docs in current month
        // =============================================
        private int calculateWeeklyTotal(Map<String, Integer> monthCounts) {
                String currentMonth = LocalDate.now().getYear() + "-"
                                + String.format("%02d", LocalDate.now().getMonthValue());
                return monthCounts.getOrDefault(currentMonth, 0);
        }

        // =============================================
        // MANAGEMENT STATS (Admin overview endpoint)
        // =============================================
        public ManagementStatsDTO getManagementStats() {
                long archivesCount = archiveRepository.count();
                long sawanihCount = sawanihRepository.count();
                long hifziyaHazariCount = hifziyaHazariRepository.count();
                long hifziyaWaradaSaderaCount = hifziyaWaradaSaderaRepository.count();
                long makzanReceiptsCount = makzanReceiptRepository.count();
                long makzanAnnualCount = makzanAnnualReportRepository.count();
                long makzanSubmissionCount = makzanSubmissionReportRepository.count();
                long totalDocuments = archivesCount + sawanihCount + hifziyaHazariCount
                                + hifziyaWaradaSaderaCount + makzanReceiptsCount
                                + makzanAnnualCount + makzanSubmissionCount;

                return ManagementStatsDTO.builder()
                                .managementName("All Managements")
                                .archives(archivesCount).sawanih(sawanihCount)
                                .hifziyaHazari(hifziyaHazariCount)
                                .hifziyaWaradaSadera(hifziyaWaradaSaderaCount)
                                .makzanReceipts(makzanReceiptsCount)
                                .makzanAnnualReports(makzanAnnualCount)
                                .makzanSubmissionReports(makzanSubmissionCount)
                                .totalDocuments(totalDocuments)
                                .build();
        }

        // =============================================
        // ALL MANAGEMENT STATS LIST
        // =============================================
        public List<ManagementStatsDTO> getAllManagementStats(List<Management> allManagements) {
                return allManagements.stream().map(management -> {
                        long a = archiveRepository.countByManagement(management);
                        long s = sawanihRepository.countByManagement(management);
                        long hh = hifziyaHazariRepository.countByManagement(management);
                        long hw = hifziyaWaradaSaderaRepository.countByManagement(management);
                        long mr = makzanReceiptRepository.countByManagement(management);
                        long ma = makzanAnnualReportRepository.countByManagement(management);
                        long ms = makzanSubmissionReportRepository.countByManagement(management);
                        long total = a + s + hh + hw + mr + ma + ms;
                        return ManagementStatsDTO.builder()
                                        .managementName(management.getManagementName())
                                        .archives(a).sawanih(s).hifziyaHazari(hh)
                                        .hifziyaWaradaSadera(hw).makzanReceipts(mr)
                                        .makzanAnnualReports(ma).makzanSubmissionReports(ms)
                                        .totalDocuments(total).build();
                }).collect(Collectors.toList());
        }

        // =============================================
        // EMPTY STATS for unassigned users
        // =============================================
        private DashboardStatsDTO createEmptyStats() {
                return DashboardStatsDTO.builder()
                                .months(new ArrayList<>())
                                .fileData(new ArrayList<>()).waradaData(new ArrayList<>())
                                .saderaData(new ArrayList<>()).senderData(new ArrayList<>())
                                .recipientData(new ArrayList<>())
                                .totalArchive(0).totalHifziya(0).totalMakhzan(0).totalDocuments(0)
                                .totalWarada(0).totalSadera(0)
                                .totalSawanih(0).totalHifziyaHazari(0).totalHifziyaWaradaSadera(0)
                                .totalMakzanReceipt(0).totalAnnualReport(0).totalSubmissionReport(0)
                                .totalFile(0).totalSender(0).totalRecipient(0)
                                .weeklyData(DashboardStatsDTO.WeeklyDataDTO.builder()
                                                .sender(0).recipient(0).file(0).build())
                                .build();
        }

        // =============================================
        // ADMIN — HIJRI MONTHLY CHART (current Hijri year only)
        // =============================================
        private static final String[] HIJRI_MONTH_NAMES = {
                        "محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانی",
                        "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه"
        };

        public AdminHijriMonthlyStatsDTO getAdminHijriMonthlyStats() {
                int currentHijriYear = HijrahDate.from(LocalDate.now()).get(ChronoField.YEAR_OF_ERA);

                int[] archiveCounts = new int[12];
                int[] hifziyaCounts = new int[12];
                int[] makhzanCounts = new int[12];

                // ---- Archive ----
                for (Archive a : archiveRepository.findAll()) {
                        LocalDate d = a.getSendDate() != null ? a.getSendDate() : a.getDepartmentDate();
                        addGregorianDateToHijriBucket(d, currentHijriYear, archiveCounts);
                }

                // ---- Hifziya: Sawanih + HifziyaWaradaSadera (both have real dates) ----
                for (Sawanih s : sawanihRepository.findAll()) {
                        LocalDate d = s.getIncommingDate() != null ? s.getIncommingDate() : s.getOutgoingDate();
                        addGregorianDateToHijriBucket(d, currentHijriYear, hifziyaCounts);
                }
                for (HifziyaWaradaSadera w : hifziyaWaradaSaderaRepository.findAll()) {
                        LocalDate d = w.getIncommingDate() != null ? w.getIncommingDate() : w.getOutgoingDate();
                        addGregorianDateToHijriBucket(d, currentHijriYear, hifziyaCounts);
                }
                // Note: HifziyaHazari/Indraj (year-only, no month) are intentionally excluded —
                // see explanation above.

                // ---- Makhzan: MakzanReceipt + MakhzanWaradaSadera (both have real dates) ----
                for (MakzanReceipt r : makzanReceiptRepository.findAll()) {
                        addGregorianDateToHijriBucket(r.getLetterDate(), currentHijriYear, makhzanCounts);
                }
                for (MakhzanWaradaSadera w : makhzanWaradaSaderaRepository.findAll()) {
                        LocalDate d = w.getIncommingDate() != null ? w.getIncommingDate() : w.getOutgoingDate();
                        addGregorianDateToHijriBucket(d, currentHijriYear, makhzanCounts);
                }
                // Note: MakzanAnnualReport/SubmissionReport (year-only, no month) are
                // intentionally excluded.

                return AdminHijriMonthlyStatsDTO.builder()
                                .hijriYear(currentHijriYear)
                                .months(Arrays.asList(HIJRI_MONTH_NAMES))
                                .archiveData(toIntegerList(archiveCounts))
                                .hifziyaData(toIntegerList(hifziyaCounts))
                                .makhzanData(toIntegerList(makhzanCounts))
                                .build();
        }

        private void addGregorianDateToHijriBucket(LocalDate gregorianDate, int currentHijriYear, int[] bucket) {
                if (gregorianDate == null)
                        return;
                HijrahDate hd = HijrahDate.from(gregorianDate);
                int hYear = hd.get(ChronoField.YEAR_OF_ERA);
                int hMonth = hd.get(ChronoField.MONTH_OF_YEAR); // 1-12
                if (hYear == currentHijriYear) {
                        bucket[hMonth - 1]++;
                }
        }

        private List<Integer> toIntegerList(int[] arr) {
                List<Integer> list = new ArrayList<>();
                for (int v : arr)
                        list.add(v);
                return list;
        }
}