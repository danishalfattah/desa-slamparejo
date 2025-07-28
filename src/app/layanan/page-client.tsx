// src/app/layanan/page-client.tsx

"use client";
import Link from "next/link";
import { Playfair_Display, Poppins } from "next/font/google";
import { Layanan } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

interface LayananPageClientProps {
  data: Layanan;
}

export default function LayananPageClient({ data }: LayananPageClientProps) {
  return (
    <>
      {/* Akses Layanan */}
      <section
        className="relative w-full py-16 px-4 md:px-0"
        style={{
          backgroundColor: "#0B4973",
          backgroundImage: "url('/Patterns.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white md:pl-8">
            <h2
              className={`${playfair.className} text-3xl md:text-5xl font-normal mb-4`}
            >
              {data.akses?.title || "Akses Layanan"}
            </h2>
            <p
              className={`${poppins.className} text-base md:text-lg font-normal leading-relaxed whitespace-pre-line`}
            >
              {data.akses?.description ||
                "Pilih layanan yang anda butuhkan, Pengajuan akan di proses secara online melalui formulir resmi"}
            </p>
          </div>
          <div className="w-full max-w-md mx-auto">
            {data.forms && data.forms.length > 0 ? (
              <Carousel
                opts={{ align: "start", loop: data.forms.length > 1 }}
                className="w-full"
              >
                <CarouselContent>
                  {data.forms.map((form) => (
                    <CarouselItem key={form.id}>
                      <div className="p-1">
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
                          <div>
                            <h3
                              className={`${playfair.className} text-lg font-semibold text-[#0B4973] mb-1`}
                            >
                              {form.title}
                            </h3>
                            <p
                              className={`${poppins.className} text-gray-700 text-sm`}
                            >
                              {form.description}
                            </p>
                          </div>
                          <Link
                            href={form.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4"
                          >
                            <button
                              type="button"
                              className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
                            >
                              Isi Formulir
                            </button>
                          </Link>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {data.forms.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p>Belum ada layanan yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Persyaratan Layanan Section */}
      {data.persyaratan && data.persyaratan.length > 0 && (
        <section className="bg-white py-16 px-4 md:px-0">
          <div className="max-w-4xl mx-auto">
            <div className="border-b border-black pb-2 sm:pb-4 w-fit mb-12">
              <h1
                className={`${playfair.className} font-normal text-2xl sm:text-4xl md:text-5xl`}
              >
                Persyaratan Layanan
              </h1>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {data.persyaratan.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={`item-${item.id}`}
                  className="border-b-0"
                >
                  <AccordionTrigger className="text-lg bg-gray-50 hover:bg-gray-100 px-6 py-4 rounded-lg font-semibold text-gray-800 text-left">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 px-6">
                    <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-700">
                      {item.content.split("\n").map((line, index) => (
                        <li key={index}>{line.replace(/^\d+\.\s*/, "")}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-10 px-4 md:px-0">
        <div
          className={`max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 ${poppins.className}`}
        >
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
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
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
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
              Data dan informasi Anda dijamin aman dan terlindungi
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
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
              Kami menjaga kepercayaan Anda dengan proses yang transparan dan
              sangat aman
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
