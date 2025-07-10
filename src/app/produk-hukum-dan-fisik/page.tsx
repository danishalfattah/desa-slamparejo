"use client";
import { useState } from "react";
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

{/* Data produk hukum */}
const produkHukumData = [
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.01 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1pKrcroSH_JbZ2V79v9ctE0FRuxYNmEkl",
  },
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.03 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1OegrT_dCNoBxQOsGoPoEq1Z1efe6YT39",
  },
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.04 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1lI-9-CMvwNp6elvhUtKOrol_nRT4ITS4/view?usp=drive_link",
  },
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.04 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1lI-9-CMvwNp6elvhUtKOrol_nRT4ITS4/view?usp=drive_link",
  },
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.04 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1lI-9-CMvwNp6elvhUtKOrol_nRT4ITS4/view?usp=drive_link",
  },
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.04 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1lI-9-CMvwNp6elvhUtKOrol_nRT4ITS4/view?usp=drive_link",
  },
  {
    category: "Perdes",
    year: 2024,
    fileType: "pdf",
    title: "Peraturan Desa No.04 Tahun 2024",
    description: "Mengatur tata cara pengelolaan sampah rumah tangga dan komersial di wilayah Desa Slamparejo",
    link: "https://drive.google.com/uc?export=download&id=1lI-9-CMvwNp6elvhUtKOrol_nRT4ITS4/view?usp=drive_link",
  },
];

{/* Data Pembangunan */}
const pembangunanData = [
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
  {
    image: "/landing-page.png",
    status: "Selesai",
    title: "Pembangunan Jalan Desa",
    description: "Pembangunan jalan penghubung antar dusun di wilayah Desa Slamparejo telah selesai dilaksanakan dengan hasil yang memuaskan.",
    budget: "Rp 150.000.000",
    year: 2024,
  },
];

const PAGE_SIZE = 6;

