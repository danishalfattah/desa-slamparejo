// src/app/perangkat-desa/page.tsx

import HeroPerangkat from "@/features/perangkat-desa/hero";
import DescPerangkat from "@/features/perangkat-desa/desc";
import DaftarPerangkat from "@/features/perangkat-desa/perangkat";
import { PerangkatDesa, PerangkatDesaPageData } from "@/lib/types";
import type { Metadata } from "next";

async function getPerangkatDesaData(): Promise<{
  perangkatList: PerangkatDesa[];
  pageData: PerangkatDesaPageData;
} | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/perangkat-desa`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data perangkat desa:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPerangkatDesaData();
  const description =
    data?.pageData.description ||
    "Kenali lebih dekat jajaran perangkat desa yang bertugas melayani masyarakat Desa Slamparejo.";

  return {
    title: "Perangkat Desa",
    description: description,
    openGraph: {
      title: "Struktur Pemerintahan dan Perangkat Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Struktur Pemerintahan dan Perangkat Desa Slamparejo",
      description: description,
    },
  };
}

export default async function PerangkatDesaPage() {
  const data = await getPerangkatDesaData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gagal memuat data.
      </div>
    );
  }

  return (
    <>
      <HeroPerangkat data={data.pageData.hero} />
      <DescPerangkat data={data.pageData} />
      <DaftarPerangkat dataPerangkat={data.perangkatList} />
    </>
  );
}
