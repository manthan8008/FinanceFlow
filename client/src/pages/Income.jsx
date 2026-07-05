import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { financeService } from "../services/financeService.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const types = ["Salary", "Freelance", "Business", "Investment", "Gifts", "Other"];

export default function Income() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ source: "", amount: "", category: "Salary", date: new Date().toISOString().slice(0, 10), notes: "" });
  const { user } = useAuth();
  useEffect(() => { financeService.incomes().then((response) => setItems(response.data)); }, []);
  async function add(event) {
    event.preventDefault();
    const { data } = await financeService.createIncome({ ...form, amount: Number(form.amount) });
    setItems((current) => [data, ...current]);
    setForm({ ...form, source: "", amount: "", notes: "" });
    toast.success("Income added");
  }
  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={add} className="panel space-y-4"><h2 className="text-xl font-bold">Add income</h2><input className="input" placeholder="Source" required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /><input className="input" type="number" placeholder="Amount" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{types.map((item) => <option key={item}>{item}</option>)}</select><input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /><textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /><button className="btn-primary w-full"><Plus size={18} /> Add income</button></form>
      <section className="panel"><h2 className="text-xl font-bold">Income streams</h2><div className="mt-5 grid gap-3">{items.map((item) => <div key={item.id || item._id} className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 dark:bg-white/10"><div><p className="font-bold">{item.source}</p><p className="text-sm text-zinc-500">{item.category} · {formatDate(item.date)}</p></div><p className="font-extrabold text-emerald-600">{formatCurrency(item.amount, user?.currency)}</p></div>)}</div></section>
    </div>
  );
}
