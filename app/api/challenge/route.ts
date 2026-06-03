import { db } from "@/db";
import { challenges, days } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getDayNumber, getDateForDay } from "@/lib/dates";
import { TOTAL_DAYS } from "@/lib/constants";

export async function GET() {
  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (!challenge) {
    return Response.json({ challenge: null });
  }

  const currentDay = getDayNumber(challenge.startDate);
  const allDays = db.query.days.findMany({
    where: eq(days.challengeId, challenge.id),
  }).sync();

  const completedCount = allDays.filter((d) => d.completed).length;

  return Response.json({
    challenge: {
      ...challenge,
      currentDay: Math.min(currentDay, TOTAL_DAYS),
      completedCount,
      totalDays: TOTAL_DAYS,
    },
    days: allDays,
  });
}

export async function POST(request: Request) {
  const { startDate } = await request.json();

  const existing = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();
  if (existing) {
    return Response.json({ error: "Active challenge already exists" }, { status: 400 });
  }

  const challenge = db
    .insert(challenges)
    .values({
      startDate,
      status: "active",
      createdAt: new Date().toISOString(),
    })
    .returning()
    .get();

  for (let i = 1; i <= TOTAL_DAYS; i++) {
    db.insert(days).values({
      challengeId: challenge.id,
      dayNumber: i,
      date: getDateForDay(startDate, i),
    }).run();
  }

  return Response.json({ challenge });
}
