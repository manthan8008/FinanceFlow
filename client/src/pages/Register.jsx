import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", currency: "INR", monthlyIncome: "", savingsGoal: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    try {
      await register(form);
      navigate("/app");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-4 py-10">
      <form onSubmit={submit} className="glass w-full max-w-2xl rounded-3xl p-6 text-left">
        <h1 className="text-3xl font-extrabold">Create your account</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div><label className="label">Name</label><input className="input mt-2" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="input mt-2" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label">Password</label><input className="input mt-2" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div><label className="label">Currency</label><select className="input mt-2" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>INR</option><option>USD</option><option>EUR</option><option>GBP</option></select></div>
          <div><label className="label">Monthly income</label><input className="input mt-2" type="number" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: Number(e.target.value) })} /></div>
          <div><label className="label">Savings goal</label><input className="input mt-2" type="number" value={form.savingsGoal} onChange={(e) => setForm({ ...form, savingsGoal: Number(e.target.value) })} /></div>
        </div>
        <button className="btn-primary mt-6 w-full">Create account</button>
        <p className="mt-5 text-center text-sm text-zinc-500">Already have an account? <Link className="font-bold text-ink dark:text-white" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
