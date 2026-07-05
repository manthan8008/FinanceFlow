import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Flag, Plus, Save, Trash2, X } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import { financeService } from "../services/financeService.js";
import { formatCurrency, percent } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const goalTypes = ["Emergency Fund", "Vacation Fund", "Car Fund", "Home Fund", "Investment Goal", "Custom Goal"];
const emptyForm = { type: "Emergency Fund", name: "", targetAmount: "", currentAmount: "", deadline: "" };

function getItemId(item) {
  return item.id || item._id;
}

export default function Goals() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    financeService.goals().then((response) => setItems(response.data));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editGoal(goal) {
    setEditingId(getItemId(goal));
    setForm({
      type: goal.type || "Emergency Fund",
      name: goal.name || "",
      targetAmount: goal.targetAmount ?? "",
      currentAmount: goal.currentAmount ?? "",
      deadline: goal.deadline?.slice(0, 10) || "",
    });
  }

  async function saveGoal(event) {
    event.preventDefault();
    const payload = { ...form, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount || 0) };

    if (editingId) {
      const { data } = await financeService.updateGoal(editingId, payload);
      setItems((current) => current.map((item) => (getItemId(item) === editingId ? data : item)));
      toast.success("Goal updated");
    } else {
      const { data } = await financeService.createGoal(payload);
      setItems((current) => [data, ...current]);
      toast.success("Goal added");
    }

    resetForm();
  }

  async function deleteGoal(id) {
    await financeService.deleteGoal(id);
    setItems((current) => current.filter((item) => getItemId(item) !== id));
    if (editingId === id) resetForm();
    toast.success("Goal deleted");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={saveGoal} className="panel space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{editingId ? "Edit goal" : "New financial goal"}</h2>
          {editingId && <button type="button" className="btn-secondary px-3" onClick={resetForm} aria-label="Cancel editing"><X size={18} /></button>}
        </div>
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{goalTypes.map((type) => <option key={type}>{type}</option>)}</select>
        <input className="input" placeholder="Goal name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" type="number" min="0" step="0.01" placeholder="Target amount" required value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
          <input className="input" type="number" min="0" step="0.01" placeholder="Current amount" value={form.currentAmount} onChange={(e) => setForm({ ...form, currentAmount: e.target.value })} />
        </div>
        <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        <button className="btn-primary w-full">{editingId ? <Save size={18} /> : <Plus size={18} />} {editingId ? "Save goal" : "Add goal"}</button>
      </form>
      <section className="space-y-4">
        {items.map((goal) => {
          const id = getItemId(goal);
          const done = percent(goal.currentAmount, goal.targetAmount);
          return (
            <div key={id} className="panel">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-sky-100 text-sky-700"><Flag size={20} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-bold">{goal.name}</h3><span className="text-sm font-semibold">{done}%</span></div>
                  <p className="text-sm text-zinc-500">{goal.type} · target {formatCurrency(goal.targetAmount, user?.currency)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" className="btn-secondary px-3 py-2" onClick={() => editGoal(goal)} aria-label={`Edit ${goal.name}`}><Edit2 size={16} /></button>
                  <button type="button" className="btn-secondary px-3 py-2 text-rose-600" onClick={() => deleteGoal(id)} aria-label={`Delete ${goal.name}`}><Trash2 size={16} /></button>
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
