"use client";

import { useState } from "react";
import { GALLON_ML, WATER_INCREMENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WaterLog {
  id: number;
  amountMl: number;
  loggedAt: string;
}

export function WaterTracker({
  dayNumber,
  waterMl,
  logs: initialLogs,
  disabled,
  onUpdate,
}: {
  dayNumber: number;
  waterMl: number;
  logs: WaterLog[];
  disabled: boolean;
  onUpdate: (ml: number) => void;
}) {
  const [currentMl, setCurrentMl] = useState(waterMl);
  const [logs, setLogs] = useState(initialLogs);
  const [adding, setAdding] = useState(false);

  const percentage = Math.min((currentMl / GALLON_ML) * 100, 100);
  const isFull = currentMl >= GALLON_ML;

  async function addWater(amount: number) {
    if (disabled) return;
    setAdding(true);
    const res = await fetch(`/api/days/${dayNumber}/water`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountMl: amount }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentMl(data.waterMl);
      onUpdate(data.waterMl);
      setLogs((prev) => [...prev, data.log]);
    }
    setAdding(false);
  }

  async function undoLast() {
    if (disabled || logs.length === 0) return;
    const lastLog = logs[logs.length - 1];
    const res = await fetch(`/api/days/${dayNumber}/water/${lastLog.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentMl(data.waterMl);
      onUpdate(data.waterMl);
      setLogs((prev) => prev.slice(0, -1));
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Water</p>
        <p className="text-xs text-foreground/50">
          {currentMl} / {GALLON_ML} ml
        </p>
      </div>

      <div className="mb-3 h-4 overflow-hidden rounded-full bg-sky-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isFull
              ? "bg-gradient-to-r from-mint-400 to-mint-500"
              : "bg-gradient-to-r from-sky-300 to-sky-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isFull && (
        <p className="mb-3 text-center text-xs font-semibold text-mint-600">
          Gallon complete!
        </p>
      )}

      {!disabled && (
        <div className="flex items-center gap-2">
          {WATER_INCREMENTS.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              disabled={adding}
              className="flex-1 rounded-xl bg-sky-50 py-2 text-xs font-semibold text-sky-600 ring-1 ring-sky-200 transition-colors hover:bg-sky-100 disabled:opacity-50"
            >
              +{amount}ml
            </button>
          ))}
          {logs.length > 0 && (
            <button
              onClick={undoLast}
              className="rounded-xl px-3 py-2 text-xs text-foreground/40 hover:text-foreground/60"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
