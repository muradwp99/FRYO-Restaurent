"use server";

import { addMessage } from "@/server/messages";
import { sendMail, mailLayout, MAIL_TO } from "@/server/email";

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContactAction(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactResult> {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const subject = (input.subject ?? "").trim();
  const message = (input.message ?? "").trim();
  if (!name || !email || !message) return { ok: false, error: "Please fill in your name, email and message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };

  // Persist to the store…
  await addMessage({ name, email, subject, message });

  // …and notify the business inbox (reply-to the customer).
  const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await sendMail({
    to: MAIL_TO,
    replyTo: email,
    subject: `New contact form message${subject ? `: ${subject}` : ""}`,
    html: mailLayout("New contact message", `
      <p style="margin:0 0 8px;color:#cbd5e1"><strong style="color:#fff">${esc(name)}</strong> &lt;${esc(email)}&gt;</p>
      ${subject ? `<p style="margin:0 0 8px;color:#94a3b8">Subject: ${esc(subject)}</p>` : ""}
      <p style="margin:12px 0 0;color:#e8eaf0;line-height:1.6;white-space:pre-wrap">${esc(message)}</p>`),
  });

  return { ok: true };
}
