package com.MCIT.ArchiveManagementSystem.models.StorageManagement;

import jakarta.persistence.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.MCIT.ArchiveManagementSystem.models.FileEntity;

@Entity
@Table(name = "received_issued_books")
public class ReceivedIssuedBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "book_number")
    private String bookNumber; 

    @Column(name = "sender")
    private String sender;  

    @Column(name = "recipient")
    private String recipient;  

    @Column(name = "letter_number")
    private String letterNumber;  

    @Column(name = "issued_date")
    private Date issuedDate; 

    @Column(name = "received_date")
    private Date receivedDate; 

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary; 

    @Column(name = "subject_type")
    private String subjectType;  

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks; 

    // د فایلونو ضمیمې
    @OneToMany(mappedBy = "receivedIssuedBook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> attachments = new ArrayList<>();

    // Constructors
    public ReceivedIssuedBook() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookNumber() { return bookNumber; }
    public void setBookNumber(String bookNumber) { this.bookNumber = bookNumber; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getLetterNumber() { return letterNumber; }
    public void setLetterNumber(String letterNumber) { this.letterNumber = letterNumber; }

    public Date getIssuedDate() { return issuedDate; }
    public void setIssuedDate(Date issuedDate) { this.issuedDate = issuedDate; }

    public Date getReceivedDate() { return receivedDate; }
    public void setReceivedDate(Date receivedDate) { this.receivedDate = receivedDate; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSubjectType() { return subjectType; }
    public void setSubjectType(String subjectType) { this.subjectType = subjectType; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public List<FileEntity> getAttachments() { return attachments; }
    public void setAttachments(List<FileEntity> attachments) { this.attachments = attachments; }
}
