import Image from "next/image";

interface CardProps {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function Card({ name, title, description, imageUrl }: CardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg pt-10 pb-6 px-6 w-full max-w-xs flex flex-col items-center text-center relative">
      <div className="w-32 h-32 relative z-10 -mb-5">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="rounded-full object-cover border-white"
        />
      </div>

      <span className="bg-[#21597f] text-white px-8 py-1 rounded-md text-md font-semibold z-20 mb-2 relative">
        {title}
      </span>

      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}