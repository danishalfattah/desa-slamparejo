import type { Metadata } from "next";
import ProdukPageClient from "./page-client";
import PageHero from "@/components/page-hero"; // Impor komponen baru

async function getProdukData() {
  try {
    const [hukumRes, pembangunanRes, pageRes, kategoriRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/produk-hukum`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/pembangunan`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/produk-page`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/produk-hukum-kategori`, {
        cache: "no-store",
      }),
    ]);

    if (!hukumRes.ok || !pembangunanRes.ok || !pageRes.ok || !kategoriRes.ok) {
      throw new Error("Gagal mengambil data produk");
    }

    const hukumJson = await hukumRes.json();
    const pembangunanJson = await pembangunanRes.json();
    const pageJson = await pageRes.json();
    const kategoriJson = await kategoriRes.json();

    return {
      produkHukumData: hukumJson,
      pembangunanData: pembangunanJson,
      pageData: pageJson,
      kategoriData: kategoriJson,
    };
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return {
      produkHukumData: [],
      pembangunanData: [],
      pageData: {},
      kategoriData: [],
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProdukData();
  const description =
    data.pageData?.hero?.subtitle ||
    "Akses dokumen resmi seperti Perdes dan pantau seluruh proses pembangunan Desa Slamparejo secara transparan dan terbuka.";
  return {
    title: "Produk Hukum & Pembangunan",
    description: description,
    openGraph: {
      title: "Produk Hukum & Pembangunan Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Produk Hukum & Pembangunan Desa Slamparejo",
      description: description,
    },
  };
}

export default async function ProdukPage() {
  const { produkHukumData, pembangunanData, pageData, kategoriData } =
    await getProdukData();

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        heroData={{
          title: "Produk Hukum & Fisik",
          subtitle: pageData.hero?.subtitle,
          heroImage: pageData.hero?.heroImage,
        }}
        descData={{
          title: "Produk Desa Slamparejo",
          description: pageData.description,
        }}
      />

      <ProdukPageClient
        produkHukumData={produkHukumData}
        pembangunanData={pembangunanData}
        kategoriData={kategoriData}
      />
    </main>
  );
}
