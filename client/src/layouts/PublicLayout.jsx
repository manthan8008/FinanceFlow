import { Outlet, Link, NavLink } from "react-router-dom";
import { Moon, Sun, WalletCards } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-cloud text-ink dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-white dark:bg-white dark:text-ink"><WalletCards size={20} /></span>
            
          </Link>
          <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-3" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
            <Link className="btn-secondary" to="/login">Login</Link>
            <Link className="btn-primary" to="/register">Start free</Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
