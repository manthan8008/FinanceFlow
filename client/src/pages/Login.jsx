import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "demo@financeflow.app", password: "Demo@12345" });
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/app");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function demo() {
    await demoLogin();
    navigate("/app");
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-4 py-10">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-6 text-left">
        <h1 className="text-3xl font-extrabold">Login</h1>
        <p className="mt-2 text-sm text-zinc-500">Continue to your finance workspace.</p>
        <label className="label mt-6 block">Email</label>
        <input className="input mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
        <label className="label mt-4 block">Password</label>
        <input className="input mt-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required />
        <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <button type="button" className="btn-secondary mt-3 w-full" onClick={demo}>Use demo account</button>
        <div className="mt-5 flex justify-between text-sm"><Link to="/reset-password">Reset password</Link><Link to="/register">Create account</Link></div>
      </form>
    </main>
  );
}
