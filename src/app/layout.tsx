import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://fryo.example"),
  title: "FRYO — Burgers, Wraps & Pure Fire",
  description:
    "FRYO serves smash-style burgers and loaded wraps. Classic, Super Charger and BBQ — freshly fried, boldly sauced.",
  openGraph: {
    title: "FRYO — Burgers, Wraps & Pure Fire",
    description:
      "Smash-style burgers and loaded wraps. Classic, Super Charger and BBQ.",
    images: ["/og.webp"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
