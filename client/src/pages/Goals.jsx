import { useEffect, useState } from "react";
import { Flag, Plus } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import { financeService } from "../services/financeService.js";
import { formatCurrency, percent } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const goalTypes = ["Emergency Fund", "Vacation Fund", "Car Fund", "Home Fund", "Investment Goal", "Custom Goal"];

export default function Goals() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: "Emergency Fund", name: "", targetAmount: "", currentAmount: "", deadline: "" });
  const { user } = useAuth();

  useEffect(() => {
    financeService.goals().then((response) => setItems(response.data));
  }, []);

  async function addGoal(event) {
    event.preventDefault();
    const { data } = await financeService.createGoal({ ...form, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount || 0) });
    setItems((current) => [data, ...current]);
    setForm({ type: "Emergency Fund", name: "", targetAmount: "", currentAmount: "", deadline: "" });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={addGoal} className="panel space-y-4">
        <h2 className="text-xl font-bold">New financial goal</h2>
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{goalTypes.map((type) => <option key={type}>{type}</option>)}</select>
        <input className="input" placeholder="Goal name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" type="number" placeholder="Target amount" required value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
          <input className="input" type="number" placeholder="Current amount" value={form.currentAmount} onChange={(e) => setForm({ ...form, currentAmount: e.target.value })} />
        </div>
        <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        <button className="btn-primary w-full"><Plus size={18} /> Add goal</button>
      </form>
      <section className="space-y-4">
        {items.map((goal) => {
          const done = percent(goal.currentAmount, goal.targetAmount);
          return (
            <div key={goal.id || goal._id} className="panel">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-sky-100 text-sky-700"><Flag size={20} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-bold">{goal.name}</h3><span className="text-sm font-semibold">{done}%</span></div>
                  <p className="text-sm text-zinc-500">{goal.type} · target {formatCurrency(goal.targetAmount, user?.currency)}</p>
                </div>
              </div>
              <div className="mt-5"><ProgressBar value={done} tone="bg-skybrand" /></div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
