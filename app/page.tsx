import { db } from "@/db";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const active = db.query.challenges.findFirst({
    where: eq(challenges.status, "active"),
  }).sync();

  if (active) {
    redirect("/challenge");
  } else {
    redirect("/start");
  }
}
