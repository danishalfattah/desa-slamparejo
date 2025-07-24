import { Layanan, LayananForm } from "@/lib/types";
import Link from "next/link";

async function getLayananData(): Promise<Layanan | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/layanan`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil data layanan:", error);
    return null;
  }
}

// Hapus definisi Props dan gunakan langsung parameter dari Next.js
export default async function FormPage({
  params,
}: {
  params: { formId: string };
}) {
  const data = await getLayananData();
  const form = data?.forms.find((f: LayananForm) => f.id === params.formId);

  if (!form) {
    return (
      <section className="flex flex-col justify-center items-center h-screen pt-20 pb-10">
        <p>Formulir tidak ditemukan.</p>
        <Link href="/layanan" className="mt-4 text-blue-600 hover:underline">
          Kembali ke Halaman Layanan
        </Link>
      </section>
    );
  }

  const embedLink = form.link.includes("?embedded=true")
    ? form.link
    : `${form.link.split("?")[0]}?embedded=true`;

  const externalLink = embedLink.replace("?embedded=true", "");

  return (
    <section className="flex flex-col justify-center items-center min-h-screen pt-24 pb-10 px-4">
      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-3xl font-bold">{form.title}</h1>
        <p className="text-muted-foreground mt-2">{form.description}</p>
      </div>
      <div className="w-full max-w-4xl rounded-lg shadow-lg overflow-hidden bg-white p-2 h-[80vh]">
        <iframe
          src={embedLink}
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          allowFullScreen
          title={form.title}
        >
          Memuat formulir…
        </iframe>
      </div>
      <Link
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 px-6 py-2 bg-pattern text-white rounded-lg shadow hover:opacity-80 transition"
      >
        Buka di Tab Baru
      </Link>
    </section>
  );
}
