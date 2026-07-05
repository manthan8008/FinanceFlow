import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Plus } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import { financeService } from "../services/financeService.js";
import { categories } from "../data/demoData.js";
import { formatCurrency, percent } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Budgets() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ category: "Food", limit: "", period: "monthly" });
  const { user } = useAuth();

  useEffect(() => {
    financeService.budgets().then((response) => setItems(response.data));
  }, []);

  async function addBudget(event) {
    event.preventDefault();
    const { data } = await financeService.createBudget({ ...form, limit: Number(form.limit), spent: 0 });
    setItems((current) => [data, ...current]);
    setForm({ ...form, limit: "" });
    toast.success("Budget added");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <form onSubmit={addBudget} className="panel space-y-4">
        <h2 className="text-xl font-bold">Create budget</h2>
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <input className="input" type="number" placeholder="Monthly limit" required value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
        <select className="input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
        <button className="btn-primary w-full"><Plus size={18} /> Add budget</button>
      </form>
      <section className="grid gap-4 md:grid-cols-2">
        {items.map((budget) => {
          const used = percent(budget.spent, budget.limit);
          return (
            <div key={budget.id || budget._id} className="panel">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold">{budget.category}</p>
                  <p className="mt-1 text-sm text-zinc-500">{formatCurrency(budget.spent, user?.currency)} of {formatCurrency(budget.limit, user?.currency)}</p>
                </div>
                {used > 100 && <span className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700"><AlertTriangle size={18} /></span>}
              </div>
              <div className="mt-5"><ProgressBar value={used} tone={used > 100 ? "bg-coral" : "bg-mint"} /></div>
              <div className="mt-3 flex justify-between text-sm font-semibold"><span>{used}% used</span><span>{formatCurrency(Math.max(0, budget.limit - budget.spent), user?.currency)} left</span></div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
