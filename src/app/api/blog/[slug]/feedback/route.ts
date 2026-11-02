import { z } from "zod";
import { commentSchema, type FeedbackComment, type FeedbackResponse } from "@/lib/feedback-schema";
import { jsonError, loadComments, loadRating, readJson, resolve } from "@/lib/feedback-server";
import { getVisitorId, hashIp } from "@/lib/visitor";

const COMMENTS_PER_WINDOW = 5;
const WINDOW_MINUTES = 10;

/** Ratings summary and every visible comment for a post. */
export async function GET(_request: Request, ctx: RouteContext<"/api/blog/[slug]/feedback">) {
  const r = await resolve(ctx);
  if ("error" in r) return r.error;
  const visitorId = await getVisitorId({ create: false });
  try {
    const [rating, comments] = await Promise.all([
      loadRating(r.sql, r.post.slug, visitorId),
      loadComments(r.sql, r.post.slug, visitorId),
    ]);
    return Response.json({ rating, comments } satisfies FeedbackResponse, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Feedback load failed:", err instanceof Error ? err.message : err);
    return jsonError(500, "Couldn't load the discussion right now.");
  }
}

/** Post a comment, or a reply when parentId is set. */
export async function POST(request: Request, ctx: RouteContext<"/api/blog/[slug]/feedback">) {
  const r = await resolve(ctx);
  if ("error" in r) return r.error;

  const body = await readJson(request);
  if (body instanceof Response) return body;

  // Honeypot: real visitors never fill `website`. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") return Response.json({ success: true });

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Please check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  }
  const { name, body: text, parentId } = parsed.data;
  const concept = parsed.data.concept || null;
  if (concept && !r.concepts.has(concept)) return jsonError(400, "That concept isn't part of this post.");

  const visitorId = (await getVisitorId({ create: true }))!;
  const ipHash = hashIp(request);

  try {
    const [{ recent }] = await r.sql`
      select count(*)::int as recent from blog_comments
      where (ip_hash = ${ipHash} or visitor_id = ${visitorId}::uuid)
        and created_at > now() - make_interval(mins => ${WINDOW_MINUTES})`;
    if (recent >= COMMENTS_PER_WINDOW) {
      return jsonError(429, "You're commenting quickly. Please wait a few minutes and try again.");
    }

    let threadConcept = concept;
    if (parentId) {
      const [parent] = await r.sql`
        select concept from blog_comments where id = ${parentId} and post_slug = ${r.post.slug} and not hidden`;
      if (!parent) return jsonError(404, "The comment you're replying to is gone.");
      threadConcept = parent.concept; // replies stay in their thread's concept
    }

    const [row] = await r.sql`
      insert into blog_comments (post_slug, parent_id, concept, author_name, body, visitor_id, ip_hash)
      values (${r.post.slug}, ${parentId ?? null}, ${threadConcept}, ${name}, ${text}, ${visitorId}::uuid, ${ipHash})
      returning id, created_at`;

    const comment: FeedbackComment = {
      id: Number(row.id),
      parentId: parentId ?? null,
      concept: threadConcept,
      name,
      body: text,
      createdAt: new Date(row.created_at).toISOString(),
      mine: true,
    };
    return Response.json({ success: true, comment }, { status: 201 });
  } catch (err) {
    console.error("Comment insert failed:", err instanceof Error ? err.message : err);
    return jsonError(500, "Couldn't post your comment right now. Please try again.");
  }
}
