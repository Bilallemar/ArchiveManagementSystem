package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.Receipts;

import java.util.List;

public interface ReceiptsRepository extends JpaRepository<Receipts, Long> {

    // 🔹 د ټولو فیلډونو کې سرچ (OR condition)
    List<Receipts> findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
        String serialNumber, String archiveNumber, String department, String recipient, String sender
    );

    // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    List<Receipts> findBySerialNumberContainingIgnoreCase(String keyword);
    List<Receipts> findByArchiveNumberContainingIgnoreCase(String keyword);
    List<Receipts> findByDepartmentContainingIgnoreCase(String keyword);
    List<Receipts> findByRecipientContainingIgnoreCase(String keyword);
    List<Receipts> findBySenderContainingIgnoreCase(String keyword);
}
