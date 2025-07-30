import { Kontak } from "@/lib/types";
import type { Metadata } from "next";
import KontakPageClient from "./page-client";
import PageHero from "@/components/page-hero"; // Impor komponen baru

async function getKontakData(): Promise<Kontak | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/kontak`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Gagal mengambil data kontak");
    }
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data kontak:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getKontakData();
  const description =
    data?.hero?.subtitle ||
    "Hubungi Pemerintah Desa Slamparejo melalui email, WhatsApp, atau kunjungi kantor kami.";
  return {
    title: "Kontak Kami",
    description: description,
    openGraph: {
      title: "Kontak Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Kontak Desa Slamparejo",
      description: description,
    },
  };
}

export default async function KontakPage() {
  const data = await getKontakData();

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Gagal memuat data kontak.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        heroData={{
          title: "Kontak",
          subtitle: data.hero?.subtitle,
          heroImage: data.hero?.heroImage,
        }}
        descData={{
          title: "Kontak Desa",
          description: data.description,
        }}
      />
      <KontakPageClient data={data} />
    </main>
  );
}
