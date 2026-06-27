import { describe, it, expect } from "vitest";
import { calculateCouponDiscount } from "../../src/lib/coupon";

describe("Coupon Discount Calculations", () => {
  it("should calculate PERCENT coupon discount correctly", () => {
    const result = calculateCouponDiscount({
      type: "PERCENT",
      value: 10, // 10%
      subtotal: 1000,
      usedCount: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.discount).toBe(100);
    expect(result.isFreeShipping).toBe(false);
  });

  it("should enforce maxDiscount bounds on PERCENT coupons", () => {
    const result = calculateCouponDiscount({
      type: "PERCENT",
      value: 20, // 20% of 1000 = 200
      subtotal: 1000,
      maxDiscount: 150, // max is capped at 150
      usedCount: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.discount).toBe(150);
  });

  it("should calculate FIXED coupon discount correctly", () => {
    const result = calculateCouponDiscount({
      type: "FIXED",
      value: 250,
      subtotal: 1000,
      usedCount: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.discount).toBe(250);
  });

  it("should cap FIXED discount at subtotal", () => {
    const result = calculateCouponDiscount({
      type: "FIXED",
      value: 500,
      subtotal: 300, // discount exceeds cost
      usedCount: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.discount).toBe(300);
  });

  it("should flag FREE_SHIPPING coupons", () => {
    const result = calculateCouponDiscount({
      type: "FREE_SHIPPING",
      value: 0,
      subtotal: 1000,
      usedCount: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.discount).toBe(0);
    expect(result.isFreeShipping).toBe(true);
  });

  it("should return an error for expired coupons", () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    const result = calculateCouponDiscount({
      type: "PERCENT",
      value: 10,
      subtotal: 1000,
      expiresAt: pastDate,
      usedCount: 0,
    });

    expect(result.error).toBe("Coupon has expired");
    expect(result.discount).toBe(0);
  });

  it("should return an error for coupons exceeding usage limit", () => {
    const result = calculateCouponDiscount({
      type: "PERCENT",
      value: 10,
      subtotal: 1000,
      usedCount: 5,
      usageLimit: 5, // Limit reached
    });

    expect(result.error).toBe("Coupon usage limit reached");
    expect(result.discount).toBe(0);
  });

  it("should return an error for orders below minimum order value", () => {
    const result = calculateCouponDiscount({
      type: "PERCENT",
      value: 10,
      subtotal: 400,
      minOrder: 500, // minimum order is 500
      usedCount: 0,
    });

    expect(result.error).toBe("Minimum order value of ₹500 required for this coupon");
    expect(result.discount).toBe(0);
  });
});
