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

      <section className="bg-white py-10">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <div className="text-center md:text-left border-b border-black pb-4 w-full md:w-fit">
            <h1
              className={`${playfair.className} font-normal text-4xl md:text-5xl`}
            >
              Jam Operasional
            </h1>
          </div>
          <div className="my-4 md:my-6">
            <p className={`${poppins.className} text-center md:text-left`}>
              Kantor Desa Slamparejo melayani masyarakat pada jam berikut
            </p>
          </div>
          <div className="shadow-lg grid grid-cols-1 gap-y-6 max-w-4xl mx-auto rounded-xl p-6 md:p-10">
            {(data.jamOperasional || []).map((item) => (
              <HourEntry key={item.id} days={item.hari} hours={item.jam} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-10">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <div className="text-center md:text-left border-b border-black pb-4 w-full md:w-fit">
            <h1
              className={`${playfair.className} font-normal text-4xl md:text-5xl`}
            >
              Lokasi Kantor Desa
            </h1>
          </div>
          <div className="my-4 md:my-6">
            <p
              className={`${poppins.className} font-normal leading-relaxed text-lg md:text-xl tracking-wide whitespace-pre-line text-center md:text-left`}
            >
              {data.lokasi.address}
            </p>
          </div>
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
