import { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { BookOpen, ArrowLeft, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookById, type Book } from "@/services/bookService";

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-3 border-b last:border-b-0">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="sm:col-span-2">{value}</span>
  </div>
);

const BookDetails = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const idParam = searchParams.get("id");
        const id = idParam ? Number(idParam) : NaN;
        if (!idParam || Number.isNaN(id)) {
          setError("Book not found.");
          setLoading(false);
          return;
        }

        const data = await getBookById(id);
        if (!data) { setError("Book not found."); return; }
        setBook(data);
      } catch {
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div>
        <Button asChild variant="ghost" className="mb-6">
          <Link
            to={{
              pathname: "/",
              search: location.search || undefined,
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
          {error ?? "Book not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" className="mb-6">
        <Link
          to={{
            pathname: "/",
            search: location.search || undefined,
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to={`/edit/${book.id}`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
        </Button>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <DetailRow label="Author" value={book.author} />
        <DetailRow label="Publisher" value={book.publisher} />
        <DetailRow label="Published Date" value={book.publishedDate} />
        <DetailRow label="Age" value={book.age} />
        <DetailRow label="Email" value={book.email} />
        <DetailRow label="Overview" value={book.overview} />
      </div>
    </div>
  );
};

export default BookDetails;
