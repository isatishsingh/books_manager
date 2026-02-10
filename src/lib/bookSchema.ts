import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0); 

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  author: z.string().trim().min(1, "Author is required").max(200, "Author must be under 200 characters"),
  publishedDate: z.string().min(1, "Published date is required").refine((value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    date.setHours(0, 0, 0, 0);
    return date <= today;
  }, { message: "Published date cannot be in the future" }),
  publisher: z.string().trim().min(1, "Publisher is required").max(200, "Publisher must be under 200 characters"),
  overview: z.string().trim().min(1, "Overview is required").max(2000, "Overview must be under 2000 characters"),
  age: z.coerce.number({ invalid_type_error: "Age must be a number" }).int("Age must be an integer").min(0, "Age must be 0 or more"),
  email: z.string().trim().min(1, "Email is required").email("Must be a valid email").max(255, "Email must be under 255 characters"),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
