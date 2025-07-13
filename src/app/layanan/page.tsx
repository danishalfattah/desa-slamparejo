import Image from "next/image";
import Link from "next/link";
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

export default function LayananPage() {
  // To change the link for each button, just update the links in the `formLinks` array below (order matters, left-to-right):
  const formLinks = [
    {
      url: "/layanan/kepuasan-masyarakat",
      title: "Kuesioner Survei Kepuasan Masyarakat",
      desc: "Semua masukan yang masuk akan dibaca dan dipertimbangkan oleh perangkat desa sebagai bentuk perbaikan dan keterbukaan.",
    },
  ];
  // Example: Replace "https://link1.com" with your actual form link.
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
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
                LAYANAN
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              Layanan Desa Slamparejo dirancang untuk memberikan kemudahan,
              kenyamanan, dan kejelasan dalam setiap proses pelayanan.
            </p>
          </div>
        </div>
      </section>

      {/* Akses Layanan */}
      <section
        className="relative w-full py-16 px-4 md:px-0"
        style={{
          backgroundColor: '#0B4973',
          backgroundImage: "url('/Patterns.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Title & Description */}
          <div className="text-white md:pl-8">
            <h2
              className={`${playfair.className} text-3xl md:text-5xl font-normal mb-4`}
            >
              Akses Layanan
            </h2>
            <p
              className={`${poppins.className} text-base md:text-lg font-normal leading-relaxed`}
            >
              Pilih layanan yang anda butuhkan,
              <br />
              Pengajuan akan di proses secara online melalui formulir resmi
            </p>
          </div>
          {/* Right: 2x2 Cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-w-[220px] min-h-[200px]">
              <div className="mb-2">
                <h3 className={`${playfair.className} text-lg font-semibold text-[#0B4973] mb-1`}>
                  Kuesioner Survei Kepuasan Masyarakat
                </h3>
                <p className={`${poppins.className} text-gray-700 text-sm`}>
                  Semua masukan yang masuk akan dibaca dan dipertimbangkan oleh perangkat desa sebagai bentuk perbaikan dan keterbukaan.
                </p>
              </div>
              <Link
                href="/layanan/kepuasan-masyarakat"
                rel="noopener noreferrer"
                className="mt-auto"
                passHref
              >
                <button
                  type="button"
                  className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
                >
                  Kirim Formulir
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-10 px-4 md:px-0">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`flex flex-col items-center bg-white rounded-lg shadow p-6 ${poppins.className}`}
          >
            <div className="bg-[#0B4973] text-white rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6l4 2"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#0B4973] mb-1">
              Proses Cepat
            </span>
            <p className="text-gray-600 text-sm text-center">
              Pengajuan diproses dan diverifikasi dengan cepat
            </p>
          </div>
          <div
            className={`flex flex-col items-center bg-white rounded-lg shadow p-6 ${poppins.className}`}
          >
            <div className="bg-[#0B4973] text-white rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 10V7a5 5 0 0 0-10 0v3m-2 4h14l-1.34 5.36A2 2 0 0 1 15.7 21H8.3a2 2 0 0 1-1.96-1.64L5 14Z"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#0B4973] mb-1">Aman</span>
            <p className="text-gray-600 text-sm text-center">
              Pengajuan diproses dan diverifikasi dengan cepat
            </p>
          </div>
          <div
            className={`flex flex-col items-center bg-white rounded-lg shadow p-6 ${poppins.className}`}
          >
            <div className="bg-[#0B4973] text-white rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.5 12.5l2 2 3-3"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#0B4973] mb-1">
              Terpercaya
            </span>
            <p className="text-gray-600 text-sm text-center">
              Pengajuan diproses dan diverifikasi dengan cepat
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
