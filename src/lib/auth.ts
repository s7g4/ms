import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET || "temp-secret-for-build-purposes-only-32-chars",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "USER" },
      loyaltyPoints: { type: "number", defaultValue: 0 },
      referralCode: { type: "string" },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
