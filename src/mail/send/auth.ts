import { getDefaultSenderAndFrom, getMailer } from "~/mail/mailer";

export type MailRecipient = {
  email: string;
  name: string;
};

export async function sendLoginConfirmationLinkMail(
  loginConfirmationLinkUrl: string,
  { email, name }: MailRecipient
) {
  await getMailer().sendMail({
    ...getDefaultSenderAndFrom(),
    to: email,
    subject: `Confirm Login for Qwik Multi-Tenancy 🔐`,
    text: `Hello ${name} 👋

here is your login confirmation link for Qwik Multi-Tenancy:

${loginConfirmationLinkUrl}


Have fun with multi-tenancy!

All the best ☀️
Peter`,
  });
}

export async function sendSignUpConfirmationLinkMail(
  loginConfirmationLinkUrl: string,
  { email, name }: MailRecipient
) {
  await getMailer().sendMail({
    ...getDefaultSenderAndFrom(),
    to: email,
    subject: `Confirm Sign Up for Qwik Multi-Tenancy ✍️`,
    text: `Hello ${name} 👋

here is your sign up confirmation link for Qwik Multi-Tenancy:

${loginConfirmationLinkUrl}


Have fun with multi-tenancy!

All the best ☀️
Peter`,
  });
}
