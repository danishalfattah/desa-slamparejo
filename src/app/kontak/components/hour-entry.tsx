import React from "react";
import { Clock } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

type HourEntryProps = {
  type: boolean;
  days: string;
  hours: string;
};

export function HourEntry({ type, days, hours }: HourEntryProps) {
  return (
    // Mengubah `items-center` menjadi `items-start md:items-center`
    <div className="flex flex-col items-start md:items-center md:flex-row justify-between w-full">
      <div className="flex flex-row items-center">
        <Clock
          color={type ? "red" : "blue"}
          size={32}
          className="mr-4 shrink-0"
        />
        <p className={`${poppins.className} font-semibold text-lg`}>{days}</p>
      </div>
      <p
        className={`${poppins.className} font-medium text-lg mt-1 md:mt-0 md:ml-4`}
      >
        {hours}
      </p>
    </div>
  );
}
