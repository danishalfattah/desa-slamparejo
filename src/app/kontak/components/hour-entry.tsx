import React from "react";
import { Clock } from "lucide-react";

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
        <p>{days}</p>
        <p>{hours}</p>
    </div>
  );
}