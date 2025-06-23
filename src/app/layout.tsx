import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "MysteryScoop | Every Box, A New Adventure ✨",
    template: "%s | MysteryScoop",
  },
  description:
    "India's most magical mystery box store. Unbox curated surprises — kawaii, anime, stationery, plushies & more. Every order is a new adventure!",
  keywords: [
    "mystery box india",
    "kawaii mystery box",
    "anime mystery box",
    "surprise box",
    "mystery scoop",
    "gift box india",
    "stationery box",
  ],
  authors: [{ name: "MysteryScoop" }],
  creator: "MysteryScoop",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mysteryscoop.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "MysteryScoop",
    title: "MysteryScoop | Every Box, A New Adventure ✨",
    description: "India's most magical mystery box store. Unbox curated surprises every time!",
  },
  twitter: {
    card: "summary_large_image",
    title: "MysteryScoop | Every Box, A New Adventure ✨",
    description: "India's most magical mystery box store.",
    creator: "@mysteryscoop",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0d0118" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(26, 5, 51, 0.95)",
                border: "1px solid rgba(176, 108, 240, 0.3)",
                color: "#f0e6ff",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
