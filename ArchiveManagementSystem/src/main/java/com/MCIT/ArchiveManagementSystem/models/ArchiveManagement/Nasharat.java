package com.MCIT.ArchiveManagementSystem.models.ArchiveManagement;

import java.time.LocalDate;

import com.MCIT.ArchiveManagementSystem.models.DocType;
import com.MCIT.ArchiveManagementSystem.models.Management;
import com.MCIT.ArchiveManagementSystem.models.Org;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nasharat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Nasharat {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id; // نمره مسلسل

  @Column(nullable = false)
  private String docNo; // نمبر مکتوب / پارسل

  // Sender Organization (مرسل) - REMOVED externalOrg completely
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "sender_org_id", nullable = false)
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
  private Org senderOrg;

  // Receiver Organization (مرسل الیه)
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "receiver_org_id", nullable = false)
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
  private Org receiverOrg;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "management_id")
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
  private Management management;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "doc_type_id", nullable = false)
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
  private DocType docType; // نوعیت پارسل
  private LocalDate receiveDate; // تاریخ دریافت
  private LocalDate sendDate; // تاریخ ارسال
  private LocalDate departmentDate; // تاریخ شعبه

  @Column(length = 1000)
  private String description; // ملاحظات

}