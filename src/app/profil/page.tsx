import React from "react";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"],
});

// Fungsi untuk mengambil data dari sisi server
async function getProfilData() {
  // Di dunia nyata, URL ini harus menjadi URL absolut jika di-fetch di Server Component
  // Untuk Vercel/localhost, ini seharusnya berfungsi
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profil-desa`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Gagal mengambil data profil");
    return null;
  }
  return res.json();
}

export default async function HomePage() {
  const data = await getProfilData();

  if (!data) {
    return <div>Gagal memuat data. Silakan coba lagi nanti.</div>;
  }

  return (
    <main className="m-0 p-0 h-full overflow-x-hidden">
      <section className="w-full h-screen flex flex-col ">
        <div className="relative flex-1 flex flex-col justify-center items-center ">
          <Image
            src="/landing-page.png"
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
                PROFIL
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              Desa Slamparejo tumbuh dari sejarah, arah, dan tekad kuat untuk
              terus melayani masyarakat secara tulus dan berkelanjutan.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[url('/Achievement.png')] text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto px-5 pt-[40px] md:pt-[60px]">
          <h1
            className={`${playfair.className} video-title text-white mb-4 md:mb-6 text-left`}
          >
            Video Profil
          </h1>
          <p
            className={`${poppins.className} font-normal leading-8 tracking-[1.5px] text-white text-[20px] mb-10 text-left max-w-3xl`}
          >
            Setiap jengkal tanah, setiap tarikan napas warga, adalah bagian dari
            cerita besar yang hidup. Inilah Slamparejo, desa yang tumbuh dalam
            makna.
          </p>
        </div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto p-5 clear-both">
          <iframe
            className="w-full h-[calc(100vw*0.6)] max-h-[696px] border-none block mx-auto mb-[40px]"
            src={data.videoUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className="relative bg-[#F1F2F9] min-h-screen py-10 px-5">
        <div className="w-full max-w-[1166px] mx-auto">
          <div className="text-left">
            <div className="border-b border-black w-fit pb-3">
              <h1
                className={`${playfair.className} video-title text-black text-left`}
              >
                Visi Misi
              </h1>
            </div>
            <p
              className={`${poppins.className} font-light text-black md:text-lg leading-relaxed tracking-[0.5px] mt-5 mb-16 max-w-4xl`}
            >
              Visi misi ini mencerminkan semangat membangun desa yang mandiri,
              sejahtera, dan tetap menjunjung nilai budaya lokal.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-10 justify-center">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md flex-1 max-w-md">
              <h2
                className={`${playfair.className} text-2xl text-black md:text-3xl font-medium mb-6 text-center`}
              >
                VISI
              </h2>
              <p
                className={`${poppins.className} text-sm md:text-base leading-relaxed text-justify`}
              >
                {data.visi}
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md flex-1 max-w-md">
              <h2
                className={`${playfair.className} text-2xl text-black md:text-3xl font-medium mb-6 text-center`}
              >
                MISI
              </h2>
              <ol
                className={`${poppins.className} text-sm md:text-base leading-relaxed space-y-3 list-decimal pl-5`}
              >
                {data.misi.split("\n").map((item: string, index: number) => (
                  <li key={index}>{item.replace(/^\d+\.\s*/, "")}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="relative bg-[#F1F2F9] min-h-screen py-10 px-5">
        <div className="w-full max-w-[1166px] mx-auto">
          <div className="text-left">
            <div className="mb-8 text-left">
              <div className="border-b border-black pb-2 md:pb-4 w-fit">
                <h1
                  className={`${playfair.className} text-black text-3xl md:text-4xl`}
                >
                  Sejarah Desa Slamparejo
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <div className="w-full md:w-1/2 flex flex-col flex-grow gap-6">
                {[
                  {
                    src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg",
                    alt: "Mbah Gude",
                  },
                  {
                    src: "/c20512021615f3918f726e5fb61f5c95c047e233.jpg",
                    alt: "Dusun Busu",
                  },
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full flex-1 min-h-[150px]"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-lg shadow-lg object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full md:w-1/2">
                <p
                  className={`${poppins.className} text-justify font-light text-[20px] leading-[40px] tracking-[1.5px]`}
                >
                  {data.sejarah
                    .split("<br /><br />")
                    .map((paragraph: string, index: number) => (
                      <span key={index}>
                        {paragraph}
                        <br />
                        <br />
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
