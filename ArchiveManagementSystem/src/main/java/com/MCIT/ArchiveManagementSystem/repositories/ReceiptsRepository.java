

package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.Receipts;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptsRepository extends JpaRepository<Receipts, Long> {

List<Receipts> findBySerialNumberContainingIgnoreCaseOrArchiveNumberContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
    String serialNumber, String archiveNumber, String department, String recipient, String sender);

}
