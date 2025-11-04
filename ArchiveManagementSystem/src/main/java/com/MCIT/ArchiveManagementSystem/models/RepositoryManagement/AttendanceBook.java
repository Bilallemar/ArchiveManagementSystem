package com.MCIT.ArchiveManagementSystem.models.RepositoryManagement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;
import com.MCIT.ArchiveManagementSystem.models.enums.AttendanceCategory;

@Entity
@Table(name = "attendance_book")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // اصلي فیلډونه
    private String provinceOrCenter;      // ولایات و مرکز
    private Year year;                    // سال
    private String sender;                // مرسل
    private String recipient;             // مرسل الیه
    private Boolean scannedFile;          // فایل سکن شده
    private Integer numberOfVolumes;      // تعداد جلد

    // د کټګورۍ معلومات د Enum په بڼه
    @Enumerated(EnumType.STRING)
    private AttendanceCategory category;      // جلد: ولایتی/مرکزي + قضایی/ادارتي/اجیران

            @OneToMany(mappedBy = "attendanceBook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> attachments = new ArrayList<>();
}
