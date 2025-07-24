import Image from "next/image";
import { Beranda } from "@/lib/types";

export default function Launching({ data }: { data: Beranda["launching"] }) {
  return (
    <section className="w-full flex bg-[#F9FCFC] flex-col items-center justify-center p-4 md:py-12">
      <div className="relative w-full max-w-6xl aspect-video rounded-xl shadow-2xl overflow-hidden">
        <Image
          // UBAH BARIS INI
          src={data.image}
          // DARI SEBELUMNYA: src="/launching.png"

          // Sebaiknya alt text juga dibuat dinamis
          alt={data.title}
          fill
          quality={100}
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start px-2 py-4 md:px-8 md:py-8">
          <div className="w-full max-w-lg">
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-3 leading-tight break-words">
              {/* Logika untuk memisah baris judul */}
              {data.title.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={word.toLowerCase() === "slamparejo" ? "block" : ""}
                >
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="text-white text-sm md:text-lg font-normal leading-relaxed break-words">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
