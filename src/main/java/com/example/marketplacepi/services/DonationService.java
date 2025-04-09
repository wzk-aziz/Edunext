package com.example.marketplacepi.services;

import com.example.marketplacepi.models.Donation;
import com.example.marketplacepi.repository.DonationRepository;
import com.example.marketplacepi.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationService {
    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private DonorRepository donorRepository;

    public Donation saveDonation(Donation donation) {
        return donationRepository.save(donation);
    }
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
}