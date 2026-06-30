import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Stack Your Scoops | Curated with Love, Stacked with Happiness ✨",
    template: "%s | Stack Your Scoops",
  },
  description:
    "India's most magical e-commerce store. Unbox curated scoops of surprises — kawaii, stationery, beauty, plushies & more. Every scoop is curate with love!",
  keywords: [
    "stack your scoops",
    "mystery box india",
    "kawaii mystery box",
    "surprise box",
    "mystery scoop",
    "gift box india",
    "stationery box",
  ],
  authors: [{ name: "Stack Your Scoops" }],
  creator: "Stack Your Scoops",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://stackyourscoops.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Stack Your Scoops",
    title: "Stack Your Scoops | Curated with Love, Stacked with Happiness ✨",
    description: "India's most magical mystery e-commerce store. Curated scoops of surprises!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Your Scoops | Curated with Love, Stacked with Happiness ✨",
    description: "India's most magical mystery e-commerce store.",
    creator: "@stackyourscoops",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5e6d3" />
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
                background: "rgba(252, 250, 247, 0.95)",
                border: "1px solid rgba(183, 196, 168, 0.4)",
                color: "#3c3530",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
