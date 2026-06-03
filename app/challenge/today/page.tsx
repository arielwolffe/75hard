import { db } from "@/db";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDayNumber } from "@/lib/dates";
import { TOTAL_DAYS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  const challenge = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (!challenge) {
    redirect("/start");
  }

  const currentDay = Math.min(getDayNumber(challenge.startDate), TOTAL_DAYS);
  redirect(`/challenge/day/${currentDay}`);
}
