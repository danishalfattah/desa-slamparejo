// src/features/berita/desc.tsx

import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function DescBerita() {
  return (
    <div className="w-full bg-pattern px-5 py-10 relative flex justify-center  ">
      <Image
        src="/Patterns.png"
        alt="pattern"
        fill
        quality={80}
        className="z-0 object-cover"
        priority
      />
      <div className="max-w-6xl  flex flex-col md:flex-row gap-0  ">
        <div className="md:w-1/2  flex items-center z-50 ">
          <h2
            className={`${playfair.className} text-white text-2xl md:text-4xl font-normal tracking-[1.5px] mb-4`}
          >
            Berita Desa
          </h2>
        </div>
        <div className="md:w-1/2 flex items-center ">
          <p
            className={`${poppins.className} text-white text-sm md:text-lg font-normal tracking-wider whitespace-pre-line`}
          >
            Berikut adalah kumpulan berita dan informasi terbaru dari Desa
            Slamparejo.
          </p>
        </div>
      </div>
    </div>
  );
}
