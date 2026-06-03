import { db } from "@/db";
import { days, readingLogs, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ dayNumber: string; logId: string }> }
) {
  const { dayNumber, logId } = await params;
  const num = parseInt(dayNumber, 10);
  const id = parseInt(logId, 10);

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
    return Response.json({ error: "Cannot modify" }, { status: 400 });
  }

  const log = db.query.readingLogs.findFirst({
    where: and(eq(readingLogs.id, id), eq(readingLogs.dayId, day.id)),
  }).sync();
  if (!log) {
    return Response.json({ error: "Log not found" }, { status: 404 });
  }

  db.delete(readingLogs).where(eq(readingLogs.id, id)).run();

  return Response.json({ success: true });
}
