// src/app/berita/[id]/page.tsx

import { Berita } from "@/lib/types";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import type { Metadata } from "next";

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

// Definisikan tipe untuk props, ini akan digunakan oleh generateMetadata dan halaman
type Props = {
  params: { id: string };
};

// 1. Export untuk generateMetadata
// Menerima props secara langsung, tidak sebagai promise
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const berita = await getBeritaDetail(id);

  if (!berita) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  const description = berita.content.substring(0, 160) + "...";

  return {
    title: `${berita.title} | Desa Slamparejo`,
    description: description,
    openGraph: {
      title: berita.title,
      description: description,
      images: [
        { url: berita.imageUrl, width: 1200, height: 630, alt: berita.title },
      ],
      locale: "id_ID",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: berita.title,
      description: description,
      images: [berita.imageUrl],
    },
  };
}

// 2. Export untuk komponen halaman
// Menggunakan tipe Promise seperti yang Anda minta
type BeritaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BeritaDetailPage({
  params,
}: BeritaDetailPageProps) {
  const { id } = await params;
  const berita = await getBeritaDetail(id);

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
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
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
