import { getCustomCode } from "@/server/customcode";

/** Injects admin-managed custom HTML site-wide (Marketing → Custom Code) when enabled. */
export async function CustomCodeInjector() {
  const c = await getCustomCode();
  if (!c.enabled) return null;
  return (
    <>
      {c.headHtml && <div data-custom-code="head" dangerouslySetInnerHTML={{ __html: c.headHtml }} />}
      {c.bodyHtml && <div data-custom-code="body" dangerouslySetInnerHTML={{ __html: c.bodyHtml }} />}
    </>
  );
}
