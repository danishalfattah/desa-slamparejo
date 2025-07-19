import Image from "next/image";

export default function Launching() {
  return (
    <section className="w-full flex flex-col items-center justify-center p-4 md:py-12">
      <div className="relative w-full max-w-6xl aspect-video rounded-xl shadow-2xl overflow-hidden">
        <Image
          src="/launching.png"
          alt="launching"
          fill
          quality={100}
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start px-2 py-4 md:px-8 md:py-8">
          <div className="w-full max-w-lg">
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-3 leading-tight break-words">
              <span>Launching Website</span>
              <span className="block">Desa Slamparejo</span>
            </h2>
            <p className="text-white text-sm md:text-lg font-normal leading-relaxed break-words">
              Mahasiswa dari Fakultas Ilmu Komputer, Universitas Brawijaya,
              telah meluncurkan website desaslamparejo.id sebagai bagian dari
              program pengabdian masyarakat untuk Desa Slamparejo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
