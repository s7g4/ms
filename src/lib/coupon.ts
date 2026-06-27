export type CouponType = "PERCENT" | "FIXED" | "FREE_SHIPPING";

interface CalculateDiscountParams {
  type: CouponType;
  value: number;
  subtotal: number;
  minOrder?: number | null;
  maxDiscount?: number | null;
  usedCount: number;
  usageLimit?: number | null;
  expiresAt?: Date | string | null;
}

export interface CouponDiscountResult {
  discount: number;
  isFreeShipping: boolean;
  error?: string;
}

/**
 * Validates a coupon and calculates its discount amount
 */
export function calculateCouponDiscount({
  type,
  value,
  subtotal,
  minOrder = null,
  maxDiscount = null,
  usedCount,
  usageLimit = null,
  expiresAt = null,
}: CalculateDiscountParams): CouponDiscountResult {
  // 1. Check expiration date
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return { discount: 0, isFreeShipping: false, error: "Coupon has expired" };
  }

  // 2. Check usage limits
  if (usageLimit !== null && usedCount >= usageLimit) {
    return { discount: 0, isFreeShipping: false, error: "Coupon usage limit reached" };
  }

  // 3. Check min order conditions
  if (minOrder !== null && subtotal < minOrder) {
    return {
      discount: 0,
      isFreeShipping: false,
      error: `Minimum order value of ₹${minOrder} required for this coupon`,
    };
  }

  let discount = 0;
  let isFreeShipping = false;

  // 4. Calculate value
  if (type === "PERCENT") {
    discount = subtotal * (value / 100);
    if (maxDiscount !== null && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else if (type === "FIXED") {
    discount = value;
    if (discount > subtotal) {
      discount = subtotal;
    }
  } else if (type === "FREE_SHIPPING") {
    isFreeShipping = true;
  }

  return { discount, isFreeShipping };
}
