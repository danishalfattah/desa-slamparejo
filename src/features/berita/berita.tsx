"use client";

import { useState } from "react";
import Card from "./card";
import { Berita } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ITEMS_PER_PAGE = 9; // 1 Utama + 8 Lainnya

export default function DaftarBerita({ dataBerita }: { dataBerita: Berita[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pisahkan berita utama dari daftar
  const headline = dataBerita.find((b) => b.isHeadline);
  const otherNews = dataBerita.filter((b) => !b.isHeadline);

  // Jika tidak ada headline, gunakan berita terbaru sebagai fallback
  const mainNewsSource = headline
    ? [headline, ...otherNews.filter((b) => b.id !== headline.id)]
    : dataBerita;

  if (!mainNewsSource || mainNewsSource.length === 0) {
    return (
      <div className="text-center py-10 bg-[#f4f8fc]">
        Belum ada data berita yang tersedia.
      </div>
    );
  }

  const totalPages = Math.ceil(mainNewsSource.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBerita = mainNewsSource.slice(startIndex, endIndex);

  const beritaUtama = currentBerita[0];
  const beritaLainnya = currentBerita.slice(1);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="bg-[#f4f8fc] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Berita Utama */}
        {beritaUtama && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[400px]">
              <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                <Image
                  src={beritaUtama.imageUrl}
                  alt={beritaUtama.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6 md:w-1/2 flex flex-col justify-start">
                <h3
                  className={`${poppins.className} text-2xl font-semibold mb-2 line-clamp-3`}
                >
                  {beritaUtama.title}
                </h3>
                <p className={`${poppins.className} text-gray-500 mb-4`}>
                  {new Date(beritaUtama.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p
                  className={`${poppins.className} text-gray-600 line-clamp-6 flex-grow`}
                >
                  {beritaUtama.content}
                </p>
                <div className="mt-4">
                  <Link href={`/berita/${beritaUtama.id}`}>
                    <button className="bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition">
                      Baca Selengkapnya
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Berita Lainnya */}
        {beritaLainnya.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {beritaLainnya.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                imageUrl={item.imageUrl}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === page ? "bg-[#0B4973] text-white" : "bg-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
