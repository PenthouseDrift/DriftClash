import { headers } from "next/headers";
import { redis } from "./redis";

/** The visitor's address as the hosting platform reports it, used only to count requests. */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

/**
 * Allow at most `limit` calls per `windowSeconds` for this name and visitor. Returns false once they are over.
 * If Redis can't be reached the call is allowed, so a hiccup doesn't lock people out of registering.
 */
export async function allowRequest(name: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const key = `driftclash:rl:${name}:${await clientKey()}`;
    const used = await redis.incr(key);
    if (used === 1) await redis.expire(key, windowSeconds);
    return used <= limit;
  } catch (error) {
    console.error("[rate-limit] could not check:", error);
    return true;
  }
}
