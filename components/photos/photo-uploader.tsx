"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Photo {
  id: number;
  angle: string;
  url: string;
}

const ANGLES = ["front", "back", "side"] as const;

export function PhotoUploader({
  dayNumber,
  photos: initialPhotos,
  disabled,
  onUpload,
}: {
  dayNumber: number;
  photos: Photo[];
  disabled: boolean;
  onUpload: () => void;
}) {
  const [photos, setPhotos] = useState<Record<string, Photo | null>>(() => {
    const map: Record<string, Photo | null> = {};
    for (const angle of ANGLES) {
      map[angle] = initialPhotos.find((p) => p.angle === angle) || null;
    }
    return map;
  });
  const [uploading, setUploading] = useState<string | null>(null);

  async function handleUpload(angle: string, file: File) {
    if (disabled) return;
    setUploading(angle);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("angle", angle);

    const res = await fetch(`/api/days/${dayNumber}/photos`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setPhotos((prev) => ({ ...prev, [angle]: data.photo }));
      onUpload();
    }
    setUploading(null);
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <p className="mb-3 text-sm font-semibold text-foreground">
        Progress Photos
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ANGLES.map((angle) => {
          const photo = photos[angle];
          const isUploading = uploading === angle;

          return (
            <div key={angle} className="space-y-1">
              <label
                className={cn(
                  "flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors",
                  photo
                    ? "border-mint-300 bg-mint-50"
                    : "border-blush-200 bg-blush-50 hover:border-lavender-300",
                  disabled && "cursor-default opacity-60",
                  isUploading && "animate-pulse"
                )}
              >
                {photo ? (
                  <img
                    src={photo.url}
                    alt={`${angle} photo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-6 w-6 text-foreground/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="mt-1 text-[10px] text-foreground/30">
                      {isUploading ? "..." : "Upload"}
                    </span>
                  </div>
                )}
                {!disabled && (
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(angle, file);
                    }}
                  />
                )}
              </label>
              <p className="text-center text-[10px] font-medium uppercase tracking-wide text-foreground/40">
                {angle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
