export interface Book {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  overview: string;
  age: number;
  email: string;
}

let books: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    publishedDate: "2008-08-01",
    publisher: "Prentice Hall",
    overview: "A handbook of agile software craftsmanship.",
    age: 15,
    email: "clean@books.com",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    publishedDate: "2018-10-16",
    publisher: "Penguin",
    overview: "An easy & proven way to build good habits.",
    age: 5,
    email: "atomic@books.com",
  },
  {
    id: 3,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    publishedDate: "1999-10-20",
    publisher: "Addison-Wesley",
    overview: "Your journey to mastery in software development.",
    age: 26,
    email: "pragmatic@books.com",
  },
  {
    id: 4,
    title: "Deep Work",
    author: "Cal Newport",
    publishedDate: "2016-01-05",
    publisher: "Grand Central Publishing",
    overview: "Rules for focused success in a distracted world.",
    age: 10,
    email: "deepwork@books.com",
  },
  {
    id: 5,
    title: "Refactoring",
    author: "Martin Fowler",
    publishedDate: "2018-11-20",
    publisher: "Addison-Wesley",
    overview: "Improving the design of existing code.",
    age: 7,
    email: "refactoring@books.com",
  },
  {
    id: 5,
    title: "Refactoring",
    author: "Martin Fowler",
    publishedDate: "2018-11-20",
    publisher: "Addison-Wesley",
    overview: "Improving the design of existing code.",
    age: 7,
    email: "refactoring@books.com",
  },
];

// Simulate async API calls
export const getBooks = (): Promise<Book[]> =>
  Promise.resolve([...books]);

export const getBookById = (id: number): Promise<Book | undefined> =>
  Promise.resolve(books.find((b) => b.id === id));

export const addBook = (book: Omit<Book, "id">): Promise<Book> => {
  const newBook: Book = { ...book, id: Math.max(0, ...books.map((b) => b.id)) + 1 };
  books = [...books, newBook];
  return Promise.resolve(newBook);
};

export const updateBook = (id: number, data: Partial<Omit<Book, "id">>): Promise<Book | undefined> => {
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return Promise.resolve(undefined);
  books[idx] = { ...books[idx], ...data };
  return Promise.resolve({ ...books[idx] });
};

export const deleteBook = (id: number): Promise<boolean> => {
  const len = books.length;
  books = books.filter((b) => b.id !== id);
  return Promise.resolve(books.length < len);
};
