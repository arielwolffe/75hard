"use client";

import { useState } from "react";

const ANGLES = ["front", "back", "side"] as const;

export function PhotoComparison({
  dayNumbers,
  allPhotos,
}: {
  dayNumbers: number[];
  allPhotos: Record<number, { front?: string; back?: string; side?: string }>;
}) {
  const firstDay = dayNumbers[0];
  const [compareDay, setCompareDay] = useState(dayNumbers[dayNumbers.length - 1]);

  const firstPhotos = allPhotos[firstDay] || {};
  const comparePhotos = allPhotos[compareDay] || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="text-center">
          <p className="text-xs font-medium text-foreground/40">From</p>
          <p className="font-heading text-lg font-700 text-lavender-600">Day {firstDay}</p>
        </div>
        <svg className="h-5 w-5 text-foreground/20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
        <div className="text-center">
          <p className="text-xs font-medium text-foreground/40">To</p>
          <select
            value={compareDay}
            onChange={(e) => setCompareDay(Number(e.target.value))}
            className="font-heading text-lg font-700 text-lavender-600 bg-transparent text-center focus:outline-none"
          >
            {dayNumbers.map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {ANGLES.map((angle) => (
        <div key={angle} className="space-y-2">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-foreground/40">
            {angle}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <PhotoFrame
              src={firstPhotos[angle]}
              label={`Day ${firstDay}`}
            />
            <PhotoFrame
              src={comparePhotos[angle]}
              label={`Day ${compareDay}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PhotoFrame({ src, label }: { src?: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      {src ? (
        <img src={src} alt={label} className="aspect-[3/4] w-full object-cover" />
      ) : (
        <div className="flex aspect-[3/4] items-center justify-center bg-blush-50">
          <p className="text-xs text-foreground/30">No photo</p>
        </div>
      )}
      <p className="py-1 text-center text-[10px] font-medium text-foreground/40">
        {label}
      </p>
    </div>
  );
}
