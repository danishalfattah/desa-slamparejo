import { Poppins } from "next/font/google";
import React from "react";

import { Ban, LucideProps } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

type CardProps = {
  title: string;
  description: string;
  contactInfo: string;
  link: string;
  buttonText: string;
  children: React.ReactElement<LucideProps>;
};

export function Card({
  title,
  description,
  contactInfo,
  link,
  buttonText,
  children,
}: CardProps) {
  const realChildren = React.isValidElement(children) ? (
    React.cloneElement(children, { color: "white" })
  ) : (
    <Ban color="white" />
  );

  return (
    <div
      className={`${poppins.className} mb-8 max-w-sm h-[422px] bg-white rounded-lg drop-shadow-lg p-6 flex flex-col justify-around items-center`}
    >
      <div className="rounded-full size-[85px] bg-[#094B72] flex items-center justify-center">
        {realChildren}
      </div>
      <div className="bg-[#094B7296] rounded-lg w-40">
        <h3 className="font-bold text-lg my-1 text-center text-white">
          {title}
        </h3>
      </div>
      <div className="w-full px-4">
        <p className="text-xs font-normal leading-relaxed text-center text-black">
          {description}
        </p>
      </div>
      <p className="text-black font-semibold text-base text-center">
        {contactInfo}
      </p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center"
      >
        <button
          type="button"
          className="w-auto rounded-lg bg-[#0B4973] text-white px-4 py-2 font-bold hover:bg-[#09395a] transition"
        >
          {buttonText}
        </button>
      </a>
    </div>
  );
}
