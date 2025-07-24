// src/app/berita/[id]/page.tsx

import { Berita } from "@/lib/types";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

async function getBeritaDetail(id: string): Promise<Berita | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/berita?id=${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil detail berita:", error);
    return null;
  }
}

export default async function BeritaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const berita = await getBeritaDetail(params.id);

  if (!berita) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gagal memuat berita atau berita tidak ditemukan.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className={`${playfair.className} text-4xl font-bold mb-4`}>
          {berita.title}
        </h1>
        <p className={`${poppins.className} text-gray-500 mb-6`}>
          {new Date(berita.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={berita.imageUrl}
            alt={berita.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div
          className={`${poppins.className} text-lg leading-relaxed text-gray-800 whitespace-pre-line`}
        >
          {berita.content}
        </div>
      </div>
    </main>
  );
}
