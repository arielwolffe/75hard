import { db } from "@/db";
import { days, dayPhotos, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { deletePhoto } from "@/lib/spaces";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ dayNumber: string; photoId: string }> }
) {
  const { dayNumber, photoId } = await params;
  const num = parseInt(dayNumber, 10);
  const id = parseInt(photoId, 10);

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

  const photo = db.query.dayPhotos.findFirst({
    where: and(eq(dayPhotos.id, id), eq(dayPhotos.dayId, day.id)),
  }).sync();
  if (!photo) {
    return Response.json({ error: "Photo not found" }, { status: 404 });
  }

  await deletePhoto(photo.key);
  db.delete(dayPhotos).where(eq(dayPhotos.id, id)).run();

  const remaining = db.query.dayPhotos.findMany({
    where: eq(dayPhotos.dayId, day.id),
  }).sync();
  if (remaining.length === 0) {
    db.update(days).set({ photoDone: false }).where(eq(days.id, day.id)).run();
  }

  return Response.json({ success: true });
}
