// src/app/kontak/page.tsx

import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Kontak } from "@/lib/types";
import type { Metadata } from "next";
import KontakPageClient from "./page-client"; // Komponen baru untuk bagian client

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

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
            <div className="border-b">
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl mb-6 tracking-[9px]`}
              >
                KONTAK
              </h1>
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              {data.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      <KontakPageClient data={data} />
    </main>
  );
}
