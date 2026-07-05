import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { financeService } from "../services/financeService.js";

export default function Notifications() {
  const [items, setItems] = useState([]);
  useEffect(() => { financeService.notifications().then((response) => setItems(response.data)); }, []);
  return (
    <section className="panel">
      <div className="flex items-center gap-3"><Bell className="text-gold" /><div><h2 className="text-xl font-bold">Notifications</h2><p className="text-sm text-zinc-500">Budget alerts, bill reminders, and goal milestones.</p></div></div>
      <div className="mt-6 grid gap-3">{items.map((item) => <div key={item.id || item._id} className={`rounded-2xl border p-4 ${item.read ? "border-zinc-100 bg-zinc-50 dark:border-white/10 dark:bg-white/5" : "border-sky-200 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10"}`}><p className="font-bold">{item.title}</p><p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.message}</p></div>)}</div>
    </section>
  );
}
