import { ReactNode } from "react";
import Sidebar from "@/components/admin/sidebar";
import SessionProviderWrapper from "@/components/admin/session-provider-wrapper";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-100 flex">
        <SessionProviderWrapper>
          <Sidebar />
          <main className="flex-1">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
