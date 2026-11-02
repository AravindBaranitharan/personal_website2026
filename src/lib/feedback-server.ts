import { getConcepts, getPost } from "@/content/blog";
import { getSql } from "@/lib/db";
import type { FeedbackComment, RatingSummary } from "@/lib/feedback-schema";

export const MAX_BODY_BYTES = 8 * 1024;

export function jsonError(status: number, message: string, issues?: Record<string, string[] | undefined>) {
  return Response.json({ success: false, message, ...(issues ? { issues } : {}) }, { status });
}

export const OFFLINE_MESSAGE = "Comments and ratings aren't connected yet. Please check back soon.";

/** Resolves the post and database, or returns the error response to send instead. */
export async function resolve(ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const post = getPost(slug);
  if (!post) return { error: jsonError(404, "That post doesn't exist.") } as const;
  const sql = getSql();
  if (!sql) return { error: jsonError(503, OFFLINE_MESSAGE) } as const;
  return { post, sql, concepts: new Set(getConcepts(post).map((c) => c.id)) } as const;
}

/** Reads a small JSON object body, enforcing the size cap. */
export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return jsonError(413, "That's too long to send.");
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return jsonError(413, "That's too long to send.");
    const body: unknown = JSON.parse(raw);
    if (typeof body !== "object" || body === null || Array.isArray(body)) return jsonError(400, "The request body must be a JSON object.");
    return body as Record<string, unknown>;
  } catch {
    return jsonError(400, "The request body must be valid JSON.");
  }
}

type Sql = NonNullable<ReturnType<typeof getSql>>;

export async function loadRating(sql: Sql, slug: string, visitorId: string | null): Promise<RatingSummary> {
  const [row] = await sql`
    select coalesce(avg(stars), 0)::float as average,
           count(*)::int as count,
           max(case when visitor_id = ${visitorId}::uuid then stars end)::int as mine
    from blog_ratings where post_slug = ${slug}`;
  return { average: Math.round(Number(row.average) * 10) / 10, count: Number(row.count), mine: row.mine ?? null };
}

export async function loadComments(sql: Sql, slug: string, visitorId: string | null): Promise<FeedbackComment[]> {
  const rows = await sql`
    select id, parent_id, concept, author_name, body, created_at, visitor_id = ${visitorId}::uuid as mine
    from blog_comments
    where post_slug = ${slug} and not hidden
    order by created_at asc
    limit 1000`;
  const comments: FeedbackComment[] = rows.map((r) => ({
    id: Number(r.id),
    parentId: r.parent_id == null ? null : Number(r.parent_id),
    concept: r.concept,
    name: r.author_name,
    body: r.body,
    createdAt: new Date(r.created_at).toISOString(),
    mine: r.mine === true,
  }));
  // Drop replies whose parent was hidden (rows are oldest-first, so parents come before children).
  const kept = new Set<number>();
  return comments.filter((c) => {
    if (c.parentId !== null && !kept.has(c.parentId)) return false;
    kept.add(c.id);
    return true;
  });
}
