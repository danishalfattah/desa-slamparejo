// src/app/kontak/page-client.tsx

"use client";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Phone, Mail, Instagram } from "lucide-react";
import { Card } from "@/features/kontak/components/card";
import { HourEntry } from "./components/hour-entry";
import { Kontak } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

interface KontakPageClientProps {
  data: Kontak;
}

export default function KontakPageClient({ data }: KontakPageClientProps) {
  // Membersihkan nomor telepon untuk link wa.me
  const cleanPhoneNumber = (phone: string = "") => {
    return phone.replace(/[()+\s-]/g, "");
  };

  // Memisahkan data jam operasional untuk layout 2 kolom
  const jamOperasionalBuka = (data.jamOperasional || []).filter(
    (item) => item.jam.toLowerCase() !== "tutup"
  );
  const jamOperasionalTutup = (data.jamOperasional || []).filter(
    (item) => item.jam.toLowerCase() === "tutup"
  );

  return (
    <>
      <div className="w-full bg-pattern px-5 py-10 relative flex justify-center">
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
              className={`${playfair.className} text-white text-2xl md:text-8xl font-normal tracking-[1.5px] mb-4`}
            >
              Kontak
              <br />
              Desa
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center ">
            <p
              className={`${poppins.className}  text-white text-sm md:text-lg font-normal tracking-wider`}
            >
              {data.description}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-[#F9FCFC] py-12 px-4 md:px-0">
        <div className="max-w-7xl md:mx-auto">
          <div className="flex flex-wrap md:flex-row flex-col md:justify-around items-center">
            <Card
              title="Email Resmi"
              description="Kirim email untuk pertanyaan atau permohonan resmi"
              contactInfo={data.email}
              link={`mailto:${data.email}`}
              buttonText="Kirim Email"
            >
              <Mail />
            </Card>
            <Card
              title="WhatsApp"
              description="Hubungi langsung untuk informasi terpercaya dengan cepat"
              contactInfo={data.phone}
              link={`https://wa.me/${cleanPhoneNumber(data.phone)}`}
              buttonText="Hubungi via WhatsApp"
            >
              <Phone />
            </Card>
            <Card
              title="Instagram"
              description="Ikuti Kegiatan dan Berita Terbaru dari Desa Slamparejo"
              contactInfo={data.instagram}
              link={data.instagramUrl}
              buttonText="Kunjungi Instagram"
            >
              <Instagram />
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 px-4">
        <div className="p-[8px] sm:p-[12px] max-w-screen-xl mx-auto">
          <div className="border-b border-black pb-2 sm:pb-4 w-fit">
            <h1
              className={`${playfair.className} font-normal text-2xl sm:text-4xl md:text-5xl`}
            >
              Jam Operasional
            </h1>
          </div>
          <p
            className={`${poppins.className} text-sm sm:text-base md:text-lg text-gray-800 mt-3 sm:mt-4 leading-relaxed max-w-5xl`}
          >
            Kantor Desa Slamparejo melayani masyarakat pada jam berikut
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {jamOperasionalBuka.map((item) => (
                  <HourEntry key={item.id} days={item.hari} hours={item.jam} />
                ))}
              </div>
              <div className="space-y-6">
                {jamOperasionalTutup.map((item) => (
                  <HourEntry key={item.id} days={item.hari} hours={item.jam} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-10 px-4">
        <div className="p-[8px] sm:p-[12px] max-w-screen-xl mx-auto">
          <div className="border-b border-black pb-2 sm:pb-4 w-fit">
            <h1
              className={`${playfair.className} font-normal text-2xl sm:text-4xl md:text-5xl`}
            >
              Lokasi Kantor Desa
            </h1>
          </div>
          <p
            className={`${poppins.className} text-sm sm:text-base md:text-lg text-gray-800 mt-3 sm:mt-4 leading-relaxed max-w-5xl whitespace-pre-line`}
          >
            {data.lokasi.address}
          </p>
        </div>
        <div className="px-4">
          <iframe
            className="w-full max-w-5xl h-80 md:h-[450px] mx-auto my-10 rounded-lg shadow-lg"
            src={data.lokasi.mapUrl}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </>
  );
}
