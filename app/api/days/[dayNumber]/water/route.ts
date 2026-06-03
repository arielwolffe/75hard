import { db } from "@/db";
import { days, waterLogs, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  const { dayNumber } = await params;
  const num = parseInt(dayNumber, 10);
  const { amountMl } = await request.json();

  if (![250, 500, 1000].includes(amountMl)) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();
  if (!challenge) {
    return Response.json({ error: "No active challenge" }, { status: 404 });
  }

  const day = db.query.days.findFirst({
    where: and(eq(days.challengeId, challenge.id), eq(days.dayNumber, num)),
  }).sync();
  if (!day || day.completed) {
    return Response.json({ error: "Day not found or already completed" }, { status: 400 });
  }

  const log = db
    .insert(waterLogs)
    .values({
      dayId: day.id,
      amountMl,
      loggedAt: new Date().toISOString(),
    })
    .returning()
    .get();

  const newTotal = day.waterMl + amountMl;
  db.update(days)
    .set({ waterMl: newTotal })
    .where(eq(days.id, day.id))
    .run();

  return Response.json({ log, waterMl: newTotal });
}
