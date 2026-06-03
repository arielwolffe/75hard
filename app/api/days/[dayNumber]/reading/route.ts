import { db } from "@/db";
import { days, readingLogs, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  const { dayNumber } = await params;
  const num = parseInt(dayNumber, 10);
  const { bookId, pagesRead } = await request.json();

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
    return Response.json({ error: "Day not found or completed" }, { status: 400 });
  }

  const log = db
    .insert(readingLogs)
    .values({
      dayId: day.id,
      bookId,
      pagesRead,
      loggedAt: new Date().toISOString(),
    })
    .returning()
    .get();

  return Response.json({ log });
}
