"use client"; // Komponen ini interaktif, jadi harus Client Component

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { FaqItem } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Fungsi untuk mengubah string menjadi elemen dengan Link
const parseAnswer = (answer: string) => {
  const parts = answer.split(/("Kotak Saran"|"Kontak Kami"|"Produk")/g);
  return parts.map((part, index) => {
    if (part === '"Kotak Saran"') {
      return (
        <Link
          key={index}
          href="/layanan/kepuasan-masyarakat"
          className="italic hover:text-bg-pattern font-semibold"
        >
          {`"Kotak Saran"`}
        </Link>
      );
    }
    if (part === '"Kontak Kami"') {
      return (
        <Link
          key={index}
          href="/kontak"
          className="italic hover:text-bg-pattern font-semibold"
        >
          {`"Kontak Kami"`}
        </Link>
      );
    }
    if (part === '"Produk"') {
      return (
        <Link
          key={index}
          href="/produk-hukum-dan-fisik"
          className="italic hover:text-pattern font-semibold"
        >
          {`"Produk"`}
        </Link>
      );
    }
    return part;
  });
};

export default function Faq({ data }: { data: FaqItem[] }) {
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
            defaultValue="item-0"
          >
            {data.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="bg-white rounded-lg px-4"
              >
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="flex flex-col pb-4 ">
                  <p>{parseAnswer(faq.answer)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
