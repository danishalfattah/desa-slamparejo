"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { status, data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Set ready state when both mounted and session is determined
    if (mounted && status !== "loading") {
      // Add small delay to ensure proper hydration
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mounted, status]);

  // Show loading while determining session state
  if (!mounted || !isReady || status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Jika di halaman login atau belum authenticated, tampilkan tanpa sidebar
  if (pathname === "/admin" || status !== "authenticated" || !session) {
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
