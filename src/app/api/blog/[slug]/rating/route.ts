import { ratingSchema } from "@/lib/feedback-schema";
import { jsonError, loadRating, readJson, resolve } from "@/lib/feedback-server";
import { getVisitorId, hashIp } from "@/lib/visitor";

/** Distinct visitors allowed to rate one post from the same network, to blunt cookie-clearing ballot stuffing. */
const RATERS_PER_IP = 3;

/** Set or change this visitor's star rating for a post. */
export async function POST(request: Request, ctx: RouteContext<"/api/blog/[slug]/rating">) {
  const r = await resolve(ctx);
  if ("error" in r) return r.error;

  const body = await readJson(request);
  if (body instanceof Response) return body;
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Pick between 1 and 5 stars.");

  const visitorId = (await getVisitorId({ create: true }))!;
  const ipHash = hashIp(request);

  try {
    const [{ others }] = await r.sql`
      select count(*)::int as others from blog_ratings
      where post_slug = ${r.post.slug} and ip_hash = ${ipHash} and visitor_id <> ${visitorId}::uuid`;
    if (others >= RATERS_PER_IP) return jsonError(429, "This post has already been rated from your network.");

    await r.sql`
      insert into blog_ratings (post_slug, visitor_id, stars, ip_hash)
      values (${r.post.slug}, ${visitorId}::uuid, ${parsed.data.stars}, ${ipHash})
      on conflict (post_slug, visitor_id) do update set stars = excluded.stars, updated_at = now()`;

    return Response.json({ success: true, rating: await loadRating(r.sql, r.post.slug, visitorId) });
  } catch (err) {
    console.error("Rating failed:", err instanceof Error ? err.message : err);
    return jsonError(500, "Couldn't save your rating right now. Please try again.");
  }
}
