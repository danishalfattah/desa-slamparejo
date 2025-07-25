import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

const dataNav = [
  { id: 0, name: "Beranda", href: "/" },
  { id: 1, name: "Berita", href: "/berita" },
  { id: 2, name: "Profil", href: "/profil" },
  { id: 3, name: "Layanan", href: "/layanan" },
  { id: 4, name: "Usaha Desa", href: "/usaha-desa" },
  { id: 5, name: "Perangkat Desa", href: "/perangkat-desa" },
  { id: 6, name: "Kontak", href: "/kontak" },
  { id: 7, name: "Produk", href: "/produk-hukum-dan-fisik" },
];

export default function Footer() {
  return (
    <div className="w-full bg-pattern px-5 py-10 relative flex justify-center  ">
      <Image
        src="/Patterns.png"
        alt="pattern"
        fill
        quality={80}
        className="z-0 object-cover"
        priority
      />
      <div className="max-w-6xl z-50 w-full flex flex-col gap-6 ">
        <div className="flex flex-col md:flex-row md:gap-20 gap-10 w-full">
          <div className="w-full  flex flex-col  ">
            <h2
              className={`${playfair.className} text-white text-6xl  font-normal tracking-[1.5px] mb-4`}
            >
              Desa
            </h2>
            <div className=" w-fit">
              <h2
                className={`${playfair.className} text-white text-6xl  font-normal tracking-[1.5px] mb-4`}
              >
                Slamparejo
              </h2>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
          </div>
          <div className="w-full flex flex-col  gap-1 md:gap-3  ">
            <h1
              className={`${poppins.className}  text-white text-base md:text-xl font-normal tracking-wider`}
            >
              Halaman
            </h1>
            <div className="w-full flex flex-col  ">
              <div className="w-full grid grid-cols-2 gap-2">
                {dataNav.map((data) => (
                  <Link
                    key={data.id}
                    href={data.href}
                    className={`${poppins.className}  text-white text-xs md:text-sm tracking-[1.5px]`}
                  >
                    {data.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 md:gap-3   ">
            <h1
              className={`${poppins.className}  text-white text-base md:text-xl font-normal tracking-wider`}
            >
              Hubungi
            </h1>
            <div className="w-full flex flex-col  ">
              <div className="w-full grid grid-cols-2 gap-2 ">
                <Link
                  href="/kontak"
                  className={`${poppins.className} text-white text-xs md:text-sm tracking-[1.5px]`}
                >
                  Kontak
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p
            className={`${poppins.className} text-white tracking-[1.5px] text-xs`}
          >
            <span>&copy; </span>MMD 32 FILKOM UB 2025 — Dibuat oleh mahasiswa,
            untuk masyarakat. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}
