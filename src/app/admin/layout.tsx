import type { ReactNode } from "react";
import SessionProviderWrapper from "@/components/admin/session-provider-wrapper";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProviderWrapper>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </SessionProviderWrapper>
  );
}
