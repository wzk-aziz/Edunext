package com.example.marketplacepi.services;


import com.example.marketplacepi.dto.CouponDto;
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

	public CouponDto createCoupon(CouponDto couponDto) {
		Coupon coupon = Coupon.builder()
				.name(couponDto.getName())
				.code(couponDto.getCode())
				.discount(couponDto.getDiscount())
				.expirationDate(couponDto.getExpirationDate())
				.oneTimeUse(couponDto.isOneTimeUse())
				.maxUsage(couponDto.getMaxUsage())
				.usageCount(0)
				.build();

		Coupon saved = couponRepository.save(coupon);
		return mapToDto(saved);
	}
	private CouponDto mapToDto(Coupon coupon) {
		CouponDto dto = new CouponDto();
		dto.setId(coupon.getId());
		dto.setName(coupon.getName());
		dto.setCode(coupon.getCode());
		dto.setDiscount(coupon.getDiscount());
		dto.setExpirationDate(new java.sql.Date(coupon.getExpirationDate().getTime()));
		dto.setOneTimeUse(coupon.isOneTimeUse());
		dto.setMaxUsage(coupon.getMaxUsage());
		return dto;
	}



	public List<Coupon> getAllCoupon() {
		log.info("Fetching all coupons.");
		return couponRepository.findAll();
	}
}
