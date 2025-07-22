import type { ReactNode } from "react";
import SessionProviderWrapper from "@/components/admin/session-provider-wrapper";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SessionProviderWrapper>
          <AdminLayoutClient>{children}</AdminLayoutClient>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
