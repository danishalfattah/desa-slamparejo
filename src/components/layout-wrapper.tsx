"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/features/navbar";
import Footer from "@/features/footer";
import React from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}
