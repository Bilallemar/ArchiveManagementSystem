package com.MCIT.ArchiveManagementSystem.models;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "receipts")
public class Receipts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "archive_number")
    private String archiveNumber;

    @Column(name = "department")
    private String department;

    @Column(name = "letter_number")
    private String letterNumber;

    @Column(name = "letter_date")
    private Date letterDate;

    @Column(name = "sender")
    private String sender;

    @Column(name = "recipient")
    private String recipient;

    @Column(name = "subject_type")
    private String subjectType;


    @Column(name = "remarks")
    private String remarks;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getArchiveNumber() {
        return archiveNumber;
    }

    public void setArchiveNumber(String archiveNumber) {
        this.archiveNumber = archiveNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLetterNumber() {
        return letterNumber;
    }

    public void setLetterNumber(String letterNumber) {
        this.letterNumber = letterNumber;
    }

    public Date getLetterDate() {
        return letterDate;
    }

    public void setLetterDate(Date letterDate) {
        this.letterDate = letterDate;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSubjectType() {
        return subjectType;
    }

    public void setSubjectType(String subjectType) {
        this.subjectType = subjectType;
    }



    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }


    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
private List<FileEntity> attachments = new ArrayList<>();

public List<FileEntity> getAttachments() {
    return attachments;
}

public void setAttachments(List<FileEntity> attachments) {
    this.attachments = attachments;
}

}
