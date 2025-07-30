import { Berita, BeritaPageData } from "@/lib/types";
import DaftarBerita from "@/features/berita/berita";
import { Metadata } from "next";
import PageHero from "@/components/page-hero";

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
      <PageHero
        heroData={{
          title: data.pageData.hero.title,
          subtitle: data.pageData.hero.subtitle,
          heroImage: data.pageData.hero.heroImage,
        }}
        descData={{
          title: "Berita Desa",
          description:
            "Berikut adalah kumpulan berita dan informasi terbaru dari Desa Slamparejo.",
        }}
      />
      <DaftarBerita dataBerita={data.beritaList} />
    </>
  );
}
