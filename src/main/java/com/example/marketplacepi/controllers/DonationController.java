package com.example.marketplacepi.controllers;

import com.example.marketplacepi.models.Donation;
import com.example.marketplacepi.services.DonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/donations")
public class DonationController {
    @Autowired
    private DonationService donationService;

    @PostMapping("/create")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        Donation savedDonation = donationService.saveDonation(donation);
        return ResponseEntity.ok(savedDonation);
    }
    @GetMapping("/list")
    public ResponseEntity<List<Donation>> getAllDonations() {
        List<Donation> donations = donationService.getAllDonations();
        return ResponseEntity.ok(donations);
    }
}
