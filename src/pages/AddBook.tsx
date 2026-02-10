import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addBook } from "@/services/bookService";
import BookForm from "@/components/BookForm";
import type { BookFormValues } from "@/lib/bookSchema";

const AddBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: BookFormValues) => {
    try {
      setLoading(true);
      await addBook(values as Required<BookFormValues>);
      toast({ title: "Book added", description: `"${values.title}" has been added.` });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to add book.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <PlusCircle className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
      </div>
      <BookForm onSubmit={handleSubmit} submitLabel="Add Book" loading={loading} />
    </div>
  );
};

export default AddBook;
