import Image from "next/image";

interface CardProps {
  image: string;
  title: string;
  description: string;
}

export default function Card({ image, title, description }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-[300px] flex-shrink-0 transition-transform">
      <div className="relative w-full h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {description.length > 80 ? description.slice(0, 80) + "..." : description}
        </p>
        <div className="flex flex-col gap-2">
          <button className="bg-gray-300 text-sm px-3 py-1 rounded w-max self-start">
            Kontak Hp
          </button>
          <button className="bg-[#0E5D85] text-white font-semibold px-4 py-2 rounded">
            Kunjungi UMKM
          </button>
        </div>
      </div>
    </div>
  );
}