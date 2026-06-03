import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const challenges = sqliteTable("challenges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startDate: text("start_date").notNull(),
  status: text("status", { enum: ["active", "completed", "failed"] })
    .notNull()
    .default("active"),
  createdAt: text("created_at").notNull(),
  failedAt: text("failed_at"),
});

export const days = sqliteTable("days", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  challengeId: integer("challenge_id")
    .notNull()
    .references(() => challenges.id),
  dayNumber: integer("day_number").notNull(),
  date: text("date").notNull(),
  dietDone: integer("diet_done", { mode: "boolean" }).notNull().default(false),
  workout1Done: integer("workout1_done", { mode: "boolean" })
    .notNull()
    .default(false),
  workout1Outdoor: integer("workout1_outdoor", { mode: "boolean" })
    .notNull()
    .default(false),
  workout2Done: integer("workout2_done", { mode: "boolean" })
    .notNull()
    .default(false),
  workout2Outdoor: integer("workout2_outdoor", { mode: "boolean" })
    .notNull()
    .default(false),
  waterMl: integer("water_ml").notNull().default(0),
  readingDone: integer("reading_done", { mode: "boolean" })
    .notNull()
    .default(false),
  photoDone: integer("photo_done", { mode: "boolean" })
    .notNull()
    .default(false),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),
});

export const dayPhotos = sqliteTable("day_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayId: integer("day_id")
    .notNull()
    .references(() => days.id),
  angle: text("angle", { enum: ["front", "back", "side"] }).notNull(),
  url: text("url").notNull(),
  key: text("key").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const waterLogs = sqliteTable("water_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayId: integer("day_id")
    .notNull()
    .references(() => days.id),
  amountMl: integer("amount_ml").notNull(),
  loggedAt: text("logged_at").notNull(),
});

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author"),
  totalPages: integer("total_pages"),
  status: text("status", { enum: ["reading", "finished"] })
    .notNull()
    .default("reading"),
  createdAt: text("created_at").notNull(),
});

export const readingLogs = sqliteTable("reading_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayId: integer("day_id")
    .notNull()
    .references(() => days.id),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id),
  pagesRead: integer("pages_read").notNull(),
  loggedAt: text("logged_at").notNull(),
});
