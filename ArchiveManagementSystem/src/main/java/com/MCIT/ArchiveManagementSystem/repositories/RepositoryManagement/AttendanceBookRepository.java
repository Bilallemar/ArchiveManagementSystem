package com.MCIT.ArchiveManagementSystem.repositories.RepositoryManagement;

import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.AttendanceBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceBookRepository extends JpaRepository<AttendanceBook, Long> {
}