import Link from "next/link";

export default function KritikSaran() {
  return (
    <section className="flex flex-col justify-center items-center h-screen pt-20 pb-10">
      <div className="w-full max-w-3xl rounded-lg shadow-lg overflow-hidden bg-white p-4 h-full flex items-center justify-center">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSd_iFaqwV66X0psODErf4qKssKTR2OA5ntPnjDzciugxw-bzA/viewform?embedded=true"
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          allowFullScreen
          title="Kritik dan Saran"
        >
          Loading…
        </iframe>
      </div>
      <Link
        href="https://docs.google.com/forms/d/e/1FAIpQLSd_iFaqwV66X0psODErf4qKssKTR2OA5ntPnjDzciugxw-bzA/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 px-6 py-2 bg-pattern text-white rounded-lg shadow hover:opacity-80 transition"
      >
        Buka Google Form di Tab Baru
      </Link>
    </section>
  );
}
