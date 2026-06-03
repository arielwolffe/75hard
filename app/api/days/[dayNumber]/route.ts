import { db } from "@/db";
import { days, dayPhotos, waterLogs, readingLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { challenges } from "@/db/schema";

export async function GET(
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

  const photos = db.query.dayPhotos.findMany({
    where: eq(dayPhotos.dayId, day.id),
  }).sync();

  const water = db.query.waterLogs.findMany({
    where: eq(waterLogs.dayId, day.id),
  }).sync();

  const reading = db.query.readingLogs.findMany({
    where: eq(readingLogs.dayId, day.id),
  }).sync();

  return Response.json({ day, photos, waterLogs: water, readingLogs: reading });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  const { dayNumber } = await params;
  const num = parseInt(dayNumber, 10);
  const body = await request.json();

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
    return Response.json({ error: "Day already completed" }, { status: 400 });
  }

  const allowedFields = [
    "dietDone",
    "workout1Done",
    "workout1Outdoor",
    "workout2Done",
    "workout2Outdoor",
    "readingDone",
    "photoDone",
  ] as const;

  const updates: Record<string, boolean> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = Boolean(body[field]);
    }
  }

  if (Object.keys(updates).length > 0) {
    db.update(days).set(updates).where(eq(days.id, day.id)).run();
  }

  const updated = db.query.days.findFirst({ where: eq(days.id, day.id) }).sync();
  return Response.json({ day: updated });
}
