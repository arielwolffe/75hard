import { db } from "@/db";
import { challenges, days, dayPhotos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PhotoComparison } from "@/components/photos/photo-comparison";

export const dynamic = "force-dynamic";

export default function PhotosPage() {
  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (!challenge) {
    redirect("/start");
  }

  const allChallengeDays = db.query.days
    .findMany({
      where: eq(days.challengeId, challenge.id),
    })
    .sync();

  const daysWithPhotos = allChallengeDays
    .filter((d) => d.photoDone)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  const allPhotos: Record<number, { front?: string; back?: string; side?: string }> = {};
  for (const day of daysWithPhotos) {
    const photos = db.query.dayPhotos.findMany({
      where: eq(dayPhotos.dayId, day.id),
    }).sync();
    allPhotos[day.dayNumber] = {};
    for (const p of photos) {
      allPhotos[day.dayNumber][p.angle as "front" | "back" | "side"] = p.url;
    }
  }

  const dayNumbers = daysWithPhotos.map((d) => d.dayNumber);

  if (dayNumbers.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lavender-100">
          <svg className="h-8 w-8 text-lavender-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-700 text-foreground">No photos yet</h2>
        <p className="mt-2 text-sm text-foreground/50">
          Upload your first progress photos on today&apos;s checklist
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-8">
      <h1 className="mb-6 font-heading text-2xl font-800 text-foreground">
        Progress Photos
      </h1>
      <PhotoComparison dayNumbers={dayNumbers} allPhotos={allPhotos} />
    </div>
  );
}
