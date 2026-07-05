import { CalendarDays } from "lucide-react";
import { expenses, incomes } from "../data/demoData.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Calendar() {
  const { user } = useAuth();
  const events = [...expenses.map((item) => ({ ...item, type: "expense" })), ...incomes.map((item) => ({ ...item, title: item.source, type: "income" }))].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <section className="panel">
      <div className="flex items-center gap-3"><CalendarDays className="text-skybrand" /><div><h2 className="text-xl font-bold">Financial calendar</h2><p className="text-sm text-zinc-500">Recurring transactions, bills, and income events.</p></div></div>
      <div className="mt-6 grid gap-3">{events.map((event) => <div key={`${event.type}-${event.id}`} className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 dark:bg-white/10"><div><p className="font-bold">{event.title}</p><p className="text-sm text-zinc-500">{formatDate(event.date)}</p></div><span className={`font-extrabold ${event.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>{event.type === "income" ? "+" : "-"}{formatCurrency(event.amount, user?.currency)}</span></div>)}</div>
    </section>
  );
}