export default function ProdukPage() {
  const [tab, setTab] = useState("hukum");
  const [page, setPage] = useState(1);

  const hukumTotal = produkHukumData.length;
  const pembangunanTotal = pembangunanData.length;

  const hukumPages = Math.ceil(hukumTotal / PAGE_SIZE);
  const pembangunanPages = Math.ceil(pembangunanTotal / PAGE_SIZE);

  const hukumItems = produkHukumData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pembangunanItems = pembangunanData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col ">
        <div className="relative w-full h-screen flex flex-col justify-center items-center">
          <Image
            src="/landing-page.png"
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
              <h1 className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}>PRODUK HUKUM & FISIK</h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}>
              Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.
            </p>
          </div>
        </div>
      </section>

      {/* Blue Pattern Section */}
      <section
        className="w-full px-5 py-10 relative flex justify-center"
        style={{
          backgroundColor: '#0B4973',
          backgroundImage: "url('/Patterns.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl  flex flex-col md:flex-row gap-0  ">
          <div className="md:w-1/2  flex items-center z-50 ">
            <h2 className={`${playfair.className} text-white text-2xl md:text-4xl font-normal tracking-[1.5px] mb-4`}>
              Produk Desa Slamparejo
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center ">
            <p className={`${poppins.className}  text-white text-base md:text-lg font-normal tracking-wider`}>
              Akses dokumen resmi dan pantau seluruh proses pembangunan Desa Slamparejo secara transparan, akuntabel, dan terbuka bagi masyarakat, untuk mendorong partisipasi aktif warga dalam pengambilan keputusan serta memastikan setiap tahapan pembangunan berjalan sesuai rencana dan kebutuhan bersama.
            </p>
          </div>
        </div>
      </section>

      {/* Produk Section */}
      <section className="bg-white py-10 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">Produk Desa Slamparejo</h2>
          <p className="text-white mb-8">Akses dokumen resmi dan pantau seluruh proses pembangunan Desa Slamparejo secara transparan, akuntabel, dan terbuka bagi masyarakat, untuk mendorong partisipasi aktif warga dalam pengambilan keputusan serta memastikan setiap tahapan pembangunan berjalan sesuai rencana dan kebutuhan bersama.</p>
          <div className="flex gap-4 mb-8">
            {/* Produk Hukum Button */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold border transition
                ${tab === "hukum"
                  ? "bg-[#0B4973] text-white border-[#0B4973]"
                  : "bg-[#E5E7EB] text-[#222] border-[#E5E7EB]"}
              `}
              onClick={() => { setTab("hukum"); setPage(1); }}
            >
              {/* Produk Hukum Icon */}
              <svg width="22" height="22" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <path d="M14.44,7.389 L9.662,2.61 L10.232,2.041 L9.315,1.122 L5.068,5.367 L5.988,6.285 L6.518,5.755 L8.473,7.709 L-0.062,16.244 L0.768,17.073 L9.301,8.539 L11.295,10.532 L10.766,11.063 L11.684,11.98 L15.938,7.727 L15.021,6.809 L14.44,7.389 Z" fill="currentColor"/>
  </g>
</svg>
              Produk Hukum
            </button>
            {/* Pembangunan Button */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold border transition
                ${tab === "pembangunan"
                  ? "bg-[#0B4973] text-white border-[#0B4973]"
                  : "bg-[#E5E7EB] text-[#222] border-[#E5E7EB]"}
              `}
              onClick={() => { setTab("pembangunan"); setPage(1); }}
            >
              {/* Pembangunan Icon */}
              <svg width="22" height="22" viewBox="0 0 256 220" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M133.202,84.142c5.795,0,10.493,4.698,10.493,10.493s-4.698,10.493-10.493,10.493s-10.493-4.698-10.493-10.493
S127.406,84.142,133.202,84.142z M94.71,147.731l-0.097-0.097l0,0c-0.435-0.29-0.822-0.532-1.161-0.919l1.161,13.298L80.01,180.71
c-2.079,2.998-1.354,7.06,1.547,9.139c2.998,2.079,7.06,1.354,9.139-1.547l15.764-22.727c0.822-1.161,1.354-2.708,1.161-4.255
l-0.532-6.431L94.71,147.731z M138.086,191.01h62.573l-11.702-36.509c0,0-6.625,1.644-19.729,15.571
c-0.29,0.29-0.629,0.629-0.919,0.919l-31.625-18.279c0.532-1.015,0.629-2.176,0.435-3.433L125.9,107.692
c-0.919-4.062-4.545-7.157-8.801-7.157H96.161c-1.547,0-3.095,0.822-3.965,2.176l-10.445,18.134
c-1.354,2.176-0.532,4.981,1.644,6.238l11.702,6.722l-1.547,2.611c-1.886,3.095-0.822,7.06,2.369,8.801l26.257,15.135v23.985
c0,3.627,2.901,6.528,6.528,6.528c3.627,0,6.528-2.901,6.528-6.528v-27.37l29.062,16.828c-5.996,3.433-12.863,4.062-17.747,6.963
C140.552,184.336,138.086,191.01,138.086,191.01z M97.321,129.984l-7.689-4.449l0,0l9.139-15.764h10.252L97.321,129.984z
 M114.198,139.752l7.253-12.669l5.416,19.923L114.198,139.752z M241.583,217.906H14.417c-4.457,0-8.594-2.406-10.797-6.28
s-2.157-8.66,0.122-12.49L117.325,8.166c2.261-3.802,6.252-6.072,10.675-6.072c4.423,0,8.414,2.27,10.675,6.072l113.583,190.97
c2.278,3.83,2.325,8.616,0.122,12.49C250.177,215.499,246.04,217.906,241.583,217.906z M15.876,206.353L15.876,206.353
c0.001-0.001,0.001-0.002,0.002-0.003L15.876,206.353z M17.402,203.787h221.196L128,17.837L17.402,203.787z"/>
              </svg>
              Pembangunan
            </button>
          </div>

          {/* Produk Hukum */}
          {tab === "hukum" && (
            <div>
              {hukumItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-5 flex items-center gap-4 mb-4">
                  <div className="flex flex-col items-center gap-2 min-w-[60px]">
                    <span className="bg-[#E5E7EB] text-[#0B4973] text-xs font-bold px-2 py-1 rounded">{item.category}</span>
                    <span className="text-xs text-gray-500">{item.year}</span>
                    <Image src={item.fileType === 'pdf' ? '/file.svg' : '/file.svg'} alt="filetype" width={32} height={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-[#0B4973] mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                  </div>
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <button className="bg-[#0B4973] text-white px-4 py-2 rounded font-semibold hover:bg-[#09395a] transition">Unduh</button>
                  </Link>
                </div>
              ))}
              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: hukumPages }, (_, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded ${page === i + 1 ? 'bg-[#0B4973] text-white' : 'bg-white text-[#0B4973] border border-[#0B4973]'}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pembangunan */}
          {tab === "pembangunan" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pembangunanItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <div className="relative w-full h-36 mb-3">
                    <Image src={item.image} alt={item.title} fill className="object-cover rounded" />
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">{item.status}</span>
                  </div>
                  <h3 className="font-semibold text-base text-[#0B4973] mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>Anggaran: <b>{item.budget}</b></span>
                    <span>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination for pembangunan */}
          {tab === "pembangunan" && pembangunanPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pembangunanPages }, (_, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded ${page === i + 1 ? 'bg-[#0B4973] text-white' : 'bg-white text-[#0B4973] border border-[#0B4973]'}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
