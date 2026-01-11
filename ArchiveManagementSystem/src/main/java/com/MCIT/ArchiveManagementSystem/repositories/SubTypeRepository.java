package com.MCIT.ArchiveManagementSystem.repositories;

import com.MCIT.ArchiveManagementSystem.models.SubType;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubTypeRepository extends JpaRepository<SubType, Integer> {
  List<SubType> findByTypeId(Integer typeId);

}
