"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Poppins } from "next/font/google";
import { ProdukHukum, Pembangunan } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

const PAGE_SIZE = 6;

const PdfPreviewModal = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Preview Dokumen</h3>
        <button
          onClick={onClose}
          className="text-2xl font-bold hover:text-red-500"
        >
          &times;
        </button>
      </div>
      <div className="flex-1">
        <iframe
          src={src}
          width="100%"
          height="100%"
          title="PDF Preview"
        ></iframe>
      </div>
    </div>
  </div>
);

export default function ProdukPage() {
  const [tab, setTab] = useState("hukum");
  const [page, setPage] = useState(1);

  const [produkHukumData, setProdukHukumData] = useState<ProdukHukum[]>([]);
  const [pembangunanData, setPembangunanData] = useState<Pembangunan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [hukumRes, pembangunanRes] = await Promise.all([
          fetch("/api/produk-hukum"),
          fetch("/api/pembangunan"),
        ]);
        setProdukHukumData(await hukumRes.json());
        setPembangunanData(await pembangunanRes.json());
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- FUNGSI YANG DIPERBARUI ---
  const handlePreview = (link: string) => {
    // Regex untuk mengekstrak ID file dari berbagai format URL Google Drive
    const regex =
      /(?:drive\.google\.com\/(?:file\/d\/|uc\?id=)|id=)([a-zA-Z0-9_-]{25,})/;
    const match = link.match(regex);

    if (match && match[1]) {
      const fileId = match[1];
      const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      setPreviewUrl(embedUrl);
    } else {
      alert("Format URL Google Drive tidak valid untuk preview.");
    }
  };

  const hukumTotal = produkHukumData.length;
  const pembangunanTotal = pembangunanData.length;
  const hukumPages = Math.ceil(hukumTotal / PAGE_SIZE);
  const pembangunanPages = Math.ceil(pembangunanTotal / PAGE_SIZE);
  const hukumItems = produkHukumData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const pembangunanItems = pembangunanData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-white">
      {previewUrl && (
        <PdfPreviewModal src={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}

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
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}
              >
                PRODUK HUKUM & FISIK
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              Akses dokumen resmi dan pantau seluruh proses pembangunan Desa
              Slamparejo secara transparan dan terbuka.
            </p>
          </div>
        </div>
      </section>

      {/* Blue Pattern Section */}
      <section
        className="w-full px-5 py-10 relative flex justify-center"
        style={{
          backgroundColor: "#0B4973",
          backgroundImage: "url('/Patterns.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl flex flex-col md:flex-row gap-0">
          <div className="md:w-1/2 flex items-center z-50">
            <h2
              className={`${playfair.className} text-white text-2xl md:text-4xl font-normal tracking-[1.5px] mb-4`}
            >
              Produk Desa Slamparejo
            </h2>
          </div>
          <div className="md:w-1/2 flex items-center ">
            <p
              className={`${poppins.className} text-white text-base md:text-lg font-normal tracking-wider`}
            >
              Akses dokumen resmi dan pantau seluruh proses pembangunan Desa
              Slamparejo secara transparan, akuntabel, dan terbuka bagi
              masyarakat.
            </p>
          </div>
        </div>
      </section>

      {/* Produk Section */}
      <section className="bg-white py-10 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 mb-8">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold border transition ${
                tab === "hukum"
                  ? "bg-[#0B4973] text-white border-[#0B4973]"
                  : "bg-[#E5E7EB] text-[#222] border-[#E5E7EB]"
              }`}
              onClick={() => {
                setTab("hukum");
                setPage(1);
              }}
            >
              Produk Hukum
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold border transition ${
                tab === "pembangunan"
                  ? "bg-[#0B4973] text-white border-[#0B4973]"
                  : "bg-[#E5E7EB] text-[#222] border-[#E5E7EB]"
              }`}
              onClick={() => {
                setTab("pembangunan");
                setPage(1);
              }}
            >
              Pembangunan
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Memuat data...</div>
          ) : (
            <>
              {tab === "hukum" && (
                <div>
                  {hukumItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row items-start md:items-center gap-4 mb-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                          <span className="bg-[#E5E7EB] text-[#0B4973] text-xs font-bold px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.year}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-[#0B4973] mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        <button
                          onClick={() => handlePreview(item.link)}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
                        >
                          Preview
                        </button>
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          passHref
                        >
                          <button className="bg-[#0B4973] text-white px-4 py-2 rounded font-semibold hover:bg-[#09395a] transition">
                            Unduh
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {hukumPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {Array.from({ length: hukumPages }, (_, i) => (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded ${
                            page === i + 1
                              ? "bg-[#0B4973] text-white"
                              : "bg-white text-[#0B4973] border border-[#0B4973]"
                          }`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* ... (bagian pembangunan tidak berubah) ... */}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
