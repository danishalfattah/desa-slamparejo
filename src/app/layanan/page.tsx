import { Layanan } from "@/lib/types";
import type { Metadata } from "next";
import LayananPageClient from "./page-client";
import PageHero from "@/components/page-hero";

async function getLayananData(): Promise<Layanan | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/layanan`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Gagal mengambil data layanan");
    }
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data layanan:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLayananData();
  const description =
    data?.hero?.subtitle ||
    "Akses berbagai layanan administrasi Desa Slamparejo secara online melalui formulir resmi yang tersedia.";
  return {
    title: "Layanan Desa",
    description: description,
    openGraph: {
      title: "Layanan Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Layanan Desa Slamparejo",
      description: description,
    },
  };
}

export default async function LayananPage() {
  const data = await getLayananData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gagal memuat data layanan.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Komponen PageHero hanya akan menampilkan gambar utama */}
      <PageHero
        heroData={{
          title: "Layanan",
          subtitle: data.hero?.subtitle,
          heroImage: data.hero?.heroImage,
        }}
      />

      {/* Komponen Client akan menangani tata letak uniknya sendiri */}
      <LayananPageClient data={data} />
    </main>
  );
}
