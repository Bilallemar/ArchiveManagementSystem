
package com.MCIT.ArchiveManagementSystem.controller;
import com.MCIT.ArchiveManagementSystem.models.Type;
import com.MCIT.ArchiveManagementSystem.services.TypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/type")
public class TypeController {

    private final TypeService typeService;
         public TypeController( TypeService typeService) {
          this.typeService = typeService;
     }

    @PostMapping
    public Type create(@RequestBody Type type) {
        return typeService.createType(type);
    }

    @PutMapping("/{id}")
    public Type update(@PathVariable Integer id, @RequestBody Type type) {
        return typeService.updateType(id, type);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        typeService.deleteType(id);
    }

    @GetMapping
    public List<Type> getAll() {
        return typeService.getAllTypes();
    }

    @GetMapping("/{id}")
    public Type getById(@PathVariable Integer id) {
        return typeService.getTypeById(id);
    }
}
