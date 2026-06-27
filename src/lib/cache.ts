import { getRedis } from "@/lib/redis";

/**
 * Helper to cache heavy database queries in Redis
 * @param key The cache key
 * @param ttlSeconds Time-to-live in seconds
 * @param queryFn Async function performing the query
 */
export async function cacheQuery<T>(
  key: string,
  ttlSeconds: number,
  queryFn: () => Promise<T>
): Promise<T> {
  const redis = getRedis();

  if (!redis) {
    // If Redis is not configured, fall back to executing query directly
    return await queryFn();
  }

  try {
    const cachedData = await redis.get<string>(key);

    if (cachedData) {
      // Return cached results
      return typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
    }
  } catch (err) {
    console.warn(`[Cache Read Warning] Failed to read key ${key} from Redis:`, err);
  }

  // Execute query and store results
  const result = await queryFn();

  try {
    await redis.set(key, JSON.stringify(result), { ex: ttlSeconds });
  } catch (err) {
    console.warn(`[Cache Write Warning] Failed to write key ${key} to Redis:`, err);
  }

  return result;
}
