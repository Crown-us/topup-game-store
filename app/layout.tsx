import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TopupKD — Instant Game Top-Up & Voucher Store",
  description:
    "Next-gen gaming top-up store. Instant 1-5 second automated delivery for Mobile Legends, Free Fire, Valorant, Genshin Impact & more with zero admin fee QRIS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#FAFAFA] text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
