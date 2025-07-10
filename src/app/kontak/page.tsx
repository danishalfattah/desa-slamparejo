import Image from "next/image";

import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";

import { Phone, Mail, Instagram } from "lucide-react";

import { Card } from "@/features/kontak/components/card";
import { HourEntry } from "@/features/kontak/components/hour-entry";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-white">
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
              Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.
            </p>
          </div>
        </div>
      </section>

      {/* Kontak */}
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
              Kontak<br/>Desa
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center ">
            <p
              className={`${poppins.className}  text-white text-sm md:text-lg font-normal tracking-wider`}
            >
              Hubungi kami melalui informasi kontak di bawah ini jika anda
              memiliki pertanyaan atau permohonan untuk Pemerintah Desa
              Slamparejo.
            </p>
          </div>
        </div>
      </div>
      {/* Info Section */}
      <section className="bg-[#F9FEFF] py-12 px-4 md:px-0">
        <div className="w-full md:p-10">
          <div className="flex flex-wrap md:flex-row flex-col md:justify-between items-center">
            <Card
              title="Email Resmi"
              description="Kirim email untuk pertanyaan atau permohonan resmi"
              contactInfo="desa.slamparejo@gmail.com"
              link="mailto:desa.slamparejo@gmail.com"
              buttonText="Kirim Email"
            >
              <Mail />
            </Card>
            <Card
              title="Telepon Kantor"
              description="Hubungi langsung untuk informasi terpercaya dengan cepat"
              contactInfo="(+62)895-5450-6045"
              link="tel:+6289554506045"
              buttonText="Hubungi Sekarang"
            >
              <Phone />
            </Card>
            <Card
              title="instagram"
              description="Ikuti Kegiatan dan Berita Terbaru dari Desa Slamparejo"
              contactInfo="@desa_slamparejo"
              link="https://www.instagram.com/desa_slamparejo/"
              buttonText="Kunjungi Instagram"
            >
              <Instagram />
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="p-[37px]">
          <div className="border-b border-black py-5 w-fit">
            <h1 className={`${playfair.className} font-normal text-5xl`}>
              Jam Operasional
            </h1>
          </div>
          <div className="h-[78px] my-[13px]">
            <p className={`${poppins.className}`}>
              Kantor Desa Slamparejo melayani masyarakat pada jam berikut
            </p>
          </div>
          <div className="grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 grid-rows-4 md:mx-[130px] rounded-xl shadow-xl p-[37px] gap-y-[36px] gap-x-[134px]">
            <HourEntry
              type={false}
              days="Senin - Jumat"
              hours="08:00 - 15:00 WIB"
            />
            <HourEntry
              type={false}
              days="Senin - Jumat"
              hours="08:00 - 15:00 WIB"
            />
            <HourEntry
              type={true}
              days="Senin - Jumat"
              hours="08:00 - 15:00 WIB"
            />
            <HourEntry
              type={true}
              days="Senin - Jumat"
              hours="08:00 - 15:00 WIB"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="p-[37px]">
          <div className="border-b border-black py-5 w-fit">
            <h1 className={`${playfair.className} font-normal text-5xl`}>
              Lokasi Kantor Desa
            </h1>
          </div>
          <div className="h-[78px] my-[13px]">
            <p className={`${poppins.className} font-normal leading-[32px] text-xl tracking-[1.5px]`}>
              Jl. Raya Slamparejo No.18, Dusun Krajan, Slamparejo, Kec. Jabung, Kabupaten Malang,<br/> Jawa Timur 65155
            </p>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.6956236655833!2d112.75946407493598!3d-7.926825378926761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62e89c51385f5%3A0xc864a6272e336681!2sKantor%20Desa%20Slamparejo!5e0!3m2!1sen!2sus!4v1752159631421!5m2!1sen!2sus"
          className="md:w-[1166px] h-[407px] mx-auto  mb-[80px]"
          allowFullScreen={false} loading="lazy"
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </section>
    </main>
  );
}
