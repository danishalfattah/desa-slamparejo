import { Playfair_Display, Poppins } from "next/font/google";
import { UsahaDesaPageData } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function DescUsaha({ data }: { data: UsahaDesaPageData }) {
  return (
    <section className="px-4 py-6 sm:py-10 pb-2 bg-[#F9FCFC]">
      <div className="p-[8px] sm:p-[12px] max-w-screen-xl mx-auto">
        <div className="border-b border-black pb-2 sm:pb-4 w-fit">
          <h1
            className={`${playfair.className} font-normal text-2xl sm:text-4xl md:text-5xl`}
          >
            UMKM Desa Slamparejo
          </h1>
        </div>
        <p
          className={`${poppins.className} text-sm sm:text-base md:text-lg text-gray-800 mt-3 sm:mt-4 leading-relaxed max-w-5xl`}
        >
          {data.description}
        </p>
      </div>
    </section>
  );
}
