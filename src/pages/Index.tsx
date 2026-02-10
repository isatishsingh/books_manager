import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusCircle, Eye, Pencil, Trash2, Loader2, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { getBooks, deleteBook, type Book } from "@/services/bookService";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPageParam = Number(searchParams.get("page") ?? "1");
  const initialPage = Number.isNaN(initialPageParam) || initialPageParam < 1 ? 1 : initialPageParam;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 5;

  const totalPages = Math.max(1, Math.ceil(books.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const paginatedBooks = books.slice(startIndex, startIndex + pageSize);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBooks(); // API call to get books from the database
      setBooks(data); // set the books to the state
    } catch {
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteBook(deleteId);
      setBooks((prev) => prev.filter((b) => b.id !== deleteId));
      toast({ title: "Book deleted", description: "The book has been removed." });
    } catch {
      toast({ title: "Error", description: "Failed to delete book.", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Library className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Book Inventory</h1>
        </div>
        <Button asChild>
          <Link to="/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
          {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={fetchBooks}>Retry</Button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No books yet. Add your first book to get started!</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="rounded-lg border bg-card overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Publisher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBooks.map((book) => (
                <TableRow key={book.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    {book.title}
                    <span className="block sm:hidden text-xs text-muted-foreground mt-1">
                      {book.author}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{book.author}</TableCell>
                  <TableCell className="hidden md:table-cell">{book.publisher}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" title="View">
                        <Link to={`/books?page=${currentPageSafe}&id=${book.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" title="Edit">
                        <Link to={`/edit/${book.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteId(book.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && !error && books.length > 0 && totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => {
                      const next = Math.max(1, p - 1);
                      if (next === 1) {
                        setSearchParams({});
                      } else {
                        setSearchParams({ page: String(next) });
                      }
                      return next;
                    });
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPageSafe}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                        if (page === 1) {
                          setSearchParams({});
                        } else {
                          setSearchParams({ page: String(page) });
                        }
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => {
                      const next = Math.min(totalPages, p + 1);
                      if (next === 1) {
                        setSearchParams({});
                      } else {
                        setSearchParams({ page: String(next) });
                      }
                      return next;
                    });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
