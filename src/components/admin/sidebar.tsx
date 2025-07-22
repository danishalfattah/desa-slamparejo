"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Admin Desa</h2>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {adminNavLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="w-full px-4 py-2 text-left bg-red-600 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
