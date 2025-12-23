package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.SubType;
import com.MCIT.ArchiveManagementSystem.repositories.SubTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sub-type")
@CrossOrigin(origins = "*")
public class SubTypeController {

    @Autowired
    private SubTypeRepository subTypeRepository;

    // Get all SubTypes
    @GetMapping
    public ResponseEntity<List<SubType>> getAllSubTypes() {
        List<SubType> subTypes = subTypeRepository.findAll();
        return ResponseEntity.ok(subTypes);
    }

    // Get SubTypes by Type ID
    @GetMapping("/by-type/{typeId}")
    public ResponseEntity<List<SubType>> getSubTypesByTypeId(@PathVariable Integer typeId) {
        List<SubType> subTypes = subTypeRepository.findByTypeId(typeId);
        return ResponseEntity.ok(subTypes);
    }

    // Get single SubType by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubType> getSubTypeById(@PathVariable Integer id) {
        return subTypeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new SubType
    @PostMapping
    public ResponseEntity<SubType> createSubType(@RequestBody SubType subType) {
        SubType savedSubType = subTypeRepository.save(subType);
        return ResponseEntity.ok(savedSubType);
    }

    // Update SubType
    @PutMapping("/{id}")
    public ResponseEntity<SubType> updateSubType(@PathVariable Integer id, @RequestBody SubType subType) {
        return subTypeRepository.findById(id)
                .map(existing -> {
                    existing.setName(subType.getName());
                    existing.setType(subType.getType());
                    SubType updated = subTypeRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete SubType
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubType(@PathVariable Integer id) {
        if (subTypeRepository.existsById(id)) {
            subTypeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}