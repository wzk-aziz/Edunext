package com.example.marketplacepi.services;


import com.example.marketplacepi.exceptions.ValidationException;
import com.example.marketplacepi.models.Coupon;
import com.example.marketplacepi.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminCouponServiceImpl implements AdminCouponService {
	private final CouponRepository couponRepository;

	public Coupon createCoupon(Coupon coupon) {
		if(couponRepository.existsByCode(coupon.getCode())) {
			throw new ValidationException("Coupon code already exists");
		} else {
			log.info("New Coupon Code Added: {}", coupon.getCode());
			return couponRepository.save(coupon);
		}
	}

	public List<Coupon> getAllCoupon() {
		log.info("Fetching all coupons.");
		return couponRepository.findAll();
	}
}
