import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    // 1. Verify database is reachable
    const dbCheck = await prisma.$queryRaw`SELECT 1`.then(() => "connected").catch((err) => {
      console.error("[Health Check]: Database connection failed:", err);
      return "failed";
    });

    // 2. Verify Redis is reachable
    let redisStatus = "not_configured";
    const redis = getRedis();
    if (redis) {
      redisStatus = await redis.ping().then(() => "connected").catch((err) => {
        console.error("[Health Check]: Redis ping failed:", err);
        return "failed";
      });
    }

    const overallStatus = dbCheck === "connected" && (redisStatus === "connected" || redisStatus === "not_configured") ? "ok" : "unhealthy";
    const statusCode = overallStatus === "ok" ? 200 : 503;

    return NextResponse.json(
      {
        status: overallStatus,
        database: dbCheck,
        redis: redisStatus,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    );
  } catch (error: any) {
    console.error("[Health Check Error]:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Unknown health check error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
