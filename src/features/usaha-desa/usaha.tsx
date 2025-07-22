"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./card";
import { Usaha } from "@/lib/types";

const MOBILE_CARD_WIDTH = 280;
const DESKTOP_CARD_WIDTH = 300;
const GAP = 24;
const CLONE_COUNT = 3;

export default function DaftarUsaha() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(CLONE_COUNT);
  const [transition, setTransition] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [data, setData] = useState<Usaha[]>([]);
  const [originalDataLength, setOriginalDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/usaha-desa");
        const originalData: Usaha[] = await response.json();
        setOriginalDataLength(originalData.length);

        if (originalData.length > 0) {
          const head = originalData.slice(0, CLONE_COUNT);
          const tail = originalData.slice(-CLONE_COUNT);
          const clonedData = [...tail, ...originalData, ...head];
          setData(clonedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data usaha:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const mobile = window.innerWidth < 640;
        setIsMobile(mobile);

        const cardWidth = mobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH;
        const totalSpace = cardWidth + GAP;
        const fullCount = Math.max(1, Math.floor(containerWidth / totalSpace));

        setVisibleCount(fullCount);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    const observer = new ResizeObserver(updateLayout);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateLayout);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentIndex >= originalDataLength + CLONE_COUNT) return;
    setCurrentIndex((prev) => prev + 1);
    setTransition(true);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex((prev) => prev - 1);
    setTransition(true);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= originalDataLength + CLONE_COUNT) {
      setTransition(false);
      setCurrentIndex(CLONE_COUNT);
    } else if (currentIndex < CLONE_COUNT) {
      setTransition(false);
      setCurrentIndex(originalDataLength + CLONE_COUNT - 1);
    }
  };

  const cardWidth = isMobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH;
  const totalSpace = cardWidth + GAP;
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const visibleWidth = cardWidth * visibleCount + GAP * (visibleCount - 1);
  const offset = (containerWidth - visibleWidth) / 2;
  const translateX = -(currentIndex * totalSpace) + offset;

  if (isLoading) {
    return <div className="text-center py-10">Memuat data UMKM...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10">
        Belum ada data usaha yang tersedia.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 bg-[#F9FCFC] py-4 sm:py-8">
      <div
        className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-screen-xl"
        ref={containerRef}
      >
        <button
          onClick={handlePrev}
          className="p-1 sm:p-2 shrink-0 touch-manipulation"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
        </button>

        <div
          className="overflow-hidden"
          style={{
            width: `${visibleWidth}px`,
          }}
        >
          <div
            className={`flex items-center gap-6 ${
              transition ? "transition-transform duration-500 ease-in-out" : ""
            }`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: `${data.length * totalSpace}px`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {data.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex-shrink-0">
                <Card {...item} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="p-1 sm:p-2 shrink-0 touch-manipulation"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
        </button>
      </div>
    </div>
  );
}
