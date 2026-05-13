"use client";

import { profile } from "@/content/site";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/contact-schema";
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

type ContactFieldName = keyof ContactFormInput;

type FormValues = ContactFormInput & {
  website: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

const contactFieldNames: ContactFieldName[] = [
  "name",
  "email",
  "phone",
  "message",
];

export function ContactSection() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ContactFieldName, string>>>(
    {},
  );
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));

    if (contactFieldNames.includes(name as ContactFieldName)) {
      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionMessage("");

    const parsed = contactFormSchema.safeParse({
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        message: fieldErrors.message?.[0],
      });
      setSubmissionState("error");
      setSubmissionMessage("Please fix the highlighted fields and try again.");
      return;
    }

    if (values.website.trim().length > 0) {
      setSubmissionState("success");
      setSubmissionMessage("Message sent successfully.");
      setValues(initialValues);
      return;
    }

    try {
      setSubmissionState("submitting");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          payload?.message ??
            "We could not send your message right now. Please try again.",
        );
      }

      setSubmissionState("success");
      setSubmissionMessage("Thanks for reaching out. I will reply shortly.");
      setValues(initialValues);
    } catch (error) {
      setSubmissionState("error");
      setSubmissionMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section
      id="contact"
      className="section-reveal section-delay-5 border-b-2 border-black bg-black px-4 py-14 text-white sm:py-20 md:px-8"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10 lg:gap-12">
        <div className="space-y-5">
          <p className="font-meta text-[11px] font-bold uppercase text-white/70 sm:text-[12px]">
            CONTACT
          </p>
          <h2 className="font-display-upper text-[clamp(2.6rem,10vw,8rem)] leading-[0.86] tracking-[-0.04em] text-[#FF4D00]">
            LET&apos;S BUILD
          </h2>
          <p className="font-body max-w-xl text-[13px] font-medium leading-relaxed text-white/80 sm:text-[15px]">
            Share your project details and goals. I will get back with a clear
            plan and next steps.
          </p>

          <div className="space-y-3 pt-2">
            <a
              href={`mailto:${profile.email}`}
              className="font-meta inline-flex items-center gap-2 text-[11px] font-bold uppercase text-white transition hover:text-[#FF4D00] sm:text-[12px]"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
            <p className="font-meta inline-flex items-center gap-2 text-[11px] font-bold uppercase text-white/80 sm:text-[12px]">
              <Phone className="h-4 w-4" />
              {profile.phone}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl">
          <input
            type="text"
            name="website"
            value={values.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="font-meta text-[11px] font-bold uppercase sm:text-[12px]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="font-meta w-full rounded-xl border-2 border-white/50 bg-black px-5 py-3.5 text-[12px] font-bold uppercase text-white placeholder:text-white/65 focus:border-[#FF4D00]"
              />
              {errors.name && (
                <p className="font-meta text-[11px] font-bold text-orange-200">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="font-meta text-[11px] font-bold uppercase sm:text-[12px]"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={values.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="font-meta w-full rounded-xl border-2 border-white/50 bg-black px-5 py-3.5 text-[12px] font-bold uppercase text-white placeholder:text-white/65 focus:border-[#FF4D00]"
              />
              {errors.phone && (
                <p className="font-meta text-[11px] font-bold text-orange-200">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="font-meta text-[11px] font-bold uppercase sm:text-[12px]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="font-meta w-full rounded-xl border-2 border-white/50 bg-black px-5 py-3.5 text-[12px] font-bold uppercase text-white placeholder:text-white/65 focus:border-[#FF4D00]"
            />
            {errors.email && (
              <p className="font-meta text-[11px] font-bold text-orange-200">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="font-meta text-[11px] font-bold uppercase sm:text-[12px]"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              placeholder="Tell me what you want to build"
              className="font-meta min-h-36 w-full resize-y rounded-xl border-2 border-white/50 bg-black px-5 py-3.5 text-[12px] font-bold uppercase text-white placeholder:text-white/65 focus:border-[#FF4D00]"
            />
            {errors.message && (
              <p className="font-meta text-[11px] font-bold text-orange-200">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submissionState === "submitting"}
              className="font-meta button-depth inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FF4D00] bg-[#FF4D00] px-7 py-3 text-[11px] font-bold uppercase text-black transition-all duration-200 hover:-translate-y-1 hover:bg-black hover:text-[#FF4D00] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submissionState === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                "Send Message"
              )}
            </button>

            <p
              className="font-meta inline-flex items-center gap-2 text-[11px] font-bold uppercase text-white/80 sm:text-[12px]"
              aria-live="polite"
            >
              {submissionState === "success" && (
                <CheckCircle2 className="h-4 w-4 text-[#FF4D00]" />
              )}
              {submissionState === "error" && (
                <AlertCircle className="h-4 w-4 text-orange-200" />
              )}
              {submissionMessage}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

