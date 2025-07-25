"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ProdukHukum, Pembangunan } from "@/lib/types";
import { Eye, Download, Scale, Construction, FileText } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PAGE_SIZE = 6;

// Komponen Modal untuk Preview PDF
const PdfPreviewModal = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
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

interface ProdukPageClientProps {
  produkHukumData: ProdukHukum[];
  pembangunanData: Pembangunan[];
}

export default function ProdukPageClient({
  produkHukumData,
  pembangunanData,
}: ProdukPageClientProps) {
  const [tab, setTab] = useState("hukum");
  const [page, setPage] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = (link: string) => {
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
    <>
      {previewUrl && (
        <PdfPreviewModal src={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
      <section className="bg-[#F9FCFC] py-16 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 mb-8">
            <button
              className={`${
                poppins.className
              } flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border transition ${
                tab === "hukum"
                  ? "bg-[#0B4973] text-white border-[#0B4973]"
                  : "bg-white text-[#222] border-gray-300"
              }`}
              onClick={() => {
                setTab("hukum");
                setPage(1);
              }}
            >
              <Scale size={16} />
              Produk Hukum
            </button>
            <button
              className={`${
                poppins.className
              } flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border transition ${
                tab === "pembangunan"
                  ? "bg-[#0B4973] text-white border-[#0B4973]"
                  : "bg-white text-[#222] border-gray-300"
              }`}
              onClick={() => {
                setTab("pembangunan");
                setPage(1);
              }}
            >
              <Construction size={16} />
              Pembangunan
            </button>
          </div>

          <>
            {tab === "hukum" && (
              <div className="space-y-4">
                {hukumItems.map((item) => (
                  <div
                    key={item.id}
                    className={`${poppins.className} bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4 border border-blue-100`}
                  >
                    <div className="flex flex-row justify-between  items-start sm:items-center w-full">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="bg-blue-100 text-[#0B4973] p-3 rounded-lg flex-shrink-0">
                          <FileText size={24} />
                        </div>
                        <div>
                          <span className="bg-blue-200 text-[#0B4973] text-xs font-bold px-2.5 py-1 rounded-full">
                            {item.category}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Tahun {item.year}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-center flex-shrink-0">
                        <button
                          onClick={() => handlePreview(item.link)}
                          className="bg-[#0B4973] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#09395a] transition flex items-center gap-2 text-sm"
                        >
                          <Eye size={16} />
                          Lihat
                        </button>
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          passHref
                        >
                          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2 text-sm">
                            <Download size={16} />
                            Unduh
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className="w-full pt-2  border-gray-100">
                      <h3 className="font-semibold text-base text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
                {hukumPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: hukumPages }, (_, i) => (
                      <button
                        key={i}
                        className={`${poppins.className} w-8 h-8 rounded-lg ${
                          page === i + 1
                            ? "bg-[#0B4973] text-white"
                            : "bg-white text-[#0B4973] border border-gray-300"
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

            {tab === "pembangunan" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pembangunanItems.map((item) => (
                    <div
                      key={item.id}
                      className={`${poppins.className} bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col group border-2 border-transparent  transition-all duration-300`}
                    >
                      <div className="relative w-full h-40">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-base text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1 font-normal">
                          {item.description}
                        </p>
                        <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-xs text-gray-500 mt-auto">
                          <span className="font-semibold">
                            Anggaran: <b>{item.budget}</b>
                          </span>
                          <span className="font-semibold">{item.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {pembangunanPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pembangunanPages }, (_, i) => (
                      <button
                        key={i}
                        className={`${poppins.className} w-8 h-8 rounded-lg ${
                          page === i + 1
                            ? "bg-[#0B4973] text-white"
                            : "bg-white text-[#0B4973] border border-gray-300"
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
          </>
        </div>
      </section>
    </>
  );
}
