import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-8">
      <Outlet />
    </main>
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      © 2026 BookShelf — Book Inventory Management System
    </footer>
  </div>
);

export default Layout;
