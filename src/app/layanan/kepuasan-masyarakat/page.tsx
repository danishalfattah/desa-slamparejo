import Link from "next/link";

// Fungsi untuk mengambil data dari server-side
async function getLayananData() {
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

export default async function KritikSaran() {
  const data = await getLayananData();
  const formLink = data?.formLink || ""; // Fallback to empty string if data fails to load

  return (
    <section className="flex flex-col justify-center items-center h-screen pt-20 pb-10">
      <div className="w-full max-w-3xl rounded-lg shadow-lg overflow-hidden bg-white p-4 h-full flex items-center justify-center">
        {formLink ? (
          <iframe
            src={formLink}
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            allowFullScreen
            title="Survei Kepuasan Masyarakat"
          >
            Loading…
          </iframe>
        ) : (
          <p>Gagal memuat formulir.</p>
        )}
      </div>
      {formLink && (
        <Link
          href={formLink.replace("?embedded=true", "")} // Hapus parameter embed untuk link tab baru
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-6 py-2 bg-pattern text-white rounded-lg shadow hover:opacity-80 transition"
        >
          Buka Google Form di Tab Baru
        </Link>
      )}
    </section>
  );
}
