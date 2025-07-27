// src/components/layout-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/features/navbar";
import Footer from "@/features/footer";
import React, { useState } from "react";
import ChatIcon from "./chat-icon";
import ChatBox from "./chat-box";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && (
        <>
          <Footer />
          {!isChatOpen ? (
            <ChatIcon onClick={() => setIsChatOpen(true)} />
          ) : (
            <ChatBox onClose={() => setIsChatOpen(false)} />
          )}
        </>
      )}
    </>
  );
}
