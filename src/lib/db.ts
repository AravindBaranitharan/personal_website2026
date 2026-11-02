import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/** Lazily created so `next build` works without DATABASE_URL. Returns null when the database isn't configured. */
export function getSql() {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  client = neon(url);
  return client;
}
