import { Berita } from "@/lib/types";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import type { Metadata } from "next"; // Impor tipe Metadata

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

// Fungsi untuk mengambil data detail berita dari API
async function getBeritaDetail(id: string): Promise<Berita | null> {
  try {
    // Menggunakan variabel environment untuk URL API
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/berita?id=${id}`, {
      cache: "no-store", // Tidak menggunakan cache agar data selalu baru
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil detail berita:", error);
    return null;
  }
}

// --- Implementasi SEO Dinamis ---

type Props = {
  params: { id: string };
};

/**
 * Fungsi ini diekspor untuk menghasilkan metadata dinamis untuk halaman ini.
 * Next.js akan secara otomatis memanggil fungsi ini saat membangun atau merender halaman.
 * @param {Props} { params } - Menerima parameter dari URL, dalam hal ini `id` berita.
 * @returns {Promise<Metadata>} - Mengembalikan objek Metadata yang akan digunakan di <head> HTML.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const berita = await getBeritaDetail(id);

  // Jika berita tidak ditemukan, kembalikan metadata default
  if (!berita) {
    return {
      title: "Berita Tidak Ditemukan",
      description:
        "Berita yang Anda cari tidak dapat ditemukan di website Desa Slamparejo.",
    };
  }

  // Buat deskripsi singkat dari konten berita (maksimal 160 karakter)
  const description = berita.content.substring(0, 160) + "...";

  // Kembalikan objek Metadata yang dinamis berdasarkan data berita
  return {
    title: `${berita.title} | Desa Slamparejo`,
    description: description,
    openGraph: {
      title: berita.title,
      description: description,
      images: [
        {
          url: berita.imageUrl, // URL gambar utama berita
          width: 1200,
          height: 630,
          alt: berita.title,
        },
      ],
      locale: "id_ID",
      type: "article", // Tipe konten adalah artikel
    },
    twitter: {
      card: "summary_large_image",
      title: berita.title,
      description: description,
      images: [berita.imageUrl], // URL gambar untuk Twitter Card
    },
  };
}

// --- Komponen Halaman ---

/**
 * Komponen React Server untuk menampilkan halaman detail berita.
 * @param {Props} { params } - Menerima parameter `id` dari URL.
 */
export default async function BeritaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const berita = await getBeritaDetail(id);

  // Tampilan jika berita tidak ditemukan
  if (!berita) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gagal memuat berita atau berita tidak ditemukan.
      </div>
    );
  }

  // Render halaman dengan data berita
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
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
