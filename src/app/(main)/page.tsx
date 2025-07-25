// src/app/(main)/page.tsx

import Faq from "@/features/landing/components/faq";
import Hero from "@/features/landing/components/hero";
import Launching from "@/features/landing/components/launching";
import { Beranda } from "@/lib/types";
import type { Metadata } from "next";

async function getBerandaData(): Promise<Beranda | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/beranda`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Gagal mengambil data beranda");
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching beranda data:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBerandaData();
  const description =
    data?.hero.subtitle ||
    "Website resmi Desa Slamparejo, Kecamatan Jabung, Kabupaten Malang.";

  return {
    title: "Beranda", // Judul ini akan digabungkan dengan template di layout.tsx
    description: description,
    openGraph: {
      title: "Beranda | Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Beranda | Desa Slamparejo",
      description: description,
    },
  };
}

export default async function BerandaPage() {
  const data = await getBerandaData();

  if (!data) {
    return <div>Gagal memuat konten halaman. Silakan coba lagi nanti.</div>;
  }

  return (
    <>
      <Hero data={data} />
      <Launching data={data.launching} />
      <Faq data={data.faq} />
    </>
  );
}
