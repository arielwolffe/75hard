# 75 Hard Personal Tracker — Implementation Plan

## Context

Building a personal 75 Hard challenge tracker web app. Single-user, no auth, hosted on Digital Ocean with photo storage on DO Spaces (already available). The app needs to be encouraging, modern, and feminine in its visual design.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14+ (App Router) | Full-stack in one deployable unit |
| Database | SQLite via better-sqlite3 | Zero infra, single file, perfect for single-user |
| ORM | Drizzle ORM | Lightweight, type-safe, great SQLite support |
| Styling | Tailwind CSS | Required |
| Fonts | Sora (headings) + Inter (body) via `next/font` | Modern, bold, clean |
| File Upload | `@aws-sdk/client-s3` → DO Spaces | Server-side upload, simple |
| Image Processing | `sharp` | Resize/compress before upload |
| Deployment | DO App Platform or Droplet + Docker | Persistent volume for SQLite |

---

## Database Schema (6 tables)

- **challenge** — id, start_date, status (active/completed/failed), created_at, failed_at
- **days** — id, challenge_id, day_number (1-75), date, diet_done, workout1_done, workout1_outdoor, workout2_done, workout2_outdoor, water_ml, reading_done, photo_done, completed, completed_at
- **day_photos** — id, day_id, angle (front/back/side), url, key, uploaded_at
- **water_logs** — id, day_id, amount_ml (250/500/1000), logged_at
- **books** — id, title, author, total_pages, status (reading/finished), created_at
- **reading_logs** — id, day_id, book_id, pages_read, logged_at

---

## Route Structure

```
/                    → Redirect to /challenge or /start
/start               → Set start date, begin challenge
/challenge           → Calendar grid (75-day overview)
/challenge/day/[n]   → Daily checklist, water tracker, reading, photos
/photos              → Day 1 vs latest photo comparison
/books               → Book management + reading history
```

---

## Day Awareness & Missed Day Flow

The app always knows what day it is relative to the challenge start date. This is critical for the 75 Hard rules.

### How the app tracks "today"

- On every page load, compute `currentDayNumber = daysSince(challenge.start_date) + 1`
- The calendar always highlights "today" and shows which day number you're on
- The nav prominently displays "Day X of 75" with today's date

### Missed day detection & confirmation

When the app detects a gap (days between the last completed day and today), it does NOT auto-fail. Instead:

1. **On next visit**, a modal appears: "It looks like you didn't complete Day X (June 5). Did you miss it, or did you just forget to log?"
2. **Two options:**
   - **"I forgot to log — let me check it off now"** → Opens that past day's checklist so you can retroactively mark items complete. You can still complete past days (within reason).
   - **"I missed it — restart"** → Marks the challenge as failed, records which day broke the streak, and prompts to start a new challenge.
3. **Multiple missed days**: If several days are missed, the modal walks through them one at a time (oldest first). You can retroactively complete each one, or choose to restart at any point.
4. **Grace window**: Past days can be completed retroactively (they just need all items checked off). The app doesn't impose a time limit on this — you decide honestly.

### What "completing a day" means

- All checklist items must be marked done (diet, both workouts, water ≥ 3785ml, reading, at least one photo uploaded)
- The "Complete Day" button seals it — after completion, the day is locked (view-only)
- Days must be completed in order (you can't skip ahead to Day 10 without completing 1-9)

---

## Key Features & Components

### Calendar Grid (`/challenge`)
- 75-day grid with color-coded cells: complete (mint), today (lavender highlight), future (gray), needs attention/past-incomplete (blush)
- Overall progress bar + "Day X of 75" header with today's date
- Each cell links to that day's checklist
- Incomplete past days are visually flagged (soft warning, not aggressive)

### Daily Checklist (`/challenge/day/[n]`)
- Toggle items: Diet, Workout 1 (+ outdoor toggle), Workout 2 (+ outdoor toggle), Reading, Photos
- Water tracker (inline): progress bar filling to 3785ml, quick-add buttons (+250ml, +500ml, +1000ml), undo last
- Photo uploader: 3 slots (front, back, side) with drag-drop/tap
- Reading log: select current book, log pages read
- "Complete Day" button (enabled when all tasks done)
- For past days: shows "Retroactive completion" badge, still fully functional

### Water Tracker
- Horizontal fill bar with gradient (light sky → deeper blue)
- Displays current ml / 3785ml and percentage
- Quick-add buttons, log list with timestamps, undo

### Photo Comparison (`/photos`)
- Side-by-side: Day 1 photos on left, selectable "latest" day on right
- Three rows: front, back, side
- Day navigator to browse through days

### Book Log (`/books`)
- Add/edit books, track reading/finished status
- Per-day reading entries linked to books

---

## Photo Upload Flow

1. Client sends file via FormData to `/api/days/[n]/photos`
2. Server resizes with `sharp` (max 1200px, 80% JPEG)
3. Server uploads to DO Spaces via `@aws-sdk/client-s3`
4. Key format: `75hard/challenge-{id}/day-{n}/{angle}.jpg`
5. CDN URL stored in database

---

## Design System

**Colors (soft pastel, feminine):**
- blush (pink), lavender (purple), mint (green), sky (blue), peach (orange)
- cream/soft background (`#faf8f5`)

**Fonts:** Sora 600-800 for headings, Inter 400-500 for body

**Aesthetic:** Rounded corners, soft shadows, generous whitespace, encouraging copy, celebration animations on milestones

---

## Project Structure

```
75hard/
├── app/              # Pages + API routes (Next.js App Router)
├── components/       # UI components (ui/, layout/, calendar/, checklist/, water/, photos/, books/)
├── db/               # schema.ts, index.ts, migrations/
├── lib/              # spaces.ts, dates.ts, constants.ts, utils.ts
├── public/           # Static assets
├── tailwind.config.ts
├── drizzle.config.ts
├── Dockerfile
└── .env.local
```

---

## Build Order

1. Project scaffold — create-next-app, Tailwind, fonts, layout, color system
2. Database — Drizzle schema + migrations + connection
3. Challenge management — start page, create/restart APIs
4. Calendar view — grid, day cells, status logic
5. Daily checklist — toggles, PATCH API, completion
6. Water tracker — increment buttons, progress bar, undo
7. Photo upload — DO Spaces integration, uploader UI
8. Photo comparison — side-by-side view, day selector
9. Book log — CRUD, reading entries
10. Missed day detection & confirmation modal
11. Polish — animations, encouraging messages, responsive design
12. Deployment — Dockerfile, persistent volume, env vars

---

## Verification

- Run `npm run dev` and walk through: start challenge → complete a day → upload photos → log water → log reading → view calendar → view photo comparison
- Test missed day flow: skip a day, verify modal appears, test both "log retroactively" and "restart" paths
- Test photo upload end-to-end with actual DO Spaces credentials
- Verify responsive design on mobile viewport
- Build Docker image and test locally before deploying
