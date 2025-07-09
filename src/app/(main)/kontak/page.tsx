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
      <section className="py-12 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"></div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg mb-2 text-[#0B4973]">Email Resmi</h3>
                    <p className="text-gray-600 text-sm mb-4">Kirim email untuk pertanyaan atau permohonan resmi</p>
                </div>
                <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto"
                >
                    <button
                    type="button"
                    className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
                    >
                    Kirim Email
                    </button>
                </a>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg mb-2 text-[#0B4973]">Email Resmi</h3>
                    <p className="text-gray-600 text-sm mb-4">Sampaikan aspirasi, kritik, atau saran anda untuk kemajuan Desa Slamparejo melalui kotak saran online ini.</p>
                </div>
                <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto"
                >
                    <button
                    type="button"
                    className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
                    >
                    Hubungi Sekarang
                    </button>
                </a>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg mb-2 text-[#0B4973]">Email Resmi</h3>
                    <p className="text-gray-600 text-sm mb-4">Sampaikan aspirasi, kritik, atau saran anda untuk kemajuan Desa Slamparejo melalui kotak saran online ini.</p>
                </div>
                <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto"
                >
                    <button
                    type="button"
                    className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
                    >
                    Kunjungi Instagram
                    </button>
                </a>
            </div>
        </div>
      </section>
    </main>
  );
}