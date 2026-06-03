import { db } from "@/db";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const active = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (!active) {
    return Response.json({ error: "No active challenge" }, { status: 400 });
  }

  db.update(challenges)
    .set({ status: "failed", failedAt: new Date().toISOString() })
    .where(eq(challenges.id, active.id))
    .run();

  return Response.json({ success: true });
}
