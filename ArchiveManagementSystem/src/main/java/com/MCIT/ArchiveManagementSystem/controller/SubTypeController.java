package com.MCIT.ArchiveManagementSystem.controller;

import com.MCIT.ArchiveManagementSystem.models.SubType;

import com.MCIT.ArchiveManagementSystem.services.SubTypeService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sub-type")
public class SubTypeController {

    private final SubTypeService subTypeService;
       public SubTypeController( SubTypeService subTypeService) {
        this.subTypeService = subTypeService;
    }

    @PostMapping
    public SubType create(@RequestBody SubType subType) {
        return subTypeService.createSubType(subType);
    }

    @PutMapping("/{id}")
    public SubType update(@PathVariable Integer id, @RequestBody SubType subType) {
        return subTypeService.updateSubType(id, subType);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        subTypeService.deleteSubType(id);
    }

    @GetMapping
    public List<SubType> getAll() {
        return subTypeService.getAllSubTypes();
    }

    @GetMapping("/{id}")
    public SubType getById(@PathVariable Integer id) {
        return subTypeService.getSubTypeById(id);
    }
}
