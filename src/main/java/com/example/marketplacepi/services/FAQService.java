package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.FAQDto;

public interface FAQService {
	FAQDto postFAQ(Long productId, FAQDto faqDto);
}
