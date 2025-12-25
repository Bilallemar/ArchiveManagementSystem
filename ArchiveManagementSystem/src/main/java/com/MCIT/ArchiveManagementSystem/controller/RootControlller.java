package com.MCIT.ArchiveManagementSystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootControlller {
  @GetMapping("/")
  public String wellcome(){
      return "wellcome to archive"; 
  }



}
