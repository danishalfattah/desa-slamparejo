import DaftarUsaha from "@/features/usaha-desa/usaha";
import { Usaha, UsahaDesaPageData } from "@/lib/types";
import type { Metadata } from "next";
import PageHero from "@/components/page-hero"; // Impor komponen baru

async function getUsahaDesaData(): Promise<{
  usahaList: Usaha[];
  pageData: UsahaDesaPageData;
} | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/usaha-desa`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data usaha desa:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getUsahaDesaData();
  const description =
    data?.pageData.description ||
    "Temukan berbagai produk dan jasa unggulan dari UMKM Desa Slamparejo yang kreatif dan inovatif.";

  return {
    title: "Usaha Desa",
    description: description,
    openGraph: {
      title: "UMKM dan Usaha Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "UMKM dan Usaha Desa Slamparejo",
      description: description,
    },
  };
}

export default async function UsahaDesaPage() {
  const data = await getUsahaDesaData();

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
          title: "Usaha Desa",
          subtitle: data.pageData.hero.subtitle,
          heroImage: data.pageData.hero.heroImage,
        }}
        descData={{
          title: "UMKM Desa Slamparejo",
          description: data.pageData.description,
        }}
      />
      <DaftarUsaha dataUsaha={data.usahaList} />
    </>
  );
}
