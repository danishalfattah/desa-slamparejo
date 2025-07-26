// src/features/perangkat-desa/hero.tsx

import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { PerangkatDesaPageData } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function HeroPerangkat({
  data,
}: {
  data: PerangkatDesaPageData["hero"];
}) {
  return (
    <section className="w-full h-screen flex flex-col ">
      <div className="w-full bg-pattern px-5 py-10 relative flex justify-center min-h-screen">
        <Image
          src={data.heroImage || "/landing-page.png"}
          alt="Desa Slamparejo"
          fill
          quality={100}
          className="z-0 object-cover "
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0  bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="relative flex flex-col items-center w-fit mx-auto mb-6">
            <h1
              className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}
            >
              PERANGKAT DESA
            </h1>
            <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
          </div>
          <p
            className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
          >
            {data.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
