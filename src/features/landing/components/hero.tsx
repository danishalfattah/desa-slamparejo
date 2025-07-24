import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";
import { Beranda } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function Hero({ data }: { data: Beranda }) {
  return (
    <section className="w-full flex flex-col ">
      <div className="relative flex flex-col justify-center items-center h-screen">
        <Image
          src={data.hero.heroImage || "/landing-page.png"} // Menggunakan gambar dinamis
          alt="Desa Slamparejo"
          fill
          quality={100}
          className="z-0 object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
          <h1
            className={`${playfair.className} text-white text-4xl md:text-6xl mb-6 tracking-[9px]`}
          >
            {data.hero.title}
          </h1>
          <p
            className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8 md:leading-10 max-w-2xl mb-10 w-full`}
          >
            {data.hero.subtitle}
          </p>
        </div>
      </div>
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
          <div className="md:w-1/2  flex items-center z-20 ">
            <h2
              className={`${playfair.className} text-white text-2xl md:text-4xl font-normal tracking-[1.5px] mb-4`}
            >
              {data.slogan.title}
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center z-20 ">
            <p
              className={`${poppins.className}  text-white text-sm md:text-lg font-normal tracking-wider`}
            >
              {data.slogan.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
