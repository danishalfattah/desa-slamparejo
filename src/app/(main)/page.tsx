import Faq from "@/features/landing/components/faq";
import Hero from "@/features/landing/components/hero";
import Launching from "@/features/landing/components/launching";
import { Beranda } from "@/lib/types";

// Fungsi untuk mengambil data dari server-side
async function getBerandaData(): Promise<Beranda | null> {
  try {
    // Pastikan URL absolut untuk server-side fetching
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/beranda`, {
      cache: "no-store", // Selalu ambil data terbaru
    });
    if (!res.ok) {
      console.error("Gagal mengambil data beranda");
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching beranda data:", error);
    return null;
  }
}

export default async function BerandaPage() {
  const data = await getBerandaData();

  if (!data) {
    return <div>Gagal memuat konten halaman. Silakan coba lagi nanti.</div>;
  }

  return (
    <>
      <Hero data={data} />
      <Launching data={data.launching} />
      <Faq data={data.faq} />
    </>
  );
}
