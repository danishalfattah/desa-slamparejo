"use client";

import { useState, useEffect } from "react";
import Card from "./card";
import { PerangkatDesa } from "@/lib/types";

export default function DaftarPerangkat() {
  const [dataPerangkat, setDataPerangkat] = useState<PerangkatDesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/perangkat-desa");
        const data = await response.json();
        setDataPerangkat(data);
      } catch (error) {
        console.error("Gagal mengambil data perangkat desa:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">Memuat data perangkat desa...</div>
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
