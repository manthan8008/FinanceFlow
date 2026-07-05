import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { financeService } from "../services/financeService.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const types = ["Salary", "Freelance", "Business", "Investment", "Gifts", "Other"];
const emptyForm = { source: "", amount: "", category: "Salary", date: new Date().toISOString().slice(0, 10), notes: "" };

function getItemId(item) {
  return item.id || item._id;
}

export default function Income() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();
  useEffect(() => { financeService.incomes().then((response) => setItems(response.data)); }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editIncome(item) {
    setEditingId(getItemId(item));
    setForm({
      source: item.source || "",
      amount: item.amount ?? "",
      category: item.category || "Salary",
      date: item.date?.slice(0, 10) || emptyForm.date,
      notes: item.notes || "",
    });
  }

  async function saveIncome(event) {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };

    if (editingId) {
      const { data } = await financeService.updateIncome(editingId, payload);
      setItems((current) => current.map((item) => (getItemId(item) === editingId ? data : item)));
      toast.success("Income updated");
    } else {
      const { data } = await financeService.createIncome(payload);
      setItems((current) => [data, ...current]);
      toast.success("Income added");
    }

    resetForm();
  }

  async function deleteIncome(id) {
    await financeService.deleteIncome(id);
    setItems((current) => current.filter((item) => getItemId(item) !== id));
    if (editingId === id) resetForm();
    toast.success("Income deleted");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={saveIncome} className="panel space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{editingId ? "Edit income" : "Add income"}</h2>
          {editingId && <button type="button" className="btn-secondary px-3" onClick={resetForm} aria-label="Cancel editing"><X size={18} /></button>}
        </div>
        <input className="input" placeholder="Source" required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        <input className="input" type="number" min="0" step="0.01" placeholder="Amount" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{types.map((item) => <option key={item}>{item}</option>)}</select>
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary w-full">{editingId ? <Save size={18} /> : <Plus size={18} />} {editingId ? "Save income" : "Add income"}</button>
      </form>
      <section className="panel">
        <h2 className="text-xl font-bold">Income streams</h2>
        <div className="mt-5 grid gap-3">
          {items.map((item) => {
            const id = getItemId(item);
            return (
              <div key={id} className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-white/10">
                <div className="min-w-0">
                  <p className="truncate font-bold">{item.source}</p>
                  <p className="text-sm text-zinc-500">{item.category} · {formatDate(item.date)}</p>
                  <p className="mt-1 font-extrabold text-emerald-600 sm:hidden">{formatCurrency(item.amount, user?.currency)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="hidden font-extrabold text-emerald-600 sm:block">{formatCurrency(item.amount, user?.currency)}</p>
                  <button type="button" className="btn-secondary px-3 py-2" onClick={() => editIncome(item)} aria-label={`Edit ${item.source}`}><Edit2 size={16} /></button>
                  <button type="button" className="btn-secondary px-3 py-2 text-rose-600" onClick={() => deleteIncome(id)} aria-label={`Delete ${item.source}`}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
