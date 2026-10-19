import { z } from "zod";

/** Treat a blank optional field as "not given" so it skips validation instead of failing it. */
const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

/** Shared by the contact form (client) and /api/contact (server). Unknown keys, like the honeypot, are stripped. */
export const contactFormSchema = z.object({
  name: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(2, "Your name needs at least 2 characters.")
    .max(80, "Please keep your name under 80 characters."),
  email: z
    .string({ error: "Please enter your email address." })
    .trim()
    .min(1, "Please enter your email address.")
    .max(120, "Please keep your email under 120 characters.")
    .pipe(z.email("That doesn't look like a valid email address.")),
  phone: z.preprocess(
    blankToUndefined,
    z
      .string({ error: "Please enter a valid phone number." })
      .trim()
      .regex(/^[+()\-\d\s]+$/, "Use only digits, spaces and + ( ) - in the phone number.")
      .min(7, "Phone numbers need at least 7 characters.")
      .max(20, "Please keep the phone number under 20 characters.")
      .optional(),
  ),
  message: z
    .string({ error: "Please write a message." })
    .trim()
    .min(10, "Your message needs at least 10 characters.")
    .max(2000, "Please keep your message under 2000 characters."),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/** Field-level messages keyed by field name, as returned by z.flattenError(). */
export type ContactFormIssues = Partial<Record<keyof ContactFormInput, string[]>>;
