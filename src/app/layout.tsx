import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/navbar";

import Footer from "@/features/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://desa-slamparejo.vercel.app"),
  title: "Desa Slamparejo",
  description:
    "Website resmi Desa Slamparejo Kecamatan Jabung, Malang. Akses layanan online, informasi perangkat desa, produk hukum, UMKM, dan pembangunan desa secara transparan dan mudah.",
  keywords:
    "Desa Slamparejo, Jabung, Malang, layanan desa, produk hukum, UMKM, perangkat desa, pembangunan desa, survei kepuasan masyarakat, formulir online",
  authors: [{ name: "MMD 32 FILKOM UB 2025" }],
  openGraph: {
    title: "Desa Slamparejo - Layanan & Informasi Resmi",
    description:
      "Akses layanan, informasi, dan produk hukum Desa Slamparejo secara online. Transparan, cepat, dan terpercaya.",
    url: "https://desa-slamparejo.vercel.app",
    siteName: "Desa Slamparejo",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Logo Desa Slamparejo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Slamparejo - Layanan & Informasi Resmi",
    description:
      "Akses layanan, informasi, dan produk hukum Desa Slamparejo secara online. Transparan, cepat, dan terpercaya.",
    images: ["/icon.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
