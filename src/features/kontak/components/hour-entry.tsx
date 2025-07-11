import React from "react";
import { Clock } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["500", "600"],
});

type HourEntryProps = {
    type: boolean,
    days: string,
    hours: string,
}

export function HourEntry({
    type,
    days,
    hours,
}: HourEntryProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row items-center">
        <Clock color={type ? "red" : "blue"} size={50} className="mx-[10px]"/>
        <p className={`${poppins.className} font-semibold text-xl`}>{days}</p>
      </div>
        <p className={`${poppins.className} font-medium`}>{hours}</p>
    </div>
  );
}