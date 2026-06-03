"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    const res = await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate }),
    });
    if (res.ok) {
      router.push("/challenge");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-800 text-foreground">
            75 Hard
          </h1>
          <p className="text-lg text-foreground/60">
            Ready to transform your life?
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-blush-100">
          <label className="block space-y-3">
            <span className="font-heading text-sm font-700 uppercase tracking-wide text-lavender-600">
              Start Date
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-blush-200 bg-blush-50 px-4 py-3 text-center text-lg font-medium text-foreground focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-200"
            />
          </label>

          <button
            onClick={handleStart}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-lavender-500 px-6 py-4 font-heading text-lg font-700 text-white shadow-md transition-all hover:bg-lavender-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Starting..." : "Begin Challenge"}
          </button>
        </div>

        <p className="text-sm text-foreground/40">
          75 days. No excuses. You&apos;ve got this.
        </p>
      </div>
    </div>
  );
}
