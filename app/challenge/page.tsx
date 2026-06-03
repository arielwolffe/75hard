import { db } from "@/db";
import { challenges, days } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDayNumber } from "@/lib/dates";
import { TOTAL_DAYS } from "@/lib/constants";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { MissedDayModal } from "@/components/calendar/missed-day-modal";

export const dynamic = "force-dynamic";

export default function ChallengePage() {
  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (!challenge) {
    redirect("/start");
  }

  const allDays = db.query.days.findMany({
    where: eq(days.challengeId, challenge.id),
  }).sync();

  const currentDay = Math.min(getDayNumber(challenge.startDate), TOTAL_DAYS);
  const completedCount = allDays.filter((d) => d.completed).length;

  const incompletePastDays = allDays.filter(
    (d) => d.dayNumber < currentDay && !d.completed
  );

  return (
    <div className="mx-auto max-w-lg px-4 pt-8">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-3xl font-800 text-foreground">
          Day {currentDay} of {TOTAL_DAYS}
        </h1>
        <p className="mt-1 text-foreground/50">
          {completedCount} days completed
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-lavender-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-500 transition-all duration-500"
            style={{ width: `${(completedCount / TOTAL_DAYS) * 100}%` }}
          />
        </div>
      </div>

      <CalendarGrid days={allDays} currentDay={currentDay} />

      {incompletePastDays.length > 0 && (
        <MissedDayModal missedDays={incompletePastDays} />
      )}
    </div>
  );
}
