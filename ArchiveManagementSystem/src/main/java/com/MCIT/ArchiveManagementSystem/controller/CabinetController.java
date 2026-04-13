package com.MCIT.ArchiveManagementSystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.Cabinet;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFile;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetFloor;
import com.MCIT.ArchiveManagementSystem.models.CabinetAddress.CabinetShelf;
import com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress.CabinetFileRepository;
import com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress.CabinetFloorRepository;
import com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress.CabinetRepository;
import com.MCIT.ArchiveManagementSystem.repositories.CabinetAddress.CabinetShelfRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cabinet")
@RequiredArgsConstructor
public class CabinetController {

    private final CabinetRepository cabinetRepository;
    private final CabinetFloorRepository floorRepository;
    private final CabinetShelfRepository shelfRepository;
    private final CabinetFileRepository fileRepository;

    // ── GET all cabinets ──────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Cabinet>> getAllCabinets() {
        return ResponseEntity.ok(cabinetRepository.findAll());
    }

    // ── GET floors by cabinet ─────────────────────────────────────
    @GetMapping("/{cabinetId}/floors")
    public ResponseEntity<List<CabinetFloor>> getFloors(
            @PathVariable Integer cabinetId) {
        Cabinet cabinet = cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new RuntimeException("Cabinet not found"));
        return ResponseEntity.ok(floorRepository.findByCabinet(cabinet));
    }

    // ── GET shelves by floor ──────────────────────────────────────
    @GetMapping("/floors/{floorId}/shelves")
    public ResponseEntity<List<CabinetShelf>> getShelves(
            @PathVariable Integer floorId) {
        CabinetFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new RuntimeException("Floor not found"));
        return ResponseEntity.ok(shelfRepository.findByFloor(floor));
    }

    // ── GET files by shelf ────────────────────────────────────────
    @GetMapping("/shelves/{shelfId}/files")
    public ResponseEntity<List<CabinetFile>> getFiles(
            @PathVariable Integer shelfId) {
        CabinetShelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));
        return ResponseEntity.ok(fileRepository.findByShelf(shelf));
    }

    // ── POST (create) endpoints ───────────────────────────────────
    @PostMapping
    public ResponseEntity<Cabinet> createCabinet(@RequestBody Cabinet cabinet) {
        return ResponseEntity.ok(cabinetRepository.save(cabinet));
    }

    @PostMapping("/floors")
    public ResponseEntity<CabinetFloor> createFloor(
            @RequestBody CabinetFloor floor) {
        return ResponseEntity.ok(floorRepository.save(floor));
    }

    @PostMapping("/shelves")
    public ResponseEntity<CabinetShelf> createShelf(
            @RequestBody CabinetShelf shelf) {
        return ResponseEntity.ok(shelfRepository.save(shelf));
    }

    @PostMapping("/files")
    public ResponseEntity<CabinetFile> createFile(
            @RequestBody CabinetFile file) {
        return ResponseEntity.ok(fileRepository.save(file));
    }

    // ── PUT (update) endpoints ────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<Cabinet> updateCabinet(
            @PathVariable Integer id,
            @RequestBody Cabinet cabinet) {
        Cabinet existing = cabinetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cabinet not found"));
        existing.setName(cabinet.getName());
        existing.setLocation(cabinet.getLocation());
        existing.setDescription(cabinet.getDescription());
        return ResponseEntity.ok(cabinetRepository.save(existing));
    }

    @PutMapping("/floors/{id}")
    public ResponseEntity<CabinetFloor> updateFloor(
            @PathVariable Integer id,
            @RequestBody CabinetFloor floor) {
        CabinetFloor existing = floorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor not found"));
        existing.setName(floor.getName());
        existing.setCabinet(floor.getCabinet());
        return ResponseEntity.ok(floorRepository.save(existing));
    }

    @PutMapping("/shelves/{id}")
    public ResponseEntity<CabinetShelf> updateShelf(
            @PathVariable Integer id,
            @RequestBody CabinetShelf shelf) {
        CabinetShelf existing = shelfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));
        existing.setName(shelf.getName());
        existing.setFloor(shelf.getFloor());
        return ResponseEntity.ok(shelfRepository.save(existing));
    }

    @PutMapping("/files/{id}")
    public ResponseEntity<CabinetFile> updateFile(
            @PathVariable Integer id,
            @RequestBody CabinetFile file) {
        CabinetFile existing = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        existing.setName(file.getName());
        existing.setFileNumber(file.getFileNumber());
        existing.setShelf(file.getShelf());
        return ResponseEntity.ok(fileRepository.save(existing));
    }

    // ── DELETE endpoints ──────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCabinet(@PathVariable Integer id) {
        cabinetRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/floors/{id}")
    public ResponseEntity<Void> deleteFloor(@PathVariable Integer id) {
        floorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/shelves/{id}")
    public ResponseEntity<Void> deleteShelf(@PathVariable Integer id) {
        shelfRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Integer id) {
        fileRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}