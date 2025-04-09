package com.example.marketplacepi.services;



import com.example.marketplacepi.dto.CouponDto;
import com.example.marketplacepi.models.Coupon;

import java.util.List;

public interface AdminCouponService {
	CouponDto createCoupon(CouponDto couponDto);
	List<Coupon> getAllCoupon();
}
