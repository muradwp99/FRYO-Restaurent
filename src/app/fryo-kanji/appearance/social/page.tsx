import { getSocials } from "@/server/appearance";
import { SocialEditor } from "@/components/admin/appearance/SocialEditor";

export const dynamic = "force-dynamic";

export default async function SocialAppearancePage() {
  const socials = await getSocials();
  return <SocialEditor initial={socials} />;
}
