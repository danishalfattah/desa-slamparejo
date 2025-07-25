// src/app/profil/page.tsx

import React from "react";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Profil } from "@/lib/types";
import { Metadata } from "next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"],
});

async function getProfilData(): Promise<Profil | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profil-desa`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Gagal mengambil data profil, status:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data profil:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProfilData();
  const description =
    data?.hero.subtitle ||
    "Profil lengkap Desa Slamparejo, mencakup visi, misi, sejarah, dan data demografi desa.";

  return {
    title: "Profil Desa",
    description: description,
    openGraph: {
      title: "Profil Desa Slamparejo",
      description: description,
    },
    twitter: {
      title: "Profil Desa Slamparejo",
      description: description,
    },
  };
}

export default async function ProfilPage() {
  const data = await getProfilData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gagal memuat data. Silakan coba lagi nanti.
      </div>
    );
  }

  const sejarahImages = [
    { src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg", alt: "Mbah Gude" },
    {
      src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg",
      alt: "Wilayah Peteguhan",
    },
    { src: "/c20512021615f3918f726e5fb61f5c95c047e233.jpg", alt: "Dusun Busu" },
  ];

  return (
    <main className="m-0 p-0 h-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col">
        <div className="relative flex-1 flex flex-col justify-center items-center">
          <Image
            src={data.hero.heroImage || "/landing-page.png"}
            alt="Desa Slamparejo"
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
                className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}
              >
                PROFIL
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8 md:leading-10 max-w-2xl mb-10 w-full`}
            >
              {data.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative bg-[url('/Achievement.png')] text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto px-5 pt-[40px] md:pt-[60px]">
          <h1
            className={`${playfair.className} video-title text-white mb-4 md:mb-6 text-left`}
          >
            {data.video.title}
          </h1>
          <p
            className={`${poppins.className} font-normal leading-8 tracking-[1.5px] text-white text-[20px] mb-10 text-left max-w-3xl`}
          >
            {data.video.description}
          </p>
        </div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto p-5 clear-both">
          <iframe
            className="w-full h-[calc(100vw*0.6)] max-h-[696px] border-none block mx-auto mb-[40px]"
            src={data.video.url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Visi Misi Section */}
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
              {data.visiMisi.description}
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
                {data.visiMisi.visi}
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
                {data.visiMisi.misi.split("\n").map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Demografi Section */}
      <section className="relative min-h-screen bg-cover bg-center py-10 px-5 pb-12 bg-[url('/c20512021615f3918f726e5fb61f5c95c047e233.jpg')]">
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 text-white p-4 md:p-6 mb-10">
          <div className="space-y-6 w-full order-last md:order-first">
            <div className="rounded-md overflow-hidden shadow-lg w-full">
              <iframe
                className="w-full h-64 md:h-80"
                src={data.demografi.petaUrl}
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <table
                  className={`${poppins.className} w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2`}
                >
                  <thead>
                    <tr>
                      <th className="p-3 bg-[#094B72] text-white font-semibold rounded-lg">
                        No
                      </th>
                      <th className="p-3 bg-[#094B72] text-white font-semibold rounded-lg">
                        Wilayah
                      </th>
                      <th className="p-3 bg-[#094B72] text-white font-semibold rounded-lg">
                        RT
                      </th>
                      <th className="p-3 bg-[#094B72] text-white font-semibold rounded-lg">
                        RW
                      </th>
                      <th className="p-3 bg-[#094B72] text-white font-semibold rounded-lg">
                        Penduduk
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white font-semibold">
                    {(data.demografi.tabelData || []).map((row, index) => (
                      <tr key={row.id}>
                        <td className="p-3 bg-[#8FA7B5] rounded-lg font-normal">
                          {index + 1}
                        </td>
                        <td className="p-3 bg-[#8FA7B5] rounded-lg font-normal">
                          {row.wilayah}
                        </td>
                        <td className="p-3 bg-[#8FA7B5] rounded-lg font-normal">
                          {row.rt}
                        </td>
                        <td className="p-3 bg-[#8FA7B5] rounded-lg font-normal">
                          {row.rw}
                        </td>
                        <td className="p-3 bg-[#8FA7B5] rounded-lg font-normal">
                          {row.penduduk}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="p-3 bg-[#8FA7B5] rounded-lg">
                        Jumlah
                      </td>
                      <td className="p-3 bg-[#8FA7B5] rounded-lg">37 RT</td>
                      <td className="p-3 bg-[#8FA7B5] rounded-lg">5 RW</td>
                      <td className="p-3 bg-[#8FA7B5] rounded-lg">
                        5.797 JIWA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <h1
                className={`${playfair.className} text-white font-medium text-3xl md:text-4xl leading-tight tracking-wider mb-4`}
              >
                {data.demografi.title}
              </h1>
              <p
                className={`${poppins.className} text-gray-200 font-normal leading-8 tracking-[1.5px] text-justify`}
              >
                {data.demografi.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm font-semibold mt-8">
              <div className="bg-white text-black rounded-md p-3 md:p-4 shadow-lg col-span-2">
                <p className={`${poppins.className} text-xs mb-1`}>
                  Total Penduduk
                </p>
                <p
                  className={`${poppins.className} text-lg md:text-xl font-bold text-red-800`}
                >
                  {data.demografi.totalPenduduk}
                </p>
              </div>
              <div className="bg-blue-100 text-[#094B72] rounded-md p-3 md:p-4 shadow-lg">
                <p className={`${poppins.className} text-xs mb-1`}>
                  Laki - Laki
                </p>
                <p
                  className={`${poppins.className} text-lg md:text-xl font-bold`}
                >
                  {data.demografi.lakiLaki}
                </p>
              </div>
              <div className="bg-red-100 text-[#094B72] rounded-md p-3 md:p-4 shadow-lg">
                <p className={`${poppins.className} text-xs mb-1`}>Perempuan</p>
                <p
                  className={`${poppins.className} text-lg md:text-xl font-bold`}
                >
                  {data.demografi.perempuan}
                </p>
              </div>
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
                  {data.sejarah.title}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <div className="w-full md:w-1/2 flex flex-col flex-grow gap-6">
                {sejarahImages.map((img, idx) => (
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
                      className="rounded-lg shadow-lg object-cover "
                    />
                  </div>
                ))}
              </div>
              <div className="w-full md:w-1/2">
                <p
                  className={`${poppins.className} text-justify font-light text-[20px] leading-[40px] tracking-[1.5px] whitespace-pre-line`}
                >
                  {data.sejarah.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
