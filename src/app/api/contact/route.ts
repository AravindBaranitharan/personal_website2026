import { z } from "zod";
import { contactFormSchema, type ContactFormInput, type ContactFormIssues } from "@/lib/contact-schema";
import { getMailer } from "@/lib/mailer";

// Runs on the default Node.js runtime. With cacheComponents enabled Next.js does not allow a
// `runtime` segment export (see route-segment-config/runtime.md), and POST handlers are never cached.

type ErrorResponse = {
  success: false;
  message: string;
  issues?: ContactFormIssues;
};

type SuccessResponse = { success: true };

const MAX_BODY_BYTES = 16 * 1024;

const CONTACT_MESSAGE_FIELDS: Record<keyof ContactFormInput, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};

function error(status: number, message: string, issues?: ContactFormIssues) {
  return Response.json({ success: false, message, ...(issues ? { issues } : {}) } satisfies ErrorResponse, {
    status,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function generateEmailContent(data: ContactFormInput): { text: string; html: string } {
  const fields = (Object.keys(CONTACT_MESSAGE_FIELDS) as (keyof ContactFormInput)[]).filter(
    (fieldName) => typeof data[fieldName] === "string" && data[fieldName] !== "",
  );

  const text = fields.map((fieldName) => `${CONTACT_MESSAGE_FIELDS[fieldName]}:\n${data[fieldName]}`).join("\n\n");

  const htmlRows = fields
    .map(
      (fieldName) => `
        <tr>
          <td style="padding:8px 12px;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;border:1px solid #e5e7eb;vertical-align:top;">
            ${CONTACT_MESSAGE_FIELDS[fieldName]}
          </td>
          <td style="padding:8px 12px;font-family:Arial,sans-serif;font-size:14px;color:#111827;border:1px solid #e5e7eb;white-space:pre-wrap;">
            ${escapeHtml(data[fieldName] ?? "")}
          </td>
        </tr>
      `,
    )
    .join("");

  return {
    text,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>New Contact Message</title>
        </head>
        <body style="margin:0;padding:24px;background:#f3f4f6;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse;">
            <tr>
              <td style="padding:16px 20px;font-family:Arial,sans-serif;font-size:20px;font-weight:700;color:#111827;border-bottom:1px solid #e5e7eb;">
                New Contact Message
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  ${htmlRows}
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return error(413, "That message is too long to send.");
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return error(413, "That message is too long to send.");
    body = JSON.parse(raw);
  } catch {
    return error(400, "The request body must be valid JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return error(400, "The request body must be a JSON object.");
  }

  // Honeypot: real visitors never see or fill `website`. Pretend it worked so bots don't retry.
  const honeypot = (body as Record<string, unknown>).website;
  if (typeof honeypot === "string" ? honeypot.trim() !== "" : honeypot != null) {
    return Response.json({ success: true } satisfies SuccessResponse);
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return error(
      400,
      "Please complete all required fields with valid values.",
      z.flattenError(parsed.error).fieldErrors,
    );
  }

  const mailer = getMailer();
  if (!mailer) {
    return error(503, "The contact form isn't connected to email yet. Please email me directly instead.");
  }

  const data = parsed.data;
  try {
    await mailer.transporter.sendMail({
      ...mailer.mailOptions,
      ...generateEmailContent(data),
      subject: `New contact message from ${data.name.replace(/[\r\n]+/g, " ")}`,
      replyTo: { name: data.name.replace(/[\r\n]+/g, " "), address: data.email },
    });
  } catch (err) {
    console.error("Contact form submission failed:", err instanceof Error ? err.message : "Unknown mailing error");
    return error(500, "I couldn't send your message right now. Please try again, or email me directly.");
  }

  return Response.json({ success: true } satisfies SuccessResponse);
}
