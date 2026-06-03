"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Day {
  id: number;
  dayNumber: number;
  date: string;
  completed: boolean;
}

function formatShortDate(dateStr: string): { day: number; month: string; weekday: string } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(y, m - 1, d);
  return { day: d, month: months[m - 1], weekday: weekdays[date.getDay()] };
}

export function CalendarGrid({
  days,
  currentDay,
}: {
  days: Day[];
  currentDay: number;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
      {days.map((day) => {
        const isToday = day.dayNumber === currentDay;
        const isPast = day.dayNumber < currentDay;
        const isFuture = day.dayNumber > currentDay;
        const isMissed = isPast && !day.completed;
        const { day: dateNum, month, weekday } = formatShortDate(day.date);

        return (
          <Link
            key={day.id}
            href={`/challenge/day/${day.dayNumber}`}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl px-1 py-2 transition-all hover:scale-105",
              day.completed &&
                "bg-mint-100 text-mint-600 ring-1 ring-mint-200",
              isToday &&
                !day.completed &&
                "bg-lavender-100 text-lavender-600 ring-2 ring-lavender-400 shadow-md",
              isMissed &&
                "bg-blush-50 text-blush-500 ring-1 ring-blush-200",
              isFuture &&
                "bg-white/60 text-foreground/30 ring-1 ring-black/5"
            )}
          >
            <span className="text-[9px] font-semibold uppercase leading-none opacity-50">
              {weekday}
            </span>
            <span className="text-base font-bold leading-tight">
              {dateNum}
            </span>
            <span className="text-[9px] leading-none opacity-50">
              {month}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
