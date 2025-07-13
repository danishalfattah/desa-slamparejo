import Image from "next/image";
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

export default function HeroUsaha() {
  return (
    <section className="w-full h-screen flex flex-col ">
      <div className="w-full bg-pattern px-5 py-10 relative flex justify-center min-h-screen">
        <Image
          src="/landing-page.png"
          alt="Desa Slamparejo"
          fill
          quality={100}
          className="z-0 object-cover "
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0  bg-black/40 z-10 " />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1
            className={`${playfair.className} text-white text-4xl md:text-6xl mb-6 tracking-[9px]`}
          >
            USAHA DESA
          </h1>
          <div className="w-120 border-b-1 border-white rounded-b-lg mb-6" />
          <p
            className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
          >
            Layanan Desa Slamparejo dirancang untuk 
            memberikan kemudahan, kenyamanan, dan 
            kejelasan dalam setiap proses pelayanan.
          </p>
        </div>
      </div>
    </section>
  );
}