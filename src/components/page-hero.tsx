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

interface HeroProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
}

interface DescProps {
  title: string;
  description?: string;
}

// Ubah di sini: tambahkan tanda tanya (?) pada descData
interface PageHeroProps {
  heroData: HeroProps;
  descData?: DescProps;
}

export default function PageHero({ heroData, descData }: PageHeroProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col">
        <div className="relative flex-1 flex flex-col justify-center items-center">
          <Image
            src={heroData.heroImage || "/landing-page.png"}
            alt={heroData.title}
            fill
            quality={100}
            className="z-0 object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative flex flex-col items-center w-fit mx-auto mb-6">
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px] uppercase`}
              >
                {heroData.title}
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            {heroData.subtitle && (
              <p
                className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8 md:leading-10 max-w-2xl mb-10 w-full`}
              >
                {heroData.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Ubah di sini: Tambahkan kondisi untuk hanya merender jika descData ada */}
      {descData && (
        <section
          className="w-full px-5 py-10 relative flex justify-center"
          style={{
            backgroundColor: "#0B4973",
            backgroundImage: "url('/Patterns.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-6xl flex flex-col md:flex-row gap-0">
            <div className="md:w-1/2 flex items-center z-20">
              <h2
                className={`${playfair.className} text-white text-2xl md:text-4xl font-normal tracking-[1.5px] mb-4`}
              >
                {descData.title}
              </h2>
            </div>
            <div className="md:w-1/2 flex items-center z-20">
              <p
                className={`${poppins.className} text-white text-sm md:text-lg font-normal tracking-wider`}
              >
                {descData.description}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
