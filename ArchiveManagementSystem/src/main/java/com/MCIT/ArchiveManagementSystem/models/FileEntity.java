package com.MCIT.ArchiveManagementSystem.models;


import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.AttendanceBook;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.EmpoymentOffice;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ArchiveReceivedIssuedBook;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.RegistrationBook;
import com.MCIT.ArchiveManagementSystem.models.RepositoryManagement.ResolutionsAndMemorandumsOfTheHighCouncil;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.Receipts;
import com.MCIT.ArchiveManagementSystem.models.StorageManagement.ReceivedIssuedBook;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;
    private String fileType;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    @JsonIgnore
    private Receipts receipt;

    @ManyToOne
    @JoinColumn(name = "received_issued_book_id")
    @JsonIgnore
    private ReceivedIssuedBook receivedIssuedBook;

      @ManyToOne
    @JoinColumn(name = "attendance_book_id")
    @JsonIgnore
    private AttendanceBook attendanceBook;

        @ManyToOne
    @JoinColumn(name = "empoyment_office_id")
    @JsonIgnore
    private EmpoymentOffice empoymentOffice;

           @ManyToOne
    @JoinColumn(name = "archive_received_issued_book_id")
    @JsonIgnore
    private ArchiveReceivedIssuedBook  archiveReceivedIssuedBook; ;


           @ManyToOne
    @JoinColumn(name = "registration_book_id")
    @JsonIgnore
    private RegistrationBook registrationBook;


             @ManyToOne
    @JoinColumn(name = "resolutions_and_memorandums_of_the_high_council_id")
    @JsonIgnore
    private ResolutionsAndMemorandumsOfTheHighCouncil resolutionsAndMemorandumsOfTheHighCouncil;
    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Receipts getReceipt() {
        return receipt;
    }

    public void setReceipt(Receipts receipt) {
        this.receipt = receipt;
    }

    public ReceivedIssuedBook getReceivedIssuedBook() {
        return receivedIssuedBook;
    }

    public void setReceivedIssuedBook(ReceivedIssuedBook receivedIssuedBook) {
        this.receivedIssuedBook = receivedIssuedBook;
    }
    public AttendanceBook getAttendanceBook() {
        return attendanceBook;
    }

    public void setAttendanceBook(AttendanceBook attendanceBook) {
        this.attendanceBook = attendanceBook;
    }
    public EmpoymentOffice getEmpoymentOffice() {
        return empoymentOffice;
    }
    public void setEmpoymentOffice(EmpoymentOffice empoymentOffice) {
        this.empoymentOffice = empoymentOffice;
    }
    public ArchiveReceivedIssuedBook getArchiveReceivedIssuedBook() {
        return archiveReceivedIssuedBook;
    }
    public void setArchiveReceivedIssuedBook(ArchiveReceivedIssuedBook receivedIssuedBookRepository) {
        this.archiveReceivedIssuedBook = receivedIssuedBookRepository;
    }

    public RegistrationBook getRegistrationBook() {
        return registrationBook;
    }
    public void setRegistrationBook(RegistrationBook registrationBook) {
        this.registrationBook = registrationBook;
    }
    public ResolutionsAndMemorandumsOfTheHighCouncil getResolutionsAndMemorandumsOfTheHighCouncil() {
        return resolutionsAndMemorandumsOfTheHighCouncil;
    }
    public void setResolutionsAndMemorandumsOfTheHighCouncil(ResolutionsAndMemorandumsOfTheHighCouncil resolutionsAndMemorandumsOfTheHighCouncil) {
        this.resolutionsAndMemorandumsOfTheHighCouncil = resolutionsAndMemorandumsOfTheHighCouncil;
    }
}
