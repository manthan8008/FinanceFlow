import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Bot,
  CalendarDays,
  ChartPie,
  CreditCard,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PiggyBank,
  ReceiptText,
  Settings,
  Sun,
  User,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

const nav = [
  ["/app", LayoutDashboard, "Dashboard"],
  ["/app/expenses", ReceiptText, "Expenses"],
  ["/app/income", WalletCards, "Income"],
  ["/app/budgets", PiggyBank, "Budgets"],
  ["/app/goals", Flag, "Goals"],
  ["/app/assistant", Bot, "AI Assistant"],
  ["/app/profile", User, "Profile"],
  ["/app/settings", Settings, "Settings"],
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const sidebar = (
    <aside className="flex h-full w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-950 md:w-72">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2 text-lg font-extrabold">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-white dark:bg-white dark:text-ink">
            <CreditCard size={20} />
          </span>
          <span className="truncate">FinanceFlow</span>
        </div>
        <button
          className="shrink-0 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="mt-8 grid gap-1">
        {nav.map(([to, Icon, label]) => (
          <NavLink
            key={to}
            end={to === "/app"}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"}`
            }
          >
            <Icon className="shrink-0" size={18} />{" "}
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-zinc-100 p-3 dark:bg-white/10">
        <p className="font-bold text-ink dark:text-white">
          {user?.name || "Finance user"}
        </p>
        <p className="truncate text-xs text-zinc-500">{user?.email}</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-cloud text-ink dark:bg-zinc-900 dark:text-white">
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        {sidebar}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <div className="h-full">{sidebar}</div>
        </div>
      )}
      <main className="md:pl-72">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-zinc-200 bg-cloud/80 px-3 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-900/80 sm:gap-3 sm:px-4">
          <button
            className="btn-secondary shrink-0 px-3 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <p className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:block">
              Welcome back
            </p>
            <h1 className="truncate text-base font-extrabold sm:text-xl">
              Your financial command center
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              className="btn-secondary px-3"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="btn-secondary px-3"
              onClick={() => navigate("/app/notifications")}
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <button
              className="btn-secondary px-3"
              onClick={() => logout()}
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
