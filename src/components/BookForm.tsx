import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { bookFormSchema, type BookFormValues } from "@/lib/bookSchema";

interface BookFormProps {
  defaultValues?: BookFormValues;
  onSubmit: (values: BookFormValues) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
}

const BookForm = ({ defaultValues, onSubmit, submitLabel, loading }: BookFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: defaultValues ?? {
      title: "", author: "", publishedDate: "", publisher: "", overview: "", age: 0, email: "",
    },
  });

  const fieldClass = (hasError: boolean) =>
    hasError ? "border-destructive focus-visible:ring-destructive" : "";

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} className={fieldClass(!!errors.title)} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" {...register("author")} className={fieldClass(!!errors.author)} />
        {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="publishedDate">Published Date</Label>
          <Input id="publishedDate" type="date" max={today} {...register("publishedDate")} className={fieldClass(!!errors.publishedDate)} />
          {errors.publishedDate && <p className="text-sm text-destructive">{errors.publishedDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" {...register("age")} className={fieldClass(!!errors.age)} />
          {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publisher">Publisher</Label>
        <Input id="publisher" {...register("publisher")} className={fieldClass(!!errors.publisher)} />
        {errors.publisher && <p className="text-sm text-destructive">{errors.publisher.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} className={fieldClass(!!errors.email)} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="overview">Overview</Label>
        <Textarea id="overview" rows={4} {...register("overview")} className={fieldClass(!!errors.overview)} />
        {errors.overview && <p className="text-sm text-destructive">{errors.overview.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Cancel</Link>
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
