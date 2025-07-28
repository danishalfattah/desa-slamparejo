// src/app/produk-hukum-dan-fisik/page.tsx

// Menghapus "use client" agar menjadi Server Component
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import type { Metadata } from "next";
import ProdukPageClient from "./page-client"; // Komponen baru untuk bagian client

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

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

// Metadata sekarang bisa dinamis karena ini adalah Server Component
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
      <section className="w-full h-screen flex flex-col ">
        <div className="relative w-full h-screen flex flex-col justify-center items-center">
          <Image
            src={pageData.hero?.heroImage || "/landing-page.png"}
            alt="Desa Slamparejo"
            fill
            quality={100}
            className="z-0 object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative flex flex-col items-center w-fit mx-auto mb-6">
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}
              >
                PRODUK HUKUM & FISIK
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              {pageData.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section
        className="w-full px-5 py-10 relative flex justify-center"
        style={{
          backgroundColor: "#0B4973",
          backgroundImage: "url('/Patterns.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl  flex flex-col md:flex-row gap-0  ">
          <div className="md:w-1/2  flex items-center z-50 ">
            <h2
              className={`${playfair.className} text-white text-2xl md:text-4xl font-normal tracking-[1.5px] mb-4`}
            >
              Produk Desa Slamparejo
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center ">
            <p
              className={`${poppins.className}  text-white text-base md:text-lg font-normal tracking-wider`}
            >
              {pageData.description}
            </p>
          </div>
        </div>
      </section>

      <ProdukPageClient
        produkHukumData={produkHukumData}
        pembangunanData={pembangunanData}
        kategoriData={kategoriData}
      />
    </main>
  );
}
