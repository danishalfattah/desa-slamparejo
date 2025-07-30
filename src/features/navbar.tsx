"use client";

import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

const dataNav = [
  { id: 0, name: "BERANDA", href: "/" },
  { id: 1, name: "BERITA", href: "/berita" },
  { id: 2, name: "PROFIL", href: "/profil" },
  { id: 3, name: "LAYANAN", href: "/layanan" },
  { id: 4, name: "USAHA DESA", href: "/usaha-desa" },
  { id: 5, name: "PERANGKAT DESA", href: "/perangkat-desa" },
  { id: 6, name: "KONTAK", href: "/kontak" },
  { id: 7, name: "PRODUK DESA", href: "/produk-hukum-dan-fisik" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-white px-4 py-2 fixed top-0 left-0 w-full z-99 shadow-sm">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between ">
        <Link href="/" className="flex gap-2 ">
          <Image
            src="/logo-slamparejo.png"
            alt="logo-slamparejo"
            quality={100}
            width={68}
            height={60}
            className=""
          />
          <div>
            <h1
              className={`${playfair.className} tracking-wide text-sm md:text-base`}
            >
              Desa
            </h1>
            <h1
              className={`${playfair.className} tracking-wide text-sm md:text-base`}
            >
              Slamparejo
            </h1>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8">
          {dataNav.map((data) => (
            <Link
              key={data.id}
              href={data.href}
              className={`${poppins.className} relative text-xs after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full tracking-[1.5px] capitalize`}
            >
              {data.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="z-[999] w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Image
                  src="/logo-slamparejo.png"
                  alt="logo-slamparejo"
                  quality={100}
                  width={48}
                  height={44}
                />
                <p
                  className={`${playfair.className} font-light tracking-wide text-base md:text-base`}
                >
                  Desa Slamparejo
                </p>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col  mt-4">
              {dataNav.map((data) => (
                <Link
                  key={data.id}
                  href={data.href}
                  className={`${poppins.className} text-sm py-5 px-4 rounded-lg hover:bg-gray-100 transition-colors tracking-[1px] capitalize border-b border-gray-100 last:border-b-0`}
                  onClick={() => setIsOpen(false)}
                >
                  {data.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
