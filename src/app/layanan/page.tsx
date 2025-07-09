export default function LayananPage() {
  // To change the link for each button, just update the links in the `formLinks` array below (order matters, left-to-right):
  const formLinks = [
    "https://forms.gle/fPekJoYEFkP3WCWY8", // Button 1
    "https://www.youtube.com/shorts/fibVfMLVnzo", // Button 2
    "https://www.youtube.com/shorts/fibVfMLVnzo", // Button 3
    "https://forms.gle/fPekJoYEFkP3WCWY8", // Button 4
  ];
  // Example: Replace "https://link1.com" with your actual form link.
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[350px] md:h-[400px] w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url(/landing-page.png)" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
            LAYANAN
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Layanan Desa Slamparejo dirancang untuk memberikan kemudahan,
            kenyamanan, dan kejelasan dalam setiap proses pelayanan.
          </p>
        </div>
      </section>

      {/* Akses Layanan */}
      <section className="bg-[#0B4973] py-12 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Akses Layanan
          </h2>
          <p className="text-white mb-8">
            Pilih layanan yang anda butuhkan, Pengajuan akan di proses secara
            online melalui formulir resmi
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/*
              To change the link for each button, just update the links in the `formLinks` array at the top of this file.
              Example: formLinks[0] is for the first button, formLinks[1] for the second, etc.
            */}
            {formLinks.map((link, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg mb-2 text-[#0B4973]">
                    Kotak Saran
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Sampaikan aspirasi, kritik, atau saran anda untuk kemajuan
                    Desa Slamparejo melalui kotak saran online ini.
                  </p>
                </div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <button
                    type="button"
                    className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
                  >
                    Kirim Formulir
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-10 px-4 md:px-0">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <div className="bg-[#0B4973] text-white rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6l4 2"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#0B4973] mb-1">
              Proses Cepat
            </span>
            <p className="text-gray-600 text-sm text-center">
              Pengajuan diproses dan diverifikasi dengan cepat
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <div className="bg-[#0B4973] text-white rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 10V7a5 5 0 0 0-10 0v3m-2 4h14l-1.34 5.36A2 2 0 0 1 15.7 21H8.3a2 2 0 0 1-1.96-1.64L5 14Z"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#0B4973] mb-1">Aman</span>
            <p className="text-gray-600 text-sm text-center">
              Pengajuan diproses dan diverifikasi dengan cepat
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <div className="bg-[#0B4973] text-white rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.5 12.5l2 2 3-3"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#0B4973] mb-1">
              Terpercaya
            </span>
            <p className="text-gray-600 text-sm text-center">
              Pengajuan diproses dan diverifikasi dengan cepat
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
