package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;


public interface MakzanReceiptRepository extends JpaRepository<MakzanReceipt, Integer> {

    // 🔹 د ټولو فیلډونو کې سرچ (OR condition)
    // List<MakzanReceipt> findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
    //     String serialNumber, String archiveNumber, String department, String recipient, String sender
    // );

    // // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    // List<MakzanReceipt> findBySerialNumberContainingIgnoreCase(String keyword);
    // List<MakzanReceipt> findByArchiveNumberContainingIgnoreCase(String keyword);
    // List<MakzanReceipt> findByDepartmentContainingIgnoreCase(String keyword);
    // List<MakzanReceipt> findByRecipientContainingIgnoreCase(String keyword);
    // List<MakzanReceipt> findBySenderContainingIgnoreCase(String keyword);
}
