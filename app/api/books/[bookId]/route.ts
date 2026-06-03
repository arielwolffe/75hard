import { db } from "@/db";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  const id = parseInt(bookId, 10);
  const body = await request.json();

  const book = db.query.books.findFirst({ where: eq(books.id, id) }).sync();
  if (!book) {
    return Response.json({ error: "Book not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if ("title" in body) updates.title = body.title;
  if ("author" in body) updates.author = body.author;
  if ("totalPages" in body) updates.totalPages = body.totalPages;
  if ("status" in body) updates.status = body.status;

  if (Object.keys(updates).length > 0) {
    db.update(books).set(updates).where(eq(books.id, id)).run();
  }

  const updated = db.query.books.findFirst({ where: eq(books.id, id) }).sync();
  return Response.json({ book: updated });
}
