import { db } from "@/db";
import { books } from "@/db/schema";
import { BookList } from "@/components/books/book-list";

export const dynamic = "force-dynamic";

export default function BooksPage() {
  const allBooks = db.query.books.findMany().sync();

  return (
    <div className="mx-auto max-w-lg px-4 pt-8">
      <h1 className="mb-6 font-heading text-2xl font-800 text-foreground">
        Books
      </h1>
      <BookList books={allBooks} />
    </div>
  );
}
