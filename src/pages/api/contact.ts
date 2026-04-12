import { getMailer } from "@/config/mailer";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/contact-schema";
import type { NextApiRequest, NextApiResponse } from "next";

const CONTACT_MESSAGE_FIELDS: Record<keyof ContactFormInput, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};

type ErrorResponse = {
  success: false;
  message: string;
  issues?: Partial<Record<keyof ContactFormInput, string[]>>;
};

type SuccessResponse = {
  success: true;
};

type ApiResponse = SuccessResponse | ErrorResponse;

type EmailContent = {
  text: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function generateEmailContent(data: ContactFormInput): EmailContent {
  const text = (Object.keys(data) as (keyof ContactFormInput)[])
    .map((fieldName) => `${CONTACT_MESSAGE_FIELDS[fieldName]}:\n${data[fieldName]}`)
    .join("\n\n");

  const htmlRows = (Object.keys(data) as (keyof ContactFormInput)[])
    .map(
      (fieldName) => `
        <tr>
          <td style="padding:8px 12px;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;border:1px solid #e5e7eb;vertical-align:top;">
            ${CONTACT_MESSAGE_FIELDS[fieldName]}
          </td>
          <td style="padding:8px 12px;font-family:Arial,sans-serif;font-size:14px;color:#111827;border:1px solid #e5e7eb;white-space:pre-wrap;">
            ${escapeHtml(data[fieldName])}
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  const parsed = contactFormSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required fields with valid values.",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const mailer = getMailer();

  if (!mailer) {
    return res.status(500).json({
      success: false,
      message: "Mail service is not configured on the server.",
    });
  }

  try {
    await mailer.transporter.sendMail({
      ...mailer.mailOptions,
      ...generateEmailContent(parsed.data),
      subject: `New contact message from ${parsed.data.name}`,
      replyTo: parsed.data.email,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown mailing error";
    console.error("Contact form submission failed:", message);

    return res.status(500).json({
      success: false,
      message: "We could not send your message right now. Please try again.",
    });
  }
}

