"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";
import { contactFormSchema, type ContactFormInput, type ContactFormIssues } from "@/lib/contact-schema";

type FieldName = keyof ContactFormInput;
type Values = Record<FieldName | "website", string>;
type FieldErrors = Partial<Record<FieldName, string>>;
type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; name: string }
  | { state: "error"; message: string };

const EMPTY: Values = { name: "", email: "", phone: "", message: "", website: "" };
const FALLBACK_ERROR = "Something went wrong and your message wasn't sent. Please try again, or email me directly.";

function firstErrors(issues: ContactFormIssues | undefined): FieldErrors {
  const out: FieldErrors = {};
  if (!issues) return out;
  for (const key of Object.keys(issues) as FieldName[]) {
    const message = issues[key]?.[0];
    if (message) out[key] = message;
  }
  return out;
}

function validate(values: Values) {
  const result = contactFormSchema.safeParse(values);
  return result.success
    ? { data: result.data, errors: {} as FieldErrors }
    : { data: null, errors: firstErrors(z.flattenError(result.error).fieldErrors) };
}

const inputClass =
  "block w-full rounded-[var(--radius-sm)] border border-transparent bg-surface px-4 py-3 font-sans text-[16px] leading-[1.4] text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-offset-2 focus:outline-focus-ring aria-[invalid=true]:border-danger";

/** Contact form: validated with the shared zod schema, posted as JSON to /api/contact. */
export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  const sending = status.state === "sending";

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const next = { ...values, [event.target.name]: event.target.value } as Values;
    setValues(next);
    if (attempted) setErrors(validate(next).errors);
    if (status.state === "success" || status.state === "error") setStatus({ state: "idle" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setAttempted(true);

    const { data, errors: found } = validate(values);
    setErrors(found);
    if (!data) {
      const first = (Object.keys(found) as FieldName[])[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: values.website }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { success: true }
        | { success: false; message?: string; issues?: ContactFormIssues }
        | null;

      if (response.ok && payload?.success) {
        setStatus({ state: "success", name: data.name });
        setValues(EMPTY);
        setErrors({});
        setAttempted(false);
        return;
      }

      if (payload && !payload.success && payload.issues) setErrors(firstErrors(payload.issues));
      setStatus({
        state: "error",
        message: (payload && !payload.success && payload.message) || FALLBACK_ERROR,
      });
    } catch {
      setStatus({ state: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  const field = (name: FieldName) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange,
    disabled: sending,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: inputClass,
  });

  const errorText = (name: FieldName) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className="m-0 text-[13px] leading-[18px] text-danger">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-[var(--space-5)]">
      <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <label htmlFor="contact-name" className="ar-mono">
            Name
          </label>
          <input type="text" autoComplete="name" required maxLength={80} {...field("name")} />
          {errorText("name")}
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor="contact-email" className="ar-mono">
            Email
          </label>
          <input type="email" autoComplete="email" inputMode="email" required maxLength={120} {...field("email")} />
          {errorText("email")}
        </div>
      </div>

      <div className="grid content-start gap-2">
        <label htmlFor="contact-phone" className="ar-mono">
          Phone <span className="ar-muted">(optional)</span>
        </label>
        <input type="tel" autoComplete="tel" inputMode="tel" maxLength={20} {...field("phone")} />
        {errorText("phone")}
      </div>

      <div className="grid content-start gap-2">
        <label htmlFor="contact-message" className="ar-mono">
          Message
        </label>
        <textarea rows={6} required maxLength={2000} {...field("message")} className={`${inputClass} min-h-40 resize-y`} />
        {errorText("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are dropped by the API. */}
      <div className="ar-sr" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={onChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-[var(--space-5)] gap-y-[var(--space-3)]">
        <button type="submit" className="ar-btn ar-btn--primary ar-ring disabled:cursor-wait disabled:opacity-80" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
          {!sending && (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 12 12 4M5.5 4H12v6.5" />
            </svg>
          )}
        </button>
        <p
          id="contact-form-status"
          role="status"
          aria-live="polite"
          className={`m-0 min-w-0 flex-1 basis-[16rem] text-[15px] leading-[1.4] ${
            status.state === "success" ? "text-success" : status.state === "error" ? "text-danger" : "text-ink-2"
          }`}
        >
          {status.state === "sending" && "Sending…"}
          {status.state === "success" && `Sent. Thanks, ${status.name} — I'll reply by email soon.`}
          {status.state === "error" && `Not sent: ${status.message}`}
        </p>
      </div>
    </form>
  );
}

/** Copies an address to the clipboard and announces the result. The address itself stays selectable text beside it. */
export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  }

  return (
    <>
      <button type="button" className="ar-btn ar-btn--secondary ar-btn--sm" onClick={copy}>
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" aria-live="polite" className="ar-sr">
        {state === "copied" ? "Email address copied to the clipboard." : state === "failed" ? "Couldn't copy. Select the address to copy it." : ""}
      </span>
    </>
  );
}
