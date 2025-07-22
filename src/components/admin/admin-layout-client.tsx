"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  // Jika di halaman login atau belum authenticated, tampilkan tanpa sidebar
  if (pathname === "/admin" || status !== "authenticated") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
