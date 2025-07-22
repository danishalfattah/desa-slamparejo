"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import SessionProviderWrapper from "@/components/admin/session-provider-wrapper";
import { usePathname } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showAdminUI = pathname !== "/admin";

  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-100">
        <SessionProviderWrapper>
          <div className="flex">
            {showAdminUI && (
              <>
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              </>
            )}
            {/* Pastikan main content bisa di-scroll secara vertikal jika perlu */}
            <main className="flex-1 overflow-y-auto">
              {/* Tambahkan padding di sini */}
              <div className={showAdminUI ? "p-4 md:p-8" : ""}>{children}</div>
            </main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
