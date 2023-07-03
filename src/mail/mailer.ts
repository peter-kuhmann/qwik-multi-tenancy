import * as nodemailer from "nodemailer";
import { Env } from "~/env";

let transporter: nodemailer.Transporter | null = null;

export function getMailer(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: Env.EMAIL_SMTP_HOST,
      port: Env.EMAIL_SMTP_PORT,
      secure: Env.EMAIL_SMTP_SECURE,
      auth: {
        user: Env.EMAIL_SMTP_USERNAME,
        pass: Env.EMAIL_SMTP_PASSWORD,
      },
    });
  }

  return transporter;
}

export function getDefaultSenderAndFrom(): { from: string; sender: string } {
  return {
    sender: Env.EMAIL_SMTP_FROM,
    from: Env.EMAIL_SMTP_FROM,
  };
}
