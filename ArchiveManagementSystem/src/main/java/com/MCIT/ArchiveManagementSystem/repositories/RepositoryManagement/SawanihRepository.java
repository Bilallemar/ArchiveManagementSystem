package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Org;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.Sawanih;

public interface SawanihRepository  extends JpaRepository<Sawanih, Integer> {
    List<Sawanih> findByOrg(Org org);
    Long countByOrg(Org org);
    // List<Sawanih> findByBookNumberContainingIgnoreCaseOrLetterNumberContainingIgnoreCaseOrRecipientContainingIgnoreCaseOrSenderContainingIgnoreCase(
    //     String bookNumber, String letterNumber, String recipient, String sender
    // );

    // // 🔹 د هر فیلډ لپاره جلا methods (د فلټر لپاره)
    // List<Sawanih> findByBookNumberContainingIgnoreCase(String bookNumber);
    // List<Sawanih> findByLetterNumberContainingIgnoreCase(String letterNumber);
    // List<Sawanih> findByRecipientContainingIgnoreCase(String recipient);
    // List<Sawanih> findBySenderContainingIgnoreCase(String sender);
    
}
