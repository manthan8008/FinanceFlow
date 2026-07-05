import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";
import { financeService } from "../services/financeService.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(user || {});

  async function save(event) {
    event.preventDefault();
    const { data } = await financeService.updateProfile(form);
    setUser(data.user);
    localStorage.setItem("financeflow_user", JSON.stringify(data.user));
    toast.success("Profile saved");
  }

  return (
    <form onSubmit={save} className="panel mx-auto max-w-3xl space-y-4">
      <h2 className="text-xl font-bold">Profile</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label">Name</label><input className="input mt-2" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">Email</label><input className="input mt-2" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Currency</label><select className="input mt-2" value={form.currency || "INR"} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>INR</option><option>USD</option><option>EUR</option><option>GBP</option></select></div>
        <div><label className="label">Profile picture URL</label><input className="input mt-2" value={form.avatar || ""} onChange={(e) => setForm({ ...form, avatar: e.target.value })} /></div>
        <div><label className="label">Monthly income</label><input className="input mt-2" type="number" value={form.monthlyIncome || 0} onChange={(e) => setForm({ ...form, monthlyIncome: Number(e.target.value) })} /></div>
        <div><label className="label">Savings goal</label><input className="input mt-2" type="number" value={form.savingsGoal || 0} onChange={(e) => setForm({ ...form, savingsGoal: Number(e.target.value) })} /></div>
      </div>
      <button className="btn-primary">Save profile</button>
    </form>
  );
}
