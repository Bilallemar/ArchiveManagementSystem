package com.MCIT.ArchiveManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MCIT.ArchiveManagementSystem.models.Note;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByOwnerUsername(String ownerUsername);
}