import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Edit2, Plus, Save, Trash2, X } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import { financeService } from "../services/financeService.js";
import { categories } from "../data/demoData.js";
import { formatCurrency, percent } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const emptyForm = { category: "Food", limit: "", spent: "", period: "monthly" };

function getItemId(item) {
  return item.id || item._id;
}

export default function Budgets() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    financeService.budgets().then((response) => setItems(response.data));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editBudget(budget) {
    setEditingId(getItemId(budget));
    setForm({
      category: budget.category || "Food",
      limit: budget.limit ?? "",
      spent: budget.spent ?? "",
      period: budget.period || "monthly",
    });
  }

  async function saveBudget(event) {
    event.preventDefault();
    const payload = {
      ...form,
      limit: Number(form.limit),
      spent: Number(form.spent || 0),
    };

    if (editingId) {
      const { data } = await financeService.updateBudget(editingId, payload);
      setItems((current) => current.map((item) => (getItemId(item) === editingId ? data : item)));
      toast.success("Budget updated");
    } else {
      const { data } = await financeService.createBudget(payload);
      setItems((current) => [data, ...current.filter((item) => !(item.category === data.category && item.period === data.period))]);
      toast.success("Budget added");
    }

    resetForm();
  }

  async function deleteBudget(id) {
    await financeService.deleteBudget(id);
    setItems((current) => current.filter((item) => getItemId(item) !== id));
    if (editingId === id) resetForm();
    toast.success("Budget deleted");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <form onSubmit={saveBudget} className="panel space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{editingId ? "Edit budget" : "Create budget"}</h2>
          {editingId && <button type="button" className="btn-secondary px-3" onClick={resetForm} aria-label="Cancel editing"><X size={18} /></button>}
        </div>
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <input className="input" type="number" min="0" step="0.01" placeholder="Budget limit" required value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
        <input className="input" type="number" min="0" step="0.01" placeholder="Spent so far" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} />
        <select className="input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
        <button className="btn-primary w-full">{editingId ? <Save size={18} /> : <Plus size={18} />} {editingId ? "Save budget" : "Add budget"}</button>
      </form>
      <section className="grid gap-4 md:grid-cols-2">
        {items.map((budget) => {
          const id = getItemId(budget);
          const used = percent(budget.spent, budget.limit);
          return (
            <div key={id} className="panel">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-lg font-bold">{budget.category}</p>
                  <p className="mt-1 text-sm text-zinc-500">{formatCurrency(budget.spent, user?.currency)} of {formatCurrency(budget.limit, user?.currency)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {used > 100 && <span className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700"><AlertTriangle size={18} /></span>}
                  <button type="button" className="btn-secondary px-3 py-2" onClick={() => editBudget(budget)} aria-label={`Edit ${budget.category} budget`}><Edit2 size={16} /></button>
                  <button type="button" className="btn-secondary px-3 py-2 text-rose-600" onClick={() => deleteBudget(id)} aria-label={`Delete ${budget.category} budget`}><Trash2 size={16} /></button>
                </div>
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
