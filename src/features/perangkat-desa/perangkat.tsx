"use client";

import Card from "./card";
import { PerangkatDesa } from "@/lib/types";

export default function DaftarPerangkat({
  dataPerangkat,
}: {
  dataPerangkat: PerangkatDesa[];
}) {
  if (!dataPerangkat || dataPerangkat.length === 0) {
    return (
      <div className="text-center py-10 bg-[#f4f8fc]">
        Belum ada data perangkat desa yang tersedia.
      </div>
    );
  }

  return (
    <section className="bg-[#f4f8fc] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {dataPerangkat.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}
