package com.MCIT.ArchiveManagementSystem.services;



import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.Note;

public interface NoteService {
    Note createNoteForUser(String username, String content);

    Note updateNoteForUser(Long noteId, String content, String username);

    void deleteNoteForUser(Long noteId, String username);

    List<Note> getNotesForUser(String username);
}

