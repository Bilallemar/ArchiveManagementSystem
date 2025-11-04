package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ArchiveReceivedIssuedBook;

public interface ArchiveReceivedIssuedBookRepository  extends JpaRepository<ArchiveReceivedIssuedBook, Long>{
    List<ArchiveReceivedIssuedBook> findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
        String bookNumber, String letterNumber, String recipient, String sender
    );

    // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    List<ArchiveReceivedIssuedBook> findByBookNumberContainingIgnoreCase(String bookNumber);
    List<ArchiveReceivedIssuedBook> findByLetterNumberContainingIgnoreCase(String letterNumber);
    List<ArchiveReceivedIssuedBook> findByRecipientContainingIgnoreCase(String recipient);
    List<ArchiveReceivedIssuedBook> findBySenderContainingIgnoreCase(String sender);
    
}
