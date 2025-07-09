import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";
import { Card } from "@/app/(main)/kontak/components/card";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">KONTAK</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.</p>
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
              className={`${playfair.className} text-white text-3xl md:text-6xl font-normal tracking-[1.5px] mb-4`}
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
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
                title="Email Resmi"
                description="Kirim email untuk pertanyaan atau permohonan resmi"
                buttonText="Kirim Email"/>
            <Card 
                title="Telepon Kantor"
                description="Hubungi langsung untuk informasi terpercaya dengan cepat"
                buttonText="Hubungi Sekarang"/>
            <Card
                title="Instagram"
                description="Ikuti Kegiatan dan Berita Terbaru dari Desa Slamparejo"
                buttonText="Kunjungi Instagram"/>
          </div>
        </div>
      </section>
    </main>
  );
}