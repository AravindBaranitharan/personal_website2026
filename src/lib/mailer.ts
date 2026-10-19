import nodemailer from "nodemailer";

export type MailerConfig = {
  transporter: nodemailer.Transporter;
  mailOptions: {
    from: string;
    to: string;
  };
};

function toPort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return value && Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * SMTP transport for the contact form, configured from the environment.
 * Uses SMTP_HOST/SMTP_PORT when set, otherwise Gmail (with an app password).
 * Returns null when credentials or addresses are missing, so the route can answer 503.
 */
export function getMailer(): MailerConfig | null {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = toPort(process.env.SMTP_PORT, 587);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  const from = process.env.CONTACT_FROM || process.env.EMAIL || smtpUser;
  const to = process.env.CONTACT_TO || process.env.EMAIL || smtpUser;

  if (!smtpUser || !smtpPass || !from || !to) {
    return null;
  }

  const auth = { user: smtpUser, pass: smtpPass };

  const transporter = smtpHost
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth,
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth,
      });

  return {
    transporter,
    mailOptions: { from, to },
  };
}
