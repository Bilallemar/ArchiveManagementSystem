package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.ReceivedIssuedBook;
import java.util.List;

public interface ReceivedIssuedBookRepository extends JpaRepository<ReceivedIssuedBook, Long> {

    // 🔹 د ټولو فیلډونو کې سرچ (OR condition)
    List<ReceivedIssuedBook> findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
        String bookNumber, String letterNumber, String recipient, String sender
    );

    // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    List<ReceivedIssuedBook> findByBookNumberContainingIgnoreCase(String bookNumber);
    List<ReceivedIssuedBook> findByLetterNumberContainingIgnoreCase(String letterNumber);
    List<ReceivedIssuedBook> findByRecipientContainingIgnoreCase(String recipient);
    List<ReceivedIssuedBook> findBySenderContainingIgnoreCase(String sender);
}