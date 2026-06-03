"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/dates";

interface MissedDay {
  id: number;
  dayNumber: number;
  date: string;
  completed: boolean;
}

export function MissedDayModal({ missedDays }: { missedDays: MissedDay[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [restarting, setRestarting] = useState(false);

  if (!open || missedDays.length === 0) return null;

  const firstMissed = missedDays[0];

  async function handleRestart() {
    setRestarting(true);
    await fetch("/api/challenge/restart", { method: "POST" });
    router.push("/start");
  }

  function handleLogIt() {
    setOpen(false);
    router.push(`/challenge/day/${firstMissed.dayNumber}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-peach-100">
            <span className="text-2xl">&#x1f4ad;</span>
          </div>
          <h2 className="font-heading text-xl font-700 text-foreground">
            Hold on...
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            It looks like you didn&apos;t complete{" "}
            <span className="font-semibold text-foreground">
              Day {firstMissed.dayNumber}
            </span>{" "}
            ({formatDate(firstMissed.date)}). Did you miss it, or just forget to
            log?
          </p>
          {missedDays.length > 1 && (
            <p className="mt-1 text-xs text-foreground/40">
              +{missedDays.length - 1} more day{missedDays.length > 2 ? "s" : ""} to review
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogIt}
            className="w-full rounded-xl bg-lavender-500 px-4 py-3 font-heading text-sm font-700 text-white transition-colors hover:bg-lavender-600"
          >
            I forgot to log — let me check it off
          </button>
          <button
            onClick={handleRestart}
            disabled={restarting}
            className="w-full rounded-xl bg-blush-50 px-4 py-3 font-heading text-sm font-700 text-blush-600 ring-1 ring-blush-200 transition-colors hover:bg-blush-100 disabled:opacity-50"
          >
            {restarting ? "Restarting..." : "I missed it — restart challenge"}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 text-sm text-foreground/40 hover:text-foreground/60"
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </div>
  );
}
