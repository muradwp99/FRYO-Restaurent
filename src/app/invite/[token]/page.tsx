import Link from "next/link";
import { getInvite } from "@/server/invites";
import { InviteForm } from "@/components/admin/InviteForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Accept Invite — FRYO" };

const ROLE_LABEL: Record<string, string> = { owner: "Owner", manager: "Manager", editor: "Editor", staff: "Staff" };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getInvite(token);

  return (
    <div className="auth-page min-h-screen bg-ink flex items-center justify-center p-6 text-cream">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/25">
            <span className="text-navy font-black text-xl tracking-tight">F</span>
          </div>
          <span className="font-black text-white text-2xl tracking-widest leading-none">FRYO</span>
        </div>

        <div className="bg-ink-2 rounded-2xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-7 sm:p-8">
          {invite ? (
            <>
              <h1 className="text-xl font-bold text-white tracking-tight text-center">Welcome aboard</h1>
              <p className="text-sm text-slate-400 mt-1.5 text-center tracking-wide">
                You&rsquo;ve been invited as{" "}
                <span className="text-gold font-semibold">{ROLE_LABEL[invite.role] ?? invite.role}</span>. Set a
                password to activate <span className="text-slate-200">{invite.email}</span>.
              </p>
              <InviteForm token={token} />
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-xl font-bold text-white tracking-tight">Invite not valid</h1>
              <p className="text-sm text-slate-400 mt-2 tracking-wide leading-relaxed">
                This invite link is invalid, already used, or has expired. Ask an admin to send a fresh invite.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors tracking-wide"
              >
                Go to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
