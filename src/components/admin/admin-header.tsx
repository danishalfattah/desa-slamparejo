"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Admin", href: "/admin/dashboard" }];

    if (segments.length > 1) {
      const currentPage = segments[segments.length - 1];
      const pageLabels: Record<string, string> = {
        dashboard: "Dashboard",
        beranda: "Halaman Beranda",
        profil: "Profil Desa",
        "perangkat-desa": "Perangkat Desa",
        produk: "Produk & Pembangunan",
        "usaha-desa": "Usaha Desa",
        layanan: "Layanan",
        kontak: "Kontak",
      };

      breadcrumbs.push({
        label: pageLabels[currentPage] || currentPage,
        href: pathname,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={`${crumb.href}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
