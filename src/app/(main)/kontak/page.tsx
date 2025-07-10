import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";
import { Card } from "./components/card";
import { Clock } from "lucide-react";

import { Phone, Mail, Instagram } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[400px] w-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(/landing-page.png)'}}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className={`${playfair.className} text-4xl md:text-5xl font-medium mb-4 tracking-[9px]`}>KONTAK</h1>
          <p className={`${poppins.className} text-lg md:text-xl font-thin max-w-2xl mx-auto`}>Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.</p>
        </div>
      </section>

      {/* Kontak */}
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
          <div className="md:w-1/2  flex items-center z-50 ">
            <h2
              className={`${playfair.className} text-white text-2xl md:text-8xl font-normal tracking-[1.5px] mb-4`}
            >
                Kontak<br></br>Desa
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center ">
            <p
              className={`${poppins.className}  text-white text-sm md:text-lg font-normal tracking-wider`}
            >
                Hubungi kami melalui informasi kontak di bawah ini jika anda memiliki pertanyaan atau permohonan untuk Pemerintah Desa Slamparejo.
            </p>
          </div>
        </div>
      </div>
      {/* Info Section */}
      <section className="bg-[#F9FEFF] py-12 px-4 md:px-0">
        <div className="w-full md:p-10">
          <div className="flex md:flex-row flex-col md:justify-between items-center">
            <Card
              title="Email Resmi"
              description="Kirim email untuk pertanyaan atau permohonan resmi"
              contactInfo="desa.slamparejo@gmail.com"
              link="mailto:desa.slamparejo@gmail.com"
              buttonText="Kirim Email">
                <Mail />
            </Card>
            <Card 
              title="Telepon Kantor"
              description="Hubungi langsung untuk informasi terpercaya dengan cepat"
              contactInfo="(+62)895-5450-6045"
              link="tel:+6289554506045"
              buttonText="Hubungi Sekarang">
                <Phone />
            </Card>
            <Card
              title="Instagram"
              description="Ikuti Kegiatan dan Berita Terbaru dari Desa Slamparejo"
              contactInfo="@desa_slamparejo"
              link="https://www.instagram.com/desa_slamparejo/"
              buttonText="Kunjungi Instagram">
                <Instagram />
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="border-b border-black py-5 w-fit">
          <h1 className={`${playfair.className} font-normal text-5xl`}>Jam Operasional</h1>
        </div>
        <p className={`${poppins.className}`}>Kantor Desa Slamparejo melayani masyarakat pada jam berikut</p>
        <div>
        </div>
      </section>
    </main>
  );
}