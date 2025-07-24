import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface CardProps {
  image: string;
  title: string;
  description: string;
  phone: string;
  maps: string;
}

export default function Card({
  image,
  title,
  description,
  phone,
  maps,
}: CardProps) {
  return (
    <div
      className={`${poppins.className} bg-white rounded-xl shadow-md overflow-hidden w-[280px] sm:w-[300px] flex-shrink-0 transition-transform mb-6`}
    >
      <div className="relative w-full h-40 sm:h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-1">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 h-[36px] sm:h-[48px] line-clamp-2 font-normal">
          {description && description.length > 80
            ? description.slice(0, 80) + "..."
            : description}
        </p>

        <div className="flex flex-col gap-2">
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-300 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded w-max self-start"
          >
            Kontak HP
          </a>
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0E5D85] text-white font-semibold px-3 sm:px-4 py-2 rounded text-center text-sm"
          >
            Kunjungi UMKM
          </a>
        </div>
      </div>
    </div>
  );
}
