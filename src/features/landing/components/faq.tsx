import Image from "next/image";
import { Playfair_Display } from "next/font/google";
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

const dataFaq = [
  {
    id: 1,
    name: "lorem",
    desc: "lorem lorem lorem lorem lorem lorem lorem lorem ",
  },
  {
    id: 2,
    name: "lorem",
    desc: "lorem lorem lorem lorem lorem lorem lorem lorem ",
  },
  {
    id: 3,
    name: "lorem",
    desc: "lorem lorem lorem lorem lorem lorem lorem lorem ",
  },
  {
    id: 4,
    name: "wa",
    desc: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem loremlorem lorem lorem lorem lorem lorem lorem loremlorem lorem lorem lorem lorem lorem lorem lorem ",
  },
];

export default function Faq() {
  return (
    <section className="w-full h-screen flex flex-col">
      <div className="relative flex-1 flex flex-col w-full justify-center items-center   ">
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
        <div className="max-w-6xl  relative z-20 flex flex-col gap-8  h-full w-full md:px-0 px-5 py-20">
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
                <AccordionTrigger>{data.name}</AccordionTrigger>
                <AccordionContent className="flex flex-col pb-4 ">
                  <p>{data.desc}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
