# BookShelf – Books Manager

A simple, modern **book inventory management** app built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui.

You can use it to:

- Keep a small catalog of books
- Add, edit, or delete books
- View detailed information about each book
- Browse the list with simple pagination

Everything runs fully in the browser using an in-memory data store (no real backend or database), which makes it great for demos, learning, or small local tools.

---

## 1. Requirements

- **Node.js**: v18 or higher (recommended)
- **npm**: v9 or higher (comes with Node)
- A modern browser (Chrome, Edge, Firefox, etc.)

You can check your versions with:

```bash
node -v
npm -v
```

---

## 2. Getting started

From the root of the project (`books-manager`):

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

The dev server supports hot reloading, so changes you make in the code will automatically refresh the page.

---

## 3. Available scripts

All scripts are defined in `package.json` and run from the project root.

- **Start dev server**

  ```bash
  npm run dev
  ```

- **Build for production**

  ```bash
  npm run build
  ```

- **Build for development mode** (useful for debugging production build)

  ```bash
  npm run build:dev
  ```

- **Preview the production build**

  (Builds if needed, then serves the built assets)

  ```bash
  npm run preview
  ```

- **Run ESLint**

  ```bash
  npm run lint
  ```

---

## 4. How the app works

### 4.1 Pages & routing

Routing is handled with `react-router-dom` in `src/App.tsx`:

- `/` – **Book list** (home page)  
  Shows a paginated table of books with actions to view, edit, and delete.

- `/books?id={id}&page={page}` – **Book details**  
  Shows a full view of a single book (title, author, publisher, overview, etc.).

- `/add` – **Add book**  
  Displays a form for creating a new book.

- `/edit/:id` – **Edit book**  
  Displays a form pre-filled with the selected book for editing.

- Any other path – **Not found** page.


### 4.2 Data model & "API"

There is no real backend; instead, the app uses an **in-memory array** as a fake database:

- Defined in `src/services/bookService.ts`
- Exposes functions such as:
  - `getBooks()`
  - `getBookById(id)`
  - `addBook(book)`
  - `updateBook(id, data)`
  - `deleteBook(id)`

These functions return Promises to mimic asynchronous API calls. Data is reset whenever you reload the browser (because it only lives in memory).

### 4.3 Forms & validation

Book forms are implemented in:

- `src/components/BookForm.tsx`
- Validation schema in `src/lib/bookSchema.ts` using **zod**
- `react-hook-form` is used to manage form state

Key validations include:

- Required fields: title, author, publisher, overview, email, published date
- Email must be a valid email address
- Age must be a non-negative integer
- Published date cannot be in the future

Validation errors are shown inline under each field.

### 4.4 Book list & pagination

The main list page (`src/pages/Index.tsx`) uses:

- A table (shadcn-ui) to display books
- Client-side pagination (page size: 5 items)
- URL query parameter `?page=` to keep the current page in the address bar
- Buttons to:
  - **View** a book (navigates to `/books?id=...`)
  - **Edit** a book
  - **Delete** a book with a confirmation dialog

### 4.5 Notifications & UI

The app uses:

- `@tanstack/react-query` for query client setup (ready for real APIs)
- `sonner` and shadcn's `Toaster` for toast notifications
- `lucide-react` for icons
- Tailwind CSS + shadcn-ui components for styling

---

## 5. Project structure (high level)

Only the most relevant folders are shown here:

```text
books-manager/
  public/
  src/
    components/
      BookForm.tsx
      layout/
      ui/           # shadcn-ui components (buttons, inputs, dialogs, etc.)
    lib/
      bookSchema.ts # zod schema & types for the book form
    pages/
      Index.tsx     # list & pagination
      BookDetails.tsx
      AddBook.tsx
      EditBook.tsx
      NotFound.tsx
    services/
      bookService.ts # in-memory "API" for books
    App.tsx
    main.tsx
  vite.config.ts
  package.json
  README.md
```

---

## 6. Typical usage flow

1. **Start the app**
   - Run `npm install`
   - Run `npm run dev`
   - Open `http://localhost:3000`

2. **Browse the list**
   - See the seeded books in a table
   - Use pagination controls at the bottom to move between pages

3. **Add a new book**
   - Click **"Add Book"**
   - Fill in the form fields
   - Submit; you should see a success notification and the new book in the list

4. **View details**
   - Click the **eye** icon in the actions column
   - See the full details of the selected book

5. **Edit a book**
   - From the list or detail page, click **Edit**
   - Adjust the data and save

6. **Delete a book**
   - Click the **trash** icon
   - Confirm in the dialog; the book will be removed from the list

Remember: data lives only in memory, so refreshing the browser will restore the initial seed data.

---

## 7. Customization & next steps

Some ideas for extending this project:

- Replace the in-memory `bookService` with real API calls (REST or GraphQL)
- Persist data to a real database (e.g., PostgreSQL, MongoDB, etc.)
- Add search and filtering for large book collections
- Add authentication/authorization around CRUD operations
- Add more fields (ISBN, genres, tags, cover images)

---

## 8. Troubleshooting

- **Port already in use (3000)**  
  Another process is using port 3000. Stop it or change the port in `vite.config.ts`.

- **`npm install` fails**  
  Make sure your Node.js and npm versions meet the requirements listed above.

- **Blank page or runtime error in the browser**  
  - Check the browser console for errors
  - Make sure you ran `npm install` successfully
  - Restart the dev server: `Ctrl + C` then `npm run dev`

If you run into issues that this README does not cover, feel free to inspect the source files under `src/`—the code is organized to be easy to read and modify.