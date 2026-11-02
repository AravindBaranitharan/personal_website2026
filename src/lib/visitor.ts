import { createHash, randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ar_vid";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Anonymous visitor id kept in an httpOnly cookie. It lets a visitor change their own star rating
 * and see which comments are theirs, without accounts. Not a security boundary.
 */
export async function getVisitorId({ create }: { create: boolean }): Promise<string | null> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing && UUID.test(existing)) return existing;
  if (!create) return null;
  const id = randomUUID();
  jar.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
  return id;
}

/** Salted hash of the caller's IP, stored only for rate limiting. */
export function hashIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.FEEDBACK_SALT ?? "aravind.blog";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
