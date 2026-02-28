package com.MCIT.ArchiveManagementSystem.repositories.StorageManagementRepo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.MakzanReceipt;

public interface MakzanReceiptRepository extends JpaRepository<MakzanReceipt, Integer> {

    List<MakzanReceipt> findByManagement(Management management);

    Long countByManagement(Management management);

    // Search across relevant fields
    @Query("SELECT m FROM MakzanReceipt m WHERE " +
           "LOWER(m.docNo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.letterNo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.subjectType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MakzanReceipt> searchAllFields(@Param("keyword") String keyword);

    // Specific field searches (optional but useful)
    @Query("SELECT m FROM MakzanReceipt m WHERE LOWER(m.docNo) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MakzanReceipt> searchByDocNo(@Param("keyword") String keyword);

    @Query("SELECT m FROM MakzanReceipt m WHERE LOWER(m.letterNo) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MakzanReceipt> searchByLetterNo(@Param("keyword") String keyword);

    @Query("SELECT m FROM MakzanReceipt m WHERE LOWER(m.subjectType) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MakzanReceipt> searchBySubjectType(@Param("keyword") String keyword);

    @Query("SELECT m FROM MakzanReceipt m WHERE LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MakzanReceipt> searchByDescription(@Param("keyword") String keyword);
}