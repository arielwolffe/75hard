"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    await fetch("/api/reset", { method: "POST" });
    router.push("/start");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground/50">Are you sure? This cannot be undone.</span>
        <button
          onClick={handleReset}
          disabled={loading}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Yes, reset"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/50 hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-foreground/30 hover:text-red-400 transition-colors"
    >
      Reset everything
    </button>
  );
}
