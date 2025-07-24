// src/features/berita/card.tsx

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface CardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: number;
}

export default function Card({
  id,
  title,
  content,
  imageUrl,
  createdAt,
}: CardProps) {
  return (
    <div
      className={`${poppins.className} bg-white rounded-xl shadow-md overflow-hidden w-full max-w-xs flex flex-col transition-transform mb-6 h-full`}
    >
      <div className="relative w-full h-40">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold mb-2 line-clamp-2 ">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">
          {new Date(createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-600 mb-4 h-16 line-clamp-4 flex-grow ">
          {content}
        </p>
        <div className="mt-auto">
          <Link href={`/berita/${id}`}>
            <button className="bg-[#0B4973] text-white rounded px-4 py-2 text-sm font-semibold hover:bg-[#09395a] transition w-full">
              Baca Selengkapnya
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
