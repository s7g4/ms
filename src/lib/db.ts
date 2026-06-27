import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: any };

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  // Use require to prevent pg and adapter-pg from being bundled in client components
  const { Pool } = require("pg");
  const { PrismaPg } = require("@prisma/adapter-pg");

  const connectionString = process.env.DATABASE_URL;
  
  // Cache the pool globally to avoid connection leaks during Next.js hot-reloads
  const pool = globalForPrisma.pool || new Pool({ connectionString });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);

  prismaInstance =
    globalForPrisma.prisma ||
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  // Client-side fallback (Prisma is not designed to be run in the browser)
  prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;
