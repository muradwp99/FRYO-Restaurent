import "server-only";
import nodemailer from "nodemailer";

/**
 * Email via SMTP (nodemailer). Configured from env (SMTP_*). When SMTP isn't
 * configured the message is logged to the server console instead of sent, so
 * flows never break before real mail credentials are provided.
 */

export const MAIL_TO = process.env.MAIL_TO || "marketing.realistic3d@gmail.com";
const MAIL_FROM = process.env.MAIL_FROM || `FRYO <${MAIL_TO}>`;

let transporter: nodemailer.Transporter | null = null;
let resolved = false;

function getTransporter(): nodemailer.Transporter | null {
  if (resolved) return transporter;
  resolved = true;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const port = Number(SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export type MailInput = { to: string; subject: string; html: string; text?: string; replyTo?: string };
export type MailResult = { ok: true } | { ok: false; skipped: true } | { ok: false; error: string };

export async function sendMail(input: MailInput): Promise<MailResult> {
  const t = getTransporter();
  if (!t) {
    console.log(`[email:dev] (SMTP not configured) would send → ${input.to}\n  subject: ${input.subject}`);
    return { ok: false, skipped: true };
  }
  try {
    await t.sendMail({
      from: MAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? input.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      replyTo: input.replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

/** Minimal branded HTML wrapper (navy + gold) for transactional mail. */
export function mailLayout(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0a0f1e;font-family:Inter,Arial,sans-serif;color:#e8eaf0">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="text-align:center;margin-bottom:24px">
        <span style="display:inline-block;background:#f5c400;color:#001a40;font-weight:800;font-size:20px;letter-spacing:2px;padding:8px 14px;border-radius:10px">FRYO</span>
      </div>
      <div style="background:#111934;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px 24px">
        <h1 style="margin:0 0 12px;font-size:20px;color:#fff">${title}</h1>
        ${bodyHtml}
      </div>
      <p style="text-align:center;color:#64748b;font-size:12px;margin-top:20px">FRYO · Fresh · Fried · Fearless</p>
    </div></body></html>`;
}
