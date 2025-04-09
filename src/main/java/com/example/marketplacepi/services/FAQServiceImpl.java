package com.example.marketplacepi.services;

import com.example.marketplacepi.dto.FAQDto;
import com.example.marketplacepi.models.FAQ;
import com.example.marketplacepi.models.Product;
import com.example.marketplacepi.repository.FAQRepository;
import com.example.marketplacepi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FAQServiceImpl implements FAQService {
	private final FAQRepository faqRepository;

	private final ProductRepository productRepository;

	public FAQDto postFAQ(Long productId, FAQDto faqDto) {
		Optional<Product> optionalProduct = productRepository.findById(productId);
		if(optionalProduct.isPresent()) {
			FAQ faq = new FAQ();
			faq.setQuestion(faqDto.getQuestion());
			faq.setAnswer(faqDto.getAnswer());
			faq.setProduct(optionalProduct.get());

			FAQ savedFAQ = faqRepository.save(faq);
			log.info("FAQ posted successfully for product with ID: {}", productId);
			return savedFAQ.getFAQDto();
		}

		log.warn("Failed to post FAQ. Product with ID {} not found.", productId);
		return null;
	}

}
