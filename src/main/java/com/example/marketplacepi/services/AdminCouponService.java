package com.example.marketplacepi.services;



import com.example.marketplacepi.models.Coupon;

import java.util.List;

public interface AdminCouponService {
	Coupon createCoupon(Coupon coupon);
	List<Coupon> getAllCoupon();
}
