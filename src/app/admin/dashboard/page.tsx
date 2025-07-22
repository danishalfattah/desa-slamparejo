import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin");
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Selamat Datang di Admin Dashboard
      </h1>
      <p className="text-gray-700">
        Silakan pilih halaman dari sidebar di sebelah kiri untuk mulai mengelola
        konten website.
      </p>
    </div>
  );
}
