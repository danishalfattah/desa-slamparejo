import { Poppins } from "next/font/google";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});


type CardProps = {
    title: string;
    description: string;
    contactInfo: string;
    link: string;
    buttonText: string;
    children: React.ReactNode;
};

export function Card({
    title,
    description,
    contactInfo,
    link,
    buttonText,
    children,
}: CardProps) {
    return (
    <div className="mb-8 max-w-sm h-[422px] bg-white rounded-lg shadow p-6 flex flex-col justify-around items-center">
        {children}
        <div className="bg-[#094B7296] rounded-lg w-40">
            <h3 className="font-bold text-lg mb-2 text-center text-white">{title}</h3>
        </div>
        <div className="w-3xs">
            <p className={`${poppins.className} text-[11px] font-semibold leading-[32px] text-center text-black`}>
                {description}
            </p>
        </div>
        <p className={`${poppins.className} text-black font-semibold text-base text-center`}>{contactInfo}</p>
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center"
        >
            <button
            type="button"
            className={`${poppins.className} w-2xs rounded-lg bg-[#0B4973] text-white px-4 py-2 font-bold hover:bg-[#09395a] transition`}
            >
            {buttonText}
            </button>
        </a>
    </div>
    )
}