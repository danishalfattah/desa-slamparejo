import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function DescUsaha() {
  return (
    <section className="px-5 py-10 bg-[#F9FCFC]">
      <div className="max-w-6xl mx-auto">
        <h2
          className={`${playfair.className} text-2xl md:text-4xl text-black border-b border-gray-400 inline-block pb-2`}
        >
          UMKM Desa Slamparejo
        </h2>
        <p
          className={`${poppins.className} text-base md:text-lg text-gray-800 mt-4 leading-relaxed max-w-3xl`}
        >
          Setiap jengkal tanah, setiap tarikan napas warga, adalah bagian dari cerita besar yang hidup.
          Inilah Slamparejo, desa yang tumbuh dalam makna.
        </p>
      </div>
    </section>
  );
}