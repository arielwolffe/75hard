"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { WaterTracker } from "@/components/water/water-tracker";
import { PhotoUploader } from "@/components/photos/photo-uploader";
import { GALLON_ML } from "@/lib/constants";

interface DayData {
  id: number;
  dayNumber: number;
  dietDone: boolean;
  workout1Done: boolean;
  workout1Outdoor: boolean;
  workout2Done: boolean;
  workout2Outdoor: boolean;
  waterMl: number;
  readingDone: boolean;
  photoDone: boolean;
  completed: boolean;
}

interface Photo {
  id: number;
  angle: string;
  url: string;
}

interface WaterLog {
  id: number;
  amountMl: number;
  loggedAt: string;
}

interface ReadingLog {
  id: number;
  bookId: number;
  pagesRead: number;
}

export function DayChecklist({
  day,
  photos,
  waterLogs,
  readingLogs,
  dayNumber,
  isFuture,
}: {
  day: DayData;
  photos: Photo[];
  waterLogs: WaterLog[];
  readingLogs: ReadingLog[];
  dayNumber: number;
  isFuture: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState(day);
  const [completing, setCompleting] = useState(false);

  const disabled = state.completed || isFuture;

  async function toggle(field: string, value: boolean) {
    if (disabled) return;
    setState((s) => ({ ...s, [field]: value }));
    await fetch(`/api/days/${dayNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  async function completeDay() {
    setCompleting(true);
    const res = await fetch(`/api/days/${dayNumber}/complete`, {
      method: "POST",
    });
    if (res.ok) {
      setState((s) => ({ ...s, completed: true }));
      router.refresh();
    }
    setCompleting(false);
  }

  const allDone =
    state.dietDone &&
    state.workout1Done &&
    state.workout2Done &&
    state.waterMl >= GALLON_ML &&
    state.readingDone &&
    state.photoDone;

  return (
    <div className="space-y-4 pb-24">
      <ChecklistItem
        label="Follow diet"
        sublabel="No cheat meals, no alcohol"
        checked={state.dietDone}
        disabled={disabled}
        onChange={(v) => toggle("dietDone", v)}
      />

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <ChecklistItem
          label="Workout 1"
          sublabel="45 minutes"
          checked={state.workout1Done}
          disabled={disabled}
          onChange={(v) => toggle("workout1Done", v)}
          inline
        />
        {state.workout1Done && (
          <label className="mt-2 flex items-center gap-2 pl-9 text-sm text-foreground/60">
            <input
              type="checkbox"
              checked={state.workout1Outdoor}
              disabled={disabled}
              onChange={(e) => toggle("workout1Outdoor", e.target.checked)}
              className="h-4 w-4 rounded border-blush-200 text-mint-500 focus:ring-lavender-400"
            />
            Outdoor
          </label>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <ChecklistItem
          label="Workout 2"
          sublabel="45 minutes"
          checked={state.workout2Done}
          disabled={disabled}
          onChange={(v) => toggle("workout2Done", v)}
          inline
        />
        {state.workout2Done && (
          <label className="mt-2 flex items-center gap-2 pl-9 text-sm text-foreground/60">
            <input
              type="checkbox"
              checked={state.workout2Outdoor}
              disabled={disabled}
              onChange={(e) => toggle("workout2Outdoor", e.target.checked)}
              className="h-4 w-4 rounded border-blush-200 text-mint-500 focus:ring-lavender-400"
            />
            Outdoor
          </label>
        )}
      </div>

      <WaterTracker
        dayNumber={dayNumber}
        waterMl={state.waterMl}
        logs={waterLogs}
        disabled={disabled}
        onUpdate={(ml) => setState((s) => ({ ...s, waterMl: ml }))}
      />

      <ChecklistItem
        label="Read 10 pages"
        sublabel="Non-fiction / self-improvement"
        checked={state.readingDone}
        disabled={disabled}
        onChange={(v) => toggle("readingDone", v)}
      />

      <PhotoUploader
        dayNumber={dayNumber}
        photos={photos}
        disabled={disabled}
        onUpload={() => {
          setState((s) => ({ ...s, photoDone: true }));
          router.refresh();
        }}
      />

      {isFuture && (
        <div className="rounded-2xl bg-white/60 p-6 text-center ring-1 ring-black/5">
          <p className="font-heading text-sm font-700 text-foreground/40">
            This day hasn&apos;t started yet
          </p>
        </div>
      )}

      {!state.completed && !isFuture && (
        <button
          onClick={completeDay}
          disabled={!allDone || completing}
          className={cn(
            "w-full rounded-2xl px-6 py-4 font-heading text-lg font-700 shadow-md transition-all",
            allDone
              ? "bg-mint-500 text-white hover:bg-mint-600 active:scale-[0.98]"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          )}
        >
          {completing ? "Completing..." : allDone ? "Complete Day" : "Complete all tasks first"}
        </button>
      )}

      {state.completed && (
        <div className="rounded-2xl bg-mint-50 p-6 text-center ring-1 ring-mint-200">
          <p className="font-heading text-lg font-700 text-mint-600">
            Day {dayNumber} complete!
          </p>
          <p className="mt-1 text-sm text-mint-500">Amazing work. Keep going.</p>
        </div>
      )}
    </div>
  );
}

function ChecklistItem({
  label,
  sublabel,
  checked,
  disabled,
  onChange,
  inline,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        !inline && "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
      )}
    >
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
          checked
            ? "border-mint-400 bg-mint-400 text-white"
            : "border-blush-200 bg-white hover:border-lavender-300",
          disabled && "opacity-60"
        )}
      >
        {checked && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        )}
      </button>
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            checked ? "text-foreground/50 line-through" : "text-foreground"
          )}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-foreground/40">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
