export default function KotakSaran() {
  return (
    <section className="pt-20 flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Kotak Saran
        </h1>
        <p className="text-base text-gray-600">
          Kami menghargai setiap masukan Anda untuk membangun Desa Slamparejo
          yang lebih baik.
        </p>
      </div>
      <div className="w-full max-w-3xl shadow-md rounded-md overflow-hidden border border-gray-300">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSd_iFaqwV66X0psODErf4qKssKTR2OA5ntPnjDzciugxw-bzA/viewform?embedded=true"
          className="w-full h-[70vh] border-none"
        >
          Loading…
        </iframe>
      </div>
    </section>
  );
}
