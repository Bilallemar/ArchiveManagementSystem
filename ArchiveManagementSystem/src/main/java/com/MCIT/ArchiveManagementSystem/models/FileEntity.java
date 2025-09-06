package com.MCIT.ArchiveManagementSystem.models;

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
}
