import { db } from "@/db";
import { books } from "@/db/schema";

export async function GET() {
  const allBooks = db.query.books.findMany().sync();
  return Response.json({ books: allBooks });
}

export async function POST(request: Request) {
  const { title, author, totalPages } = await request.json();

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const result = db
    .insert(books)
    .values({
      title,
      author: author || null,
      totalPages: totalPages || null,
      status: "reading",
      createdAt: new Date().toISOString(),
    })
    .returning()
    .all();

  return Response.json({ book: result[0] });
}
