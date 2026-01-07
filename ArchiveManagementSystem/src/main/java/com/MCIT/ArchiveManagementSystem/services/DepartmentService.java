package com.MCIT.ArchiveManagementSystem.services;

import org.springframework.stereotype.Service;
import com.MCIT.ArchiveManagementSystem.models.Department;
import com.MCIT.ArchiveManagementSystem.repositories.DepartmentRepository;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Integer id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Integer id, Department details) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        existing.setName(details.getName());
            existing.setOrg(details.getOrg());
        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Integer id) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        departmentRepository.delete(existing);
    }
}
