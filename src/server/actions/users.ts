"use server";

import { revalidatePath } from "next/cache";
import { saveUser, deleteUser, getOwner, type UserInput } from "@/server/users";
import { createInvite } from "@/server/invites";
import { sendMail, mailLayout, MAIL_TO } from "@/server/email";

function appUrl(): string {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Email the new staff member their set-password invite link. */
async function sendInviteEmails(name: string, email: string, role: string) {
  const invite = await createInvite({ email, name, role: role as UserInput["role"] });
  const link = `${appUrl()}/invite/${invite.token}`;
  const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // To the invitee — direct login link.
  await sendMail({
    to: email,
    subject: "You've been invited to the FRYO admin",
    html: mailLayout("Welcome to FRYO", `
      <p style="margin:0 0 12px;color:#cbd5e1">Hi ${esc(name) || "there"}, you've been added as <strong style="color:#f5c400">${esc(role)}</strong> on the FRYO dashboard.</p>
      <p style="margin:0 0 20px;color:#94a3b8">Set your password and sign in using the button below. This link expires in 7 days.</p>
      <a href="${link}" style="display:inline-block;background:#f5c400;color:#001a40;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px">Set password & sign in</a>
      <p style="margin:20px 0 0;color:#64748b;font-size:12px;word-break:break-all">Or paste this link: ${link}</p>`),
  });

  // To the super admin (owner + business inbox) — notification.
  const owner = await getOwner();
  const adminRecipients = [...new Set([MAIL_TO, owner?.email].filter(Boolean))].join(", ");
  if (adminRecipients) {
    await sendMail({
      to: adminRecipients,
      subject: `New team member invited: ${name || email}`,
      html: mailLayout("Team invite sent", `
        <p style="margin:0 0 8px;color:#cbd5e1"><strong style="color:#fff">${esc(name) || esc(email)}</strong> was invited as <strong style="color:#f5c400">${esc(role)}</strong>.</p>
        <p style="margin:0;color:#94a3b8">Email: ${esc(email)}</p>`),
    });
  }
}

export async function saveUserAction(input: UserInput) {
  const isNew = !input.id;
  // New staff are created "Invited" until they set a password via the email link.
  const toSave: UserInput = isNew ? { ...input, status: "Invited" } : input;
  const u = await saveUser(toSave);

  if (isNew) {
    try {
      await sendInviteEmails(u.name, u.email, u.role);
    } catch (err) {
      console.error("[users] invite email failed:", err);
    }
  }

  revalidatePath("/fryo-kanji/system/users");
  return { ok: true as const, id: u.id };
}

export async function deleteUserAction(id: string) {
  await deleteUser(id);
  revalidatePath("/fryo-kanji/system/users");
  return { ok: true as const };
}
