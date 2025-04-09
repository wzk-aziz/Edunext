package com.example.marketplacepi.controllers;

import com.example.marketplacepi.dto.CouponDto;
import com.example.marketplacepi.exceptions.ValidationException;
import com.example.marketplacepi.models.Coupon;
import com.example.marketplacepi.services.AdminCouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Slf4j
public class CouponController {

	private final AdminCouponService adminCouponService;

	@PostMapping("/creat")
	public ResponseEntity<?> createCoupon(@RequestBody CouponDto couponDto) {
		log.info("Received request to create coupon with code: {}", couponDto.getCode());

		if (couponDto.getCode() == null || couponDto.getCode().trim().isEmpty()) {
			log.warn("Coupon code is empty");
			return ResponseEntity.status(HttpStatus.CONFLICT).body("codeEmpty");
		}

		try {
			log.info("Creating coupon: {}", couponDto);
			CouponDto createdCoupon = adminCouponService.createCoupon(couponDto);
			log.info("Coupon created with ID: {}", createdCoupon.getId());
			return ResponseEntity.ok(createdCoupon);
		} catch (ValidationException e) {
			log.error("Validation error while creating coupon: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}



	@GetMapping
	public ResponseEntity<List<Coupon>> getAllCoupon() {
		log.info("Received request to get all coupons");
		List<Coupon> coupons = adminCouponService.getAllCoupon();
		log.info("Returning {} coupons", coupons.size());
		return ResponseEntity.ok(coupons);
	}
}
