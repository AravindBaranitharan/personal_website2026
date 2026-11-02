"use client";

import { useCallback, useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { commentSchema, type FeedbackComment, type FeedbackResponse, type RatingSummary } from "@/lib/feedback-schema";

type Concept = { id: string; title: string };
type Load = { state: "loading" } | { state: "ready" } | { state: "offline"; message: string };

const NAME_KEY = "ar-feedback-name";
const MAX_INDENT = 3;

const inputClass =
  "block w-full rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3 font-sans text-[16px] leading-[1.4] text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-offset-2 focus:outline-focus-ring aria-[invalid=true]:border-danger";

function timeAgo(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  return "just now";
}

/* ------------------------------------------------------------------ Stars */

function Star({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="m12 2.6 2.83 6.1 6.67.68-5 4.48 1.42 6.56L12 17.06l-5.92 3.36 1.42-6.56-5-4.48 6.67-.68Z"
        className={filled ? "fill-pink stroke-pink-ink" : "fill-none stroke-ink-soft"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STAR_WORDS = ["", "Not useful", "Somewhat useful", "Useful", "Very useful", "Excellent"];

function Rating({ slug, rating, onChange, disabled }: { slug: string; rating: RatingSummary; onChange: (r: RatingSummary) => void; disabled: boolean }) {
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shown = hover || rating.mine || 0;

  async function rate(stars: number) {
    if (saving || disabled) return;
    setSaving(true);
    setError(null);
    const previous = rating;
    onChange({ ...rating, mine: stars }); // optimistic
    try {
      const res = await fetch(`/api/blog/${slug}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Couldn't save your rating.");
      onChange(data.rating);
    } catch (e) {
      onChange(previous);
      setError(e instanceof Error ? e.message : "Couldn't save your rating.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-[var(--space-5)] md:grid-cols-[auto_minmax(0,1fr)] md:items-end md:gap-[var(--space-8)]">
      <div className="grid gap-[var(--space-2)]">
        <p className="ar-mono ar-muted m-0">Reader rating</p>
        <p className="m-0 flex items-baseline gap-[var(--space-3)]">
          <span className="text-[clamp(56px,7vw,88px)] font-bold leading-[0.85] tracking-[-0.05em] tabular-nums">
            {rating.count ? rating.average.toFixed(1) : "–"}
          </span>
          <span className="text-[14px] text-ink-muted">
            {rating.count ? `/ 5 from ${rating.count} ${rating.count === 1 ? "reader" : "readers"}` : "No ratings yet. Be the first."}
          </span>
        </p>
      </div>

      <div className="grid gap-[var(--space-2)]">
        <p className="ar-mono ar-muted m-0" id={`${slug}-rate-label`}>
          {rating.mine ? "Your rating · tap to change" : "How useful was this?"}
        </p>
        <div
          role="radiogroup"
          aria-labelledby={`${slug}-rate-label`}
          className="flex items-center gap-[var(--space-1)]"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating.mine === n}
              aria-label={`${n} ${n === 1 ? "star" : "stars"}: ${STAR_WORDS[n]}`}
              disabled={disabled}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => rate(n)}
              className="grid h-12 w-12 cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Star filled={n <= shown} className="h-9 w-9" />
            </button>
          ))}
          <span className="ml-[var(--space-3)] min-w-[12ch] text-[14px] text-ink-muted" aria-live="polite">
            {saving ? "Saving…" : shown ? STAR_WORDS[shown] : ""}
          </span>
        </div>
        {error && (
          <p role="alert" className="m-0 text-[14px] text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Comment form */

type FormErrors = Partial<Record<"name" | "body", string>>;

function CommentForm({
  slug,
  concepts,
  parentId,
  defaultConcept,
  onPosted,
  onCancel,
  disabled,
}: {
  slug: string;
  concepts: Concept[];
  parentId?: number;
  defaultConcept?: string;
  onPosted: (c: FeedbackComment) => void;
  onCancel?: () => void;
  disabled: boolean;
}) {
  const id = useId();
  const isReply = parentId !== undefined;
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [concept, setConcept] = useState(defaultConcept ?? "");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{ state: "idle" | "sending" } | { state: "error"; message: string }>({ state: "idle" });

  // Remember the visitor's name between comments.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a saved value after mount
      if (saved) setName(saved);
    } catch {}
  }, []);

  // Follow the concept filter for the top-level form until the visitor picks one themselves.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with the selected filter
    if (!isReply) setConcept(defaultConcept ?? "");
  }, [defaultConcept, isReply]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status.state === "sending" || disabled) return;
    const parsed = commentSchema.safeParse({ name, body, concept: concept || null, parentId: parentId ?? null });
    if (!parsed.success) {
      const fe = z.flattenError(parsed.error).fieldErrors;
      setErrors({ name: fe.name?.[0], body: fe.body?.[0] });
      return;
    }
    setErrors({});
    setStatus({ state: "sending" });
    try {
      const res = await fetch(`/api/blog/${slug}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.issues) setErrors({ name: data.issues.name?.[0], body: data.issues.body?.[0] });
        throw new Error(data.message ?? "Couldn't post your comment.");
      }
      try {
        localStorage.setItem(NAME_KEY, parsed.data.name);
      } catch {}
      setBody("");
      setStatus({ state: "idle" });
      if (data.comment) onPosted(data.comment);
    } catch (e) {
      setStatus({ state: "error", message: e instanceof Error ? e.message : "Couldn't post your comment." });
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-[var(--space-3)]" aria-label={isReply ? "Reply" : "Start a thread"}>
      <div className={`grid gap-[var(--space-3)] ${isReply ? "" : "sm:grid-cols-2"}`}>
        <div className="grid gap-[var(--space-1)]">
          <label htmlFor={`${id}-name`} className="ar-mono ar-muted">
            Your name
          </label>
          <input
            id={`${id}-name`}
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={60}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
          />
          {errors.name && (
            <p id={`${id}-name-err`} className="m-0 text-[13px] text-danger">
              {errors.name}
            </p>
          )}
        </div>
        {!isReply && (
          <div className="grid gap-[var(--space-1)]">
            <label htmlFor={`${id}-concept`} className="ar-mono ar-muted">
              About
            </label>
            <select id={`${id}-concept`} className={inputClass} value={concept} onChange={(e) => setConcept(e.target.value)}>
              <option value="">The whole post</option>
              {concepts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-[var(--space-1)]">
        <label htmlFor={`${id}-body`} className="ar-mono ar-muted">
          {isReply ? "Your reply" : "Your feedback"}
        </label>
        <textarea
          id={`${id}-body`}
          className={`${inputClass} min-h-[120px] resize-y`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          placeholder={isReply ? "Add to the thread…" : "Agree, disagree, or add what I missed…"}
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? `${id}-body-err` : undefined}
        />
        {errors.body && (
          <p id={`${id}-body-err`} className="m-0 text-[13px] text-danger">
            {errors.body}
          </p>
        )}
      </div>

      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-[var(--space-3)]">
        <button type="submit" className={`ar-btn ar-btn--primary ${isReply ? "ar-btn--sm" : ""}`} disabled={status.state === "sending" || disabled}>
          {status.state === "sending" ? "Posting…" : isReply ? "Post reply" : "Post to the thread"}
        </button>
        {onCancel && (
          <button type="button" className="ar-btn ar-btn--secondary ar-btn--sm" onClick={onCancel}>
            Cancel
          </button>
        )}
        <span className="text-[13px] text-ink-muted">{body.length > 1600 ? `${2000 - body.length} characters left` : ""}</span>
      </div>
      {status.state === "error" && (
        <p role="alert" className="m-0 text-[14px] text-danger">
          {status.message}
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ Thread */

function Comment({
  comment,
  childrenOf,
  depth,
  conceptTitle,
  replyingTo,
  setReplyingTo,
  renderReplyForm,
}: {
  comment: FeedbackComment;
  childrenOf: Map<number | null, FeedbackComment[]>;
  depth: number;
  conceptTitle: (id: string | null) => string | null;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  renderReplyForm: (parent: FeedbackComment) => ReactNode;
}) {
  const replies = childrenOf.get(comment.id) ?? [];
  const concept = depth === 0 ? conceptTitle(comment.concept) : null;
  const initial = comment.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <li className="grid gap-[var(--space-3)]">
      <article className="grid gap-[var(--space-3)]" aria-label={`Comment by ${comment.name}`}>
        <header className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-1)]">
          <span
            className={`grid h-9 w-9 place-items-center rounded-full text-[15px] font-bold ${comment.mine ? "bg-pink text-on-pink" : "bg-night text-on-night"}`}
            aria-hidden="true"
          >
            {initial}
          </span>
          <span className="font-semibold">{comment.name}</span>
          {comment.mine && <span className="ar-chip ar-chip--fill !h-6 !text-[10px]">you</span>}
          <time dateTime={comment.createdAt} className="text-[13px] text-ink-muted" title={new Date(comment.createdAt).toLocaleString()}>
            {timeAgo(comment.createdAt)}
          </time>
          {concept && <span className="ar-chip !h-6 !text-[10px]">{concept}</span>}
        </header>
        <p className="m-0 whitespace-pre-wrap pl-[calc(36px+var(--space-3))] text-[16px] leading-[1.55] text-ink-2 [overflow-wrap:anywhere]">
          {comment.body}
        </p>
        <div className="pl-[calc(36px+var(--space-3))]">
          {replyingTo === comment.id ? (
            renderReplyForm(comment)
          ) : (
            <button type="button" className="ar-bracket cursor-pointer border-0 bg-transparent p-0" onClick={() => setReplyingTo(comment.id)}>
              Reply
            </button>
          )}
        </div>
      </article>

      {replies.length > 0 && (
        <ol
          className={`m-0 grid list-none gap-[var(--space-5)] p-0 ${depth < MAX_INDENT ? "ml-[18px] border-l-2 border-line pl-[var(--space-5)]" : ""}`}
          aria-label={`Replies to ${comment.name}`}
        >
          {replies.map((r) => (
            <Comment
              key={r.id}
              comment={r}
              childrenOf={childrenOf}
              depth={depth + 1}
              conceptTitle={conceptTitle}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              renderReplyForm={renderReplyForm}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ Section */

/** Reader feedback for a post: a star rating plus threaded comments that can be tagged with a concept from the post. */
export function Feedback({ slug, concepts }: { slug: string; concepts: Concept[] }) {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [rating, setRating] = useState<RatingSummary>({ average: 0, count: 0, mine: null });
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch(`/api/blog/${slug}/feedback`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setLoad({ state: "offline", message: data.message ?? "The discussion is unavailable right now." });
        return;
      }
      const fb = data as FeedbackResponse;
      setRating(fb.rating);
      setComments(fb.comments);
      setLoad({ state: "ready" });
    } catch {
      setLoad({ state: "offline", message: "The discussion is unavailable right now." });
    }
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading data from the API on mount
    fetchFeedback();
  }, [fetchFeedback]);

  const conceptTitle = useCallback((id: string | null) => concepts.find((c) => c.id === id)?.title ?? null, [concepts]);

  const { childrenOf, counts } = useMemo(() => {
    const map = new Map<number | null, FeedbackComment[]>();
    for (const c of comments) {
      const list = map.get(c.parentId) ?? [];
      list.push(c);
      map.set(c.parentId, list);
    }
    const counts = new Map<string, number>();
    for (const c of comments) {
      const key = c.concept ?? "post";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return { childrenOf: map, counts };
  }, [comments]);

  // Newest threads first; replies inside a thread stay in conversation order.
  const threads = useMemo(() => {
    const roots = [...(childrenOf.get(null) ?? [])].reverse();
    if (filter === "all") return roots;
    return roots.filter((c) => (filter === "post" ? c.concept === null : c.concept === filter));
  }, [childrenOf, filter]);

  const offline = load.state === "offline";
  const addComment = (c: FeedbackComment) => {
    setComments((prev) => [...prev, c]);
    setReplyingTo(null);
  };

  const filters = [
    { id: "all", label: "All", count: comments.length },
    { id: "post", label: "Whole post", count: counts.get("post") ?? 0 },
    ...concepts.map((c) => ({ id: c.id, label: c.title, count: counts.get(c.id) ?? 0 })),
  ].filter((f) => f.id === "all" || f.id === filter || f.count > 0); // only concepts people are discussing

  return (
    <section id="feedback" aria-labelledby="feedback-title" className="scroll-mt-[var(--space-8)] bg-band">
      <div className="ar-container ar-section grid gap-[var(--space-8)]">
        <header className="grid gap-[var(--space-3)]">
          <p className="ar-mono ar-muted m-0">Discussion</p>
          <h2 id="feedback-title" className="m-0 text-[clamp(48px,8vw,112px)] font-bold leading-[0.88] tracking-[-0.045em]">
            feedback.
          </h2>
          <p className="m-0 max-w-[56ch] text-[18px] leading-[1.5] text-ink-2">
            Rate the post, then start a thread on any concept. Disagreements are especially welcome. No sign-up needed.
          </p>
        </header>

        {offline && (
          <p role="status" className="m-0 rounded-[var(--radius-md)] border border-line-strong bg-surface p-[var(--space-5)] text-[16px]">
            {load.message}
          </p>
        )}

        <Rating slug={slug} rating={rating} onChange={setRating} disabled={offline || load.state === "loading"} />

        <div className="grid gap-[var(--space-6)] border-t border-line-strong pt-[var(--space-6)] lg:grid-cols-12 lg:gap-x-[var(--space-7)]">
          <div className="lg:col-span-5">
            <div className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] bg-surface p-[var(--space-5)] lg:sticky lg:top-[var(--space-6)]">
              <h3 className="m-0 text-[24px] font-semibold tracking-[-0.02em]">Start a thread</h3>
              <CommentForm
                slug={slug}
                concepts={concepts}
                defaultConcept={filter !== "all" && filter !== "post" ? filter : undefined}
                onPosted={addComment}
                disabled={offline || load.state === "loading"}
              />
            </div>
          </div>

          <div className="grid content-start gap-[var(--space-6)] lg:col-span-7">
            <div className="flex flex-wrap gap-[var(--space-2)]" role="group" aria-label="Filter threads by concept">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className="inline-flex h-8 cursor-pointer items-center gap-[var(--space-2)] rounded-full border border-line-strong bg-transparent px-[var(--space-3)] font-mono text-[11px] uppercase tracking-[0.06em] text-ink transition-colors hover:bg-surface aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
                >
                  {f.label}
                  <span className="tabular-nums opacity-60">{f.count}</span>
                </button>
              ))}
            </div>

            {load.state === "loading" ? (
              <p className="m-0 text-ink-muted" role="status">
                Loading the discussion…
              </p>
            ) : threads.length === 0 ? (
              <p className="m-0 text-[16px] text-ink-muted">
                {offline ? "" : filter === "all" ? "No threads yet. Start the first one." : "No threads on this concept yet. Start one."}
              </p>
            ) : (
              <ol className="m-0 grid list-none gap-[var(--space-7)] p-0" aria-label="Threads">
                {threads.map((c) => (
                  <Comment
                    key={c.id}
                    comment={c}
                    childrenOf={childrenOf}
                    depth={0}
                    conceptTitle={conceptTitle}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    renderReplyForm={(parent) => (
                      <CommentForm
                        slug={slug}
                        concepts={concepts}
                        parentId={parent.id}
                        onPosted={addComment}
                        onCancel={() => setReplyingTo(null)}
                        disabled={offline}
                      />
                    )}
                  />
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
