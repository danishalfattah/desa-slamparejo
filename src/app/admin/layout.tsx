import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/sidebar";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/admin");
  }

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
