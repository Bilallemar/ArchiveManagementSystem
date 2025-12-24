// package com.MCIT.ArchiveManagementSystem.services;

// import org.springframework.stereotype.Service;
// import lombok.RequiredArgsConstructor;

// import com.MCIT.ArchiveManagementSystem.dtos.ManagementStatsDTO;
// import com.MCIT.ArchiveManagementSystem.models.Org;
// import com.MCIT.ArchiveManagementSystem.repositories.ArchiveManagement.ArchiveRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.SawanihRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaHazariRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement.HifziyaWaradaSaderaRepository;
// import com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo.MakzanReceiptRepository;

// @Service
// @RequiredArgsConstructor
// public class ManagementStatsService {

//     private final ArchiveRepository archiveRepository;
//     private final SawanihRepository sawanihRepository;
//     private final HifziyaHazariRepository hifziyaHazariRepository;
//     private final HifziyaWaradaSaderaRepository hifziyaWaradaSaderaRepository;
//     private final MakzanReceiptRepository makzanReceiptRepository;

//     public ManagementStatsDTO getStatsForOrg(Org org) {
//         ManagementStatsDTO dto = new ManagementStatsDTO();
        
//         // Archive Management
//         dto.setArchives(archiveRepository.countByOrg(org));
        
//         // Repository Management
//         dto.setSawanih(sawanihRepository.countByOrg(org));
//         dto.setHifziyaHazari(hifziyaHazariRepository.countByOrg(org));
//         dto.setHifziyaWaradaSadera(hifziyaWaradaSaderaRepository.countByOrg(org));
        
//         // Storage Management
//         dto.setMakzanReceipts(makzanReceiptRepository.countByOrg(org));
//         // نور Storage fields لکه makzanAnnualReports او makzanSubmissionReports هم اضافه کولای شو که repository ولرو
//         dto.setMakzanAnnualReports(0L);
//         dto.setMakzanSubmissionReports(0L);
        
//         // Summary
//         Long total = dto.getArchives() +
//                      dto.getSawanih() +
//                      dto.getHifziyaHazari() +
//                      dto.getHifziyaWaradaSadera() +
//                      dto.getMakzanReceipts() +
//                      dto.getMakzanAnnualReports() +
//                      dto.getMakzanSubmissionReports();
//         dto.setTotalDocuments(total);

//         return dto;
//     }
// }
