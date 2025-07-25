// src/app/layanan/page.tsx

import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Layanan } from "@/lib/types";
import type { Metadata } from "next";
import LayananPageClient from "./page-client";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

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
      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col ">
        <div className="relative flex-1 flex flex-col justify-center items-center ">
          <Image
            src={data.hero?.heroImage || "/landing-page.png"}
            alt="Desa Slamparejo"
            fill
            quality={100}
            className="z-0 object-cover "
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0  bg-black/40 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative flex flex-col items-center w-fit mx-auto mb-6">
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}
              >
                LAYANAN
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              {data.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Menggunakan Client Component untuk bagian interaktif dan sisanya */}
      <LayananPageClient data={data} />
    </main>
  );
}
