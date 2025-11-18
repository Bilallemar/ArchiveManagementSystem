// package com.MCIT.ArchiveManagementSystem.models;

// import com.fasterxml.jackson.annotation.JsonManagedReference;
// import jakarta.persistence.*;
// import lombok.*;

// import java.util.HashSet;
// import java.util.Set;

// @Entity
// @NoArgsConstructor
// @AllArgsConstructor
// @Data
// @Table(name = "managements")
// public class Management {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "management_id")
//     private Long managementId;

//     @Column(name = "management_name", nullable = false, unique = true)
//     private String managementName;

//     @OneToMany(mappedBy = "management", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
//     @JsonManagedReference
//     private Set<User> users = new HashSet<>();

//     public Management(String managementName) {
//         this.managementName = managementName;
//     }
// }
package com.MCIT.ArchiveManagementSystem.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "managements")
public class Management {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "management_id")
    private Long managementId;

    @Column(name = "management_name", nullable = false, unique = true)
    private String managementName;

    @OneToMany(mappedBy = "management", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JsonManagedReference("management-user")  // FIXED: Added unique name to match User
    private Set<User> users = new HashSet<>();

    public Management(String managementName) {
        this.managementName = managementName;
    }
}