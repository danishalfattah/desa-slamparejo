import { Berita, BeritaPageData } from "@/lib/types";
import HeroBerita from "@/features/berita/hero";
import DaftarBerita from "@/features/berita/berita";
import DescBerita from "@/features/berita/desc";
import { Metadata } from "next";

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

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageData();
  const description =
    data?.pageData.hero.subtitle ||
    "Kumpulan berita dan informasi terbaru seputar kegiatan dan perkembangan di Desa Slamparejo.";

  return {
    title: "Berita Desa",
    description: description,
    openGraph: {
      title: "Berita Terbaru Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Berita Terbaru Desa Slamparejo",
      description: description,
    },
  };
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
