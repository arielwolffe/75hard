import { db } from "@/db";
import { days, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  const { dayNumber } = await params;
  const num = parseInt(dayNumber, 10);

  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();
  if (!challenge) {
    return Response.json({ error: "No active challenge" }, { status: 404 });
  }

  const day = db.query.days.findFirst({
    where: and(eq(days.challengeId, challenge.id), eq(days.dayNumber, num)),
  }).sync();
  if (!day) {
    return Response.json({ error: "Day not found" }, { status: 404 });
  }

  if (day.completed) {
    return Response.json({ error: "Already completed" }, { status: 400 });
  }

  db.update(days)
    .set({ completed: true, completedAt: new Date().toISOString() })
    .where(eq(days.id, day.id))
    .run();

  return Response.json({ success: true });
}
