"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./card";

const MOBILE_CARD_WIDTH = 280;
const DESKTOP_CARD_WIDTH = 300;
const GAP = 24;
const CLONE_COUNT = 3;

const originalData = [
  { id: 1, image: "/rujak.jpg", title: "Rujak Bu Lisa", description: "Menjual rujak dengan berbagai isian dan pilihan bumbu", phone:"081232956765", maps: "https://maps.app.goo.gl/J814Nfnh9ghooCAM6" },
  { id: 2, image: "/nasi geret.jpg", title: "Nasi Geret", description: "Menjual nasi geret enak dan berkualitas", phone: "085895147660", maps: "https://maps.app.goo.gl/bYW4Hr6B1r4kpoHr7" },
  { id: 3, image: "/yansen farm.jpg", title: "Yansen Farm", description: "Menjual ayam potong", phone: "085646558697", maps: "https://maps.app.goo.gl/PtmKTouB39xarx5h8" },
  { id: 4, image: "/rainda.jpg", title: "Dimsum Rainda", description: "Menjual berbagai makanan, yaitu dimsum, es mambo, dan es krim", phone: "085755454584", maps: "https://maps.app.goo.gl/s1WFPje9oiWEoxPz5" },
  { id: 5, image: "/bagus sablon.jpg", title: "Bagus Sablon", description: "Melayani sablon kaos berkualitas", phone: "085749654548", maps: "https://maps.app.goo.gl/DemxWqfpHkTqhWk76" },
  { id: 6, image: "/jamu kampoeng.jpg", title: "Jamu Kampoeng", description: "Menjual jamu dengan racikan rempah alami untuk menjaga kesehatan tubuh", phone: "085749654548", maps: "https://maps.app.goo.gl/DemxWqfpHkTqhWk76" },
];

const data = [
  ...originalData.slice(-CLONE_COUNT),
  ...originalData,
  ...originalData.slice(0, CLONE_COUNT),
];

export default function Usaha() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(CLONE_COUNT);
  const [transition, setTransition] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    window.addEventListener('resize', updateLayout);
    const observer = new ResizeObserver(updateLayout);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateLayout);
      observer.disconnect();
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setTransition(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
    setTransition(true);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= originalData.length + CLONE_COUNT) {
      setTransition(false);
      setCurrentIndex(CLONE_COUNT);
    } else if (currentIndex < CLONE_COUNT) {
      setTransition(false);
      setCurrentIndex(originalData.length + CLONE_COUNT - 1);
    }
  };

  const cardWidth = isMobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH;
  const totalSpace = cardWidth + GAP;
  const translateX = -(currentIndex * totalSpace);

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 bg-[#F9FCFC] py-4 sm:py-8">
      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-screen-xl" ref={containerRef}>
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
            width: `${cardWidth * visibleCount + GAP * Math.max(0, visibleCount - 1)}px` 
          }}
        >
          <div
            className={`flex gap-6 ${transition ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: `${data.length * totalSpace}px`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {data.map((item, idx) => (
              <Card key={`${item.id}-${idx}`} {...item} />
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