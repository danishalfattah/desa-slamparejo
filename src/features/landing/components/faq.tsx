import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const dataFaq = [
  {
    id: 1,
    question:
      "Bisakah saya menyampaikan aspirasi atau pengaduan melalui website ini?",
    answer: (
      <>
        Bisa. Gunakan fitur{" "}
        <Link
          href="/layanan/kepuasan-masyarakat"
          className="italic hover:text-bg-pattern"
        >
          {`"Kotak Saran"`}
        </Link>{" "}
        untuk menyampaikan aspirasi, kritik, atau pengaduan. Pesan Anda akan
        ditindaklanjuti oleh perangkat desa sesuai prosedur.
      </>
    ),
  },
  {
    id: 2,
    question:
      "Bagaimana cara mengurus layanan administrasi di Desa Slamparejo?",
    answer: (
      <>
        Seluruh layanan administrasi hanya dilayani langsung di kantor desa.
        Sebelum datang, silakan cek jam operasional dan kontak resmi di menu{" "}
        <Link href="/kontak" className="italic hover:text-bg-pattern">
          {`"Kontak Kami"`}
        </Link>{" "}
        agar kunjungan Anda lebih efisien.
      </>
    ),
  },
  {
    id: 3,
    question:
      "Di mana saya bisa menemukan informasi tentang peraturan desa dan hasil pembangunan fisik?",
    answer: (
      <>
        Informasi mengenai produk hukum, seperti Peraturan Desa (Perdes) dan
        keputusan resmi lainnya, dapat Anda temukan di menu{" "}
        <Link href="/produk" className="italic hover:text-pattern">
          {`"Produk"`}
        </Link>
        .
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section className="w-full h-screen flex flex-col">
      <div className="relative flex-1 flex flex-col w-full items-center  px-5  py-20">
        <Image
          src="/faq.png"
          alt="faq"
          fill
          quality={100}
          className="z-0 object-cover "
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0  bg-black/40 z-10" />
        <div className="max-w-6xl  relative z-20 flex flex-col gap-8  h-full w-full ">
          <h1
            className={`${playfair.className} text-white text-3xl font-normal tracking-[1.5px] `}
          >
            Pertanyaan yang sering diajukan
          </h1>
          <Accordion
            type="single"
            collapsible
            className="w-full  md:w-2/3 flex flex-col gap-2  "
            defaultValue="data-2"
          >
            {dataFaq.map((data) => (
              <AccordionItem
                key={data.id}
                value={`data-${data.id}`}
                className="bg-white rounded-lg px-4"
              >
                <AccordionTrigger>{data.question}</AccordionTrigger>
                <AccordionContent className="flex flex-col pb-4 ">
                  <p>{data.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
