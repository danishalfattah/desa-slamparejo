import React from "react";
import { Clock } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

type HourEntryProps = {
  days: string;
  hours: string;
};

export function HourEntry({ days, hours }: HourEntryProps) {
  const isTutup = hours.toLowerCase() === "tutup";
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
            isTutup ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          <Clock color="white" size={20} />
        </div>
        <p
          className={`${poppins.className} font-semibold text-base text-gray-800`}
        >
          {days}
        </p>
      </div>
      <p
        className={`${poppins.className} font-medium text-base ${
          isTutup ? "text-red-600" : "text-gray-800"
        }`}
      >
        {hours}
      </p>
    </div>
  );
}
