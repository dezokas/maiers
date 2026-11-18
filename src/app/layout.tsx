import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myersfootwear.com"),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "sepatu",
    "sneakers indonesia",
    "sepatu kulit",
    "sepatu lari",
    "sepatu kerja",
    "myers",
    "myers footwear",
    "sepatu kasual",
    "sepatu ergonomis",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://myersfootwear.com",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-shoe.jpg",
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} Aero Pulse Collection`,
      },
    ],
  },
  icons: {
    icon: "/images/logo-icon.svg",
    shortcut: "/images/logo-icon.svg",
    apple: "/images/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FAFAFA] text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}
