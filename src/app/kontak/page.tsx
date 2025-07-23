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

async function getKontakData(): Promise<Kontak | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/kontak`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data kontak:", error);
    return null;
  }
}

export default async function KontakPage() {
  const data = await getKontakData();

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Gagal memuat data kontak.
      </div>
    );
  }

  // Membersihkan nomor telepon untuk link wa.me
  const cleanPhoneNumber = (phone: string = "") => {
    return phone.replace(/[()+\s-]/g, "");
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="w-full h-screen flex flex-col ">
        <div className="relative flex-1 flex flex-col justify-center items-center ">
          <Image
            src={data.hero?.heroImage || "/landing-page.png"}
            alt="Desa Slamparejo"
            fill
            quality={100}
            className="z-0 object-cover "
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0  bg-black/40 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <div className="border-b">
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl mb-6 tracking-[9px]`}
              >
                KONTAK
              </h1>
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              {data.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

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

      <section className="bg-[#F9FEFF] py-12 px-4 md:px-0">
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
            <HourEntry
              type={false}
              days="Senin - Kamis"
              hours="08:00 - 15:30 WIB"
            />
            <HourEntry type={true} days="Sabtu - Minggu" hours="Tutup" />
            <HourEntry type={false} days="Jumat" hours="08:00 - 11:30 WIB" />
            <HourEntry type={true} days="Hari Libur Nasional" hours="Tutup" />
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
    </main>
  );
}
