import { z } from "zod";

/** Shared by the feedback UI (client) and /api/blog/[slug]/feedback (server). */
export const commentSchema = z.object({
  name: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(2, "Your name needs at least 2 characters.")
    .max(60, "Please keep your name under 60 characters."),
  body: z
    .string({ error: "Please write a comment." })
    .trim()
    .min(2, "Your comment needs at least 2 characters.")
    .max(2000, "Please keep comments under 2,000 characters."),
  concept: z.string().trim().max(80).nullish(),
  parentId: z.number().int().positive().nullish(),
});

export const ratingSchema = z.object({
  stars: z.number({ error: "Pick between 1 and 5 stars." }).int().min(1).max(5),
});

export type CommentInput = z.infer<typeof commentSchema>;

export type FeedbackComment = {
  id: number;
  parentId: number | null;
  concept: string | null;
  name: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

export type RatingSummary = { average: number; count: number; mine: number | null };

export type FeedbackResponse = { rating: RatingSummary; comments: FeedbackComment[] };
