"use client";

import Card from "./card";
import { Usaha } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DaftarUsaha({ dataUsaha }: { dataUsaha: Usaha[] }) {
  if (!dataUsaha || dataUsaha.length === 0) {
    return (
      <div className="text-center py-20 bg-[#F9FCFC]">
        Belum ada data usaha yang tersedia.
      </div>
    );
  }

  return (
    // Menghapus padding horizontal `px-2` agar carousel bisa full-width di mobile
    <section className="bg-[#F9FCFC] py-10 w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
      >
        <CarouselContent className="pl-4 -ml-2 md:pl-0 md:-ml-4">
          {dataUsaha.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:pl-4 basis-auto md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card {...item} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
