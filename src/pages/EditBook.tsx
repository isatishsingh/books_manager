import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBookById, updateBook } from "@/services/bookService";
import BookForm from "@/components/BookForm";
import type { BookFormValues } from "@/lib/bookSchema";

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [defaults, setDefaults] = useState<BookFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const book = await getBookById(Number(id));
        if (!book) { setError("Book not found."); return; }
        setDefaults({
          title: book.title,
          author: book.author,
          publishedDate: book.publishedDate,
          publisher: book.publisher,
          overview: book.overview,
          age: book.age,
          email: book.email,
        });
      } catch {
        setError("Failed to load book.");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (values: BookFormValues) => {
    try {
      setLoading(true);
      await updateBook(Number(id), values);
      toast({ title: "Book updated", description: `"${values.title}" has been updated.` });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to update book.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !defaults) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        {error ?? "Book not found."}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Pencil className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
      </div>
      <BookForm defaultValues={defaults} onSubmit={handleSubmit} submitLabel="Update Book" loading={loading} />
    </div>
  );
};

export default EditBook;
