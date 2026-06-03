import { db } from "@/db";
import { challenges, days, dayPhotos, waterLogs, readingLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { formatDate, getDayNumber } from "@/lib/dates";
import { TOTAL_DAYS } from "@/lib/constants";
import { DayChecklist } from "@/components/checklist/day-checklist";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ dayNumber: string }>;
}) {
  const { dayNumber } = await params;
  const num = parseInt(dayNumber, 10);

  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (!challenge) {
    redirect("/start");
  }

  const day = db.query.days.findFirst({
    where: and(eq(days.challengeId, challenge.id), eq(days.dayNumber, num)),
  }).sync();

  if (!day) {
    redirect("/challenge");
  }

  const photos = db.query.dayPhotos.findMany({
    where: eq(dayPhotos.dayId, day.id),
  }).sync();

  const water = db.query.waterLogs.findMany({
    where: eq(waterLogs.dayId, day.id),
  }).sync();

  const reading = db.query.readingLogs.findMany({
    where: eq(readingLogs.dayId, day.id),
  }).sync();

  const currentDay = Math.min(getDayNumber(challenge.startDate), TOTAL_DAYS);
  const isToday = num === currentDay;
  const isFuture = num > currentDay;

  return (
    <div className="mx-auto max-w-lg px-4 pt-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-800 text-foreground">
            Day {num}
          </h1>
          {isFuture && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground/40 ring-1 ring-black/5">
              Upcoming
            </span>
          )}
          {isToday && (
            <span className="rounded-full bg-lavender-100 px-3 py-1 text-xs font-semibold text-lavender-600">
              Today
            </span>
          )}
          {day.completed && (
            <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-mint-600">
              Complete
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-foreground/50">{formatDate(day.date)}</p>
      </div>

      <DayChecklist
        day={day}
        photos={photos}
        waterLogs={water}
        readingLogs={reading}
        dayNumber={num}
        isFuture={isFuture}
      />
    </div>
  );
}
