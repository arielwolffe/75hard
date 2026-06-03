import { db } from "@/db";
import { challenges, days, dayPhotos, waterLogs, books, readingLogs } from "@/db/schema";
import fs from "fs";
import path from "path";

export async function POST() {
  // Delete all data in dependency order
  db.delete(readingLogs).run();
  db.delete(waterLogs).run();
  db.delete(dayPhotos).run();
  db.delete(days).run();
  db.delete(books).run();
  db.delete(challenges).run();

  // Delete all uploaded photos from disk
  const photosDir = path.join(process.env.DATA_PATH || "./data", "photos");
  if (fs.existsSync(photosDir)) {
    fs.rmSync(photosDir, { recursive: true, force: true });
  }

  return Response.json({ success: true });
}
