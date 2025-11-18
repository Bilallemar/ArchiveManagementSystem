package com.MCIT.ArchiveManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.MCIT.ArchiveManagementSystem.models.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

}
