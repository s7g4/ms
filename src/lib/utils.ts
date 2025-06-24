import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateReferralCode(): string {
  return nanoid(8).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function calculateLoyaltyTier(points: number): {
  tier: string;
  color: string;
  nextTier: string;
  nextTierPoints: number;
} {
  if (points >= 5000) return { tier: "Platinum", color: "#e5e4e2", nextTier: "Max", nextTierPoints: 5000 };
  if (points >= 2000) return { tier: "Gold", color: "#ffd166", nextTier: "Platinum", nextTierPoints: 5000 };
  if (points >= 500) return { tier: "Silver", color: "#9a87c0", nextTier: "Gold", nextTierPoints: 2000 };
  return { tier: "Bronze", color: "#cd7f32", nextTier: "Silver", nextTierPoints: 500 };
}
