import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { getGlobalSeo } from "@/server/seo";
import { getTracking } from "@/server/tracking";
import { TrackingScripts } from "@/components/TrackingScripts";
import { CustomCodeInjector } from "@/components/CustomCodeInjector";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  let base: URL;
  try {
    base = new URL(seo.siteUrl);
  } catch {
    base = new URL("https://fryo.example");
  }
  return {
    metadataBase: base,
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.defaultDescription,
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: [seo.ogImage],
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tracking = await getTracking();
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Shell>{children}</Shell>
        <TrackingScripts tracking={tracking} />
        <CustomCodeInjector />
      </body>
    </html>
  );
}
