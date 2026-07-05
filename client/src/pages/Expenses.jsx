import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { financeService } from "../services/financeService.js";
import { categories } from "../data/demoData.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const blankForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
  notes: "",
};

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const { user } = useAuth();
  const currency = user?.currency;

  useEffect(() => {
    financeService.expenses().then((response) => setItems(response.data));
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        const haystack =
          `${item.title} ${item.merchant || ""} ${item.notes || ""}`.toLowerCase();
        return (
          (category === "All" || item.category === category) &&
          haystack.includes(query.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === "amount-desc")
          return Number(b.amount) - Number(a.amount);
        if (sortBy === "amount-asc") return Number(a.amount) - Number(b.amount);
        if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
        return new Date(b.date) - new Date(a.date);
      });
  }, [items, query, category, sortBy]);

  const summary = useMemo(() => {
    const total = filtered.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const categoryTotals = filtered.reduce(
      (acc, item) => ({
        ...acc,
        [item.category]: (acc[item.category] || 0) + Number(item.amount || 0),
      }),
      {},
    );
    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      total,
      average: filtered.length ? total / filtered.length : 0,
      count: filtered.length,
      topCategory: topCategory?.[0] || "No category",
    };
  }, [filtered]);

  function resetForm() {
    setForm(blankForm);
    setEditingId(null);
  }

  async function saveExpense(event) {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };

    if (editingId) {
      const { data } = await financeService.updateExpense(editingId, payload);
      setItems((current) =>
        current.map((item) =>
          item.id === editingId || item._id === editingId ? data : item,
        ),
      );
      toast.success("Expense updated");
    } else {
      const { data } = await financeService.createExpense(payload);
      setItems((current) => [data, ...current]);
      toast.success("Expense added");
    }

    resetForm();
  }

  function editExpense(item) {
    setEditingId(item.id || item._id);
    setForm({
      title: item.title || "",
      amount: item.amount || "",
      category: item.category || "Food",
      date: item.date?.slice(0, 10) || blankForm.date,
      paymentMethod: item.paymentMethod || "UPI",
      notes: item.notes || "",
    });
  }

  async function deleteExpense(id) {
    await financeService.deleteExpense(id);
    setItems((current) =>
      current.filter((item) => item.id !== id && item._id !== id),
    );
    if (editingId === id) resetForm();
    toast.success("Expense deleted");
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="panel min-w-0 p-4 sm:p-5">
          <p className="label">Filtered spend</p>
          <p className="mt-2 truncate text-xl font-extrabold sm:text-2xl">
            {formatCurrency(summary.total, currency)}
          </p>
        </div>
        <div className="panel min-w-0 p-4 sm:p-5">
          <p className="label">Transactions</p>
          <p className="mt-2 truncate text-xl font-extrabold sm:text-2xl">
            {summary.count}
          </p>
        </div>
        <div className="panel min-w-0 p-4 sm:p-5">
          <p className="label">Average expense</p>
          <p className="mt-2 truncate text-xl font-extrabold sm:text-2xl">
            {formatCurrency(summary.average, currency)}
          </p>
        </div>
        <div className="panel min-w-0 p-4 sm:p-5">
          <p className="label">Top category</p>
          <p className="mt-2 truncate text-xl font-extrabold sm:text-2xl">
            {summary.topCategory}
          </p>
        </div>
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={saveExpense} className="panel space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit expense" : "Add expense"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary px-3"
                aria-label="Cancel editing"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <input
            className="input"
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="input"
            placeholder="Amount"
            required
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Payment method"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          />
          <textarea
            className="input min-h-24"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button className="btn-primary w-full">
            {editingId ? <Check size={18} /> : <Plus size={18} />}
            {editingId ? "Save expense" : "Add expense"}
          </button>
        </form>

        <section className="panel min-w-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold">Expenses</h2>
            <div className="grid w-full min-w-0 gap-2 md:w-auto md:grid-cols-[minmax(11rem,1fr)_10rem_11rem]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-zinc-400"
                  size={16}
                />
                <input
                  className="input pl-9"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:hidden">
            {filtered.map((item) => {
              const id = item.id || item._id;
              return (
                <article
                  key={id}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.category} · {formatDate(item.date)}
                      </p>
                    </div>
                    <p className="shrink-0 text-right font-extrabold">
                      {formatCurrency(item.amount, currency)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm text-zinc-500">
                      {item.paymentMethod || "Payment method"}
                    </p>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => editExpense(item)}
                        className="btn-secondary px-3 py-2"
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteExpense(id)}
                        className="btn-secondary px-3 py-2 text-rose-600"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {item.notes && (
                    <p className="mt-3 line-clamp-2 text-sm text-zinc-500">
                      {item.notes}
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-5 hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr>
                  <th className="py-3">Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const id = item.id || item._id;
                  return (
                    <tr
                      key={id}
                      className="border-t border-zinc-100 dark:border-white/10"
                    >
                      <td className="py-3 font-semibold">
                        <span>{item.title}</span>
                        {item.notes && (
                          <span className="block max-w-64 truncate text-xs font-normal text-zinc-500">
                            {item.notes}
                          </span>
                        )}
                      </td>
                      <td>{item.category}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.paymentMethod}</td>
                      <td className="text-right font-bold">
                        {formatCurrency(item.amount, currency)}
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => editExpense(item)}
                            className="btn-secondary px-3 py-2"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteExpense(id)}
                            className="btn-secondary px-3 py-2 text-rose-600"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <p className="py-10 text-center text-sm text-zinc-500">
              No expenses match the current filters.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
