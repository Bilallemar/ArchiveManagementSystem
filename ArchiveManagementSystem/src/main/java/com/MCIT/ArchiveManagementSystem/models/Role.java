
package com.MCIT.ArchiveManagementSystem.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", length = 20)
    private AppRole roleName;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @JsonManagedReference("role-user")  // FIXED: Added unique name to match User
    @ToString.Exclude
    private Set<User> users = new HashSet<>();

    public Role(AppRole roleName) {
        this.roleName = roleName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;
        return roleId != null && roleId.equals(((Role) o).getRoleId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}