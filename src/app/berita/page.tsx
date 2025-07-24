// src/app/berita/page.tsx

import { Berita, BeritaPageData } from "@/lib/types";
import HeroBerita from "@/features/berita/hero";
import DaftarBerita from "@/features/berita/berita";
import DescBerita from "@/features/berita/desc";

async function getPageData(): Promise<{
  beritaList: Berita[];
  pageData: BeritaPageData;
} | null> {
  try {
    const [beritaRes, pageRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/berita`, { cache: "no-store" }),
      fetch(`${process.env.NEXTAUTH_URL}/api/berita-page`, {
        cache: "no-store",
      }),
    ]);
    if (!beritaRes.ok || !pageRes.ok) return null;

    const beritaList = await beritaRes.json();
    const pageData = await pageRes.json();

    return { beritaList, pageData };
  } catch (error) {
    console.error("Gagal mengambil data berita:", error);
    return null;
  }
}

export default async function BeritaPage() {
  const data = await getPageData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gagal memuat data.
      </div>
    );
  }

  return (
    <>
      <HeroBerita data={data.pageData.hero} />
      <DescBerita />
      <DaftarBerita dataBerita={data.beritaList} />
    </>
  );
}
