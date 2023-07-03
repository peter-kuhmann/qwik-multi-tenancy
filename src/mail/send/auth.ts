import { getDefaultSenderAndFrom, getMailer } from "~/mail/mailer";

export type MailRecipient = {
  email: string;
  name: string;
};

export async function sendLoginConfirmationLinkMail(
  loginConfirmationLinkUrl: string,
  tenantName: string,
  { email, name }: MailRecipient
) {
  await getMailer().sendMail({
    ...getDefaultSenderAndFrom(),
    to: email,
    subject: `🔐 Confirm Login for ${tenantName}`,
    text: `Hello ${name} 👋

here is your login confirmation link for ${tenantName}:

${loginConfirmationLinkUrl}


Have fun at ${tenantName}!

All the best ☀️
Peter`,
  });
}

export async function sendSignUpConfirmationLinkMail(
  loginConfirmationLinkUrl: string,
  tenantName: string,
  { email, name }: MailRecipient
) {
  await getMailer().sendMail({
    ...getDefaultSenderAndFrom(),
    to: email,
    subject: `✍️ Confirm Sign Up for ${tenantName}`,
    text: `Hello ${name} 👋

here is your sign up confirmation link for ${tenantName}:

${loginConfirmationLinkUrl}


Have fun at ${tenantName}!

All the best ☀️
Peter`,
  });
}
