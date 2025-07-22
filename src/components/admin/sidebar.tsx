"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const adminNavLinks = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Beranda", href: "/admin/beranda" },
  { name: "Profil", href: "/admin/profil" },
  { name: "Layanan", href: "/admin/layanan" },
  { name: "Usaha Desa", href: "/admin/usaha-desa" },
  { name: "Perangkat Desa", href: "/admin/perangkat-desa" },
  { name: "Kontak", href: "/admin/kontak" },
  { name: "Produk", href: "/admin/produk" },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay untuk seluler */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={cn(
          "bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col h-screen",
          // Gaya seluler
          "fixed z-50 transition-transform transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Gaya desktop: Dibuat 'sticky' dan menempel di atas (top-0)
          "md:sticky md:top-0"
        )}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Admin Desa</h2>
        </div>

        {/* Wrapper untuk membuat navigasi bisa di-scroll */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 space-y-1">
            {adminNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-md transition-colors ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 mt-auto border-t border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="w-full px-4 py-2 text-left bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
