import { db } from "@/db";
import { days, dayPhotos, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { uploadPhoto, deletePhoto } from "@/lib/spaces";

export async function POST(
  request: Request,
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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const angle = formData.get("angle") as string | null;

  if (!file || !angle || !["front", "back", "side"].includes(angle)) {
    return Response.json({ error: "Missing file or invalid angle" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.type === "image/png" ? "png" : "jpg";
  const key = `challenge-${challenge.id}/day-${num}/${angle}.${ext}`;

  const existing = db.query.dayPhotos.findFirst({
    where: and(eq(dayPhotos.dayId, day.id), eq(dayPhotos.angle, angle as "front" | "back" | "side")),
  }).sync();
  if (existing) {
    await deletePhoto(existing.key);
    db.delete(dayPhotos).where(eq(dayPhotos.id, existing.id)).run();
  }

  const url = await uploadPhoto(buffer, key);

  const photo = db
    .insert(dayPhotos)
    .values({
      dayId: day.id,
      angle: angle as "front" | "back" | "side",
      url,
      key,
      uploadedAt: new Date().toISOString(),
    })
    .returning()
    .get();

  const photoCount = db.query.dayPhotos.findMany({
    where: eq(dayPhotos.dayId, day.id),
  }).sync().length;

  if (photoCount >= 1 && !day.photoDone) {
    db.update(days).set({ photoDone: true }).where(eq(days.id, day.id)).run();
  }

  return Response.json({ photo });
}
