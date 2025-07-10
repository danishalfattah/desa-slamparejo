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
        <Clock color={type ? "red" : "blue"} />
        <p className={`${poppins.className} font-semibold text-xl`}>{days}</p>
        <p className={`${poppins.className} font-medium`}>{hours}</p>
    </div>
  );
}