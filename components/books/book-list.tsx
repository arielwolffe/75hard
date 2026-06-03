"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Book {
  id: number;
  title: string;
  author: string | null;
  totalPages: number | null;
  status: string;
  createdAt: string;
}

export function BookList({ books: initialBooks }: { books: Book[] }) {
  const router = useRouter();
  const [books, setBooks] = useState(initialBooks);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [saving, setSaving] = useState(false);

  async function addBook() {
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        author: author.trim() || null,
        totalPages: totalPages ? parseInt(totalPages) : null,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setBooks((prev) => [...prev, data.book]);
      setTitle("");
      setAuthor("");
      setTotalPages("");
      setShowForm(false);
    }
    setSaving(false);
  }

  async function markFinished(bookId: number) {
    const res = await fetch(`/api/books/${bookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "finished" }),
    });
    if (res.ok) {
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, status: "finished" } : b))
      );
    }
  }

  const reading = books.filter((b) => b.status === "reading");
  const finished = books.filter((b) => b.status === "finished");

  return (
    <div className="space-y-6">
      {reading.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-sm font-700 uppercase tracking-wide text-lavender-600">
            Currently Reading
          </h2>
          <div className="space-y-2">
            {reading.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div>
                  <p className="font-semibold text-foreground">{book.title}</p>
                  {book.author && (
                    <p className="text-xs text-foreground/50">{book.author}</p>
                  )}
                </div>
                <button
                  onClick={() => markFinished(book.id)}
                  className="rounded-lg bg-mint-50 px-3 py-1 text-xs font-semibold text-mint-600 ring-1 ring-mint-200 hover:bg-mint-100"
                >
                  Finished
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-sm font-700 uppercase tracking-wide text-foreground/40">
            Finished
          </h2>
          <div className="space-y-2">
            {finished.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl bg-white/60 p-4 ring-1 ring-black/5"
              >
                <p className="font-semibold text-foreground/60">{book.title}</p>
                {book.author && (
                  <p className="text-xs text-foreground/30">{book.author}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showForm ? (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-blush-200 bg-blush-50 px-4 py-2 text-sm focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-200"
            />
            <input
              type="text"
              placeholder="Author (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl border border-blush-200 bg-blush-50 px-4 py-2 text-sm focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-200"
            />
            <input
              type="number"
              placeholder="Total pages (optional)"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              className="w-full rounded-xl border border-blush-200 bg-blush-50 px-4 py-2 text-sm focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-200"
            />
            <div className="flex gap-2">
              <button
                onClick={addBook}
                disabled={!title.trim() || saving}
                className="flex-1 rounded-xl bg-lavender-500 py-2 text-sm font-semibold text-white hover:bg-lavender-600 disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Book"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl px-4 py-2 text-sm text-foreground/50 hover:text-foreground/70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-2xl border-2 border-dashed border-blush-200 bg-blush-50/50 py-4 text-sm font-semibold text-foreground/40 transition-colors hover:border-lavender-300 hover:text-lavender-500"
        >
          + Add a book
        </button>
      )}
    </div>
  );
}
