"use client";

import { useEffect, useRef, useState } from "react";
import Card from "./card";

const data = [
  { id: 1, image: "/faq.png", title: "Keripik 1", description: "Deskripsi keripik 1" },
  { id: 2, image: "/umkm1.jpg", title: "Keripik 2", description: "Deskripsi keripik 2" },
  { id: 3, image: "/umkm1.jpg", title: "Keripik 3", description: "Deskripsi keripik 3" },
  { id: 4, image: "/umkm1.jpg", title: "Keripik 4", description: "Deskripsi keripik 4" },
  { id: 5, image: "/umkm1.jpg", title: "Keripik 5", description: "Deskripsi keripik 5" },
  { id: 6, image: "/umkm1.jpg", title: "Keripik 6", description: "Deskripsi keripik 6" },
  { id: 7, image: "/umkm1.jpg", title: "Keripik 7", description: "Deskripsi keripik 7" },
  { id: 8, image: "/umkm1.jpg", title: "Keripik 8", description: "Deskripsi keripik 8" },
  { id: 9, image: "/umkm1.jpg", title: "Keripik 9", description: "Deskripsi keripik 9" },
  { id: 10, image: "/umkm1.jpg", title: "Keripik 10", description: "Deskripsi keripik 10" },
];

export default function Usaha() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [startIndex, setStartIndex] = useState(0);

  const CARD_WIDTH = 300;
  const GAP = 24;

  useEffect(() => {
    const container = containerRef.current;

    const updateVisibleCount = () => {
      if (container) {
        const containerWidth = container.offsetWidth;
        const totalCardSpace = CARD_WIDTH + GAP;
        const count = Math.max(1, Math.floor(containerWidth / totalCardSpace));
        setVisibleCount(count);
      }
    };

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(updateVisibleCount);
    resizeObserver.observe(container!);

    return () => resizeObserver.disconnect();
  }, []);

  const handleNext = () => {
    const nextStart = startIndex + visibleCount;
    if (nextStart >= data.length) {
      setStartIndex(0);
    } else {
      setStartIndex(nextStart);
    }
  };

  const handlePrev = () => {
    const prevStart = startIndex - visibleCount;
    if (prevStart < 0) {
      const remainder = data.length % visibleCount;
      const lastGroupStart = remainder === 0
        ? data.length - visibleCount
        : data.length - remainder;
      setStartIndex(lastGroupStart);
    } else {
      setStartIndex(prevStart);
    }
  };

  const visibleCards = data.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="w-full flex flex-col items-center px-4 bg-[#F9FCFC]">
      <div className="flex items-center gap-4 mb-4 w-full" ref={containerRef}>
        <button onClick={handlePrev} className="p-2 shrink-0">
          <img src="/left-arrow.png" alt="Prev" className="w-6 h-6" />
        </button>

        <div className="flex gap-6 justify-center flex-grow overflow-hidden">
          {visibleCards.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </div>

        <button onClick={handleNext} className="p-2 shrink-0">
          <img src="/right-arrow.png" alt="Next" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}