import { Lock, Moon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { financeService } from "../services/financeService.js";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  async function changePassword(event) {
    event.preventDefault();
    await financeService.changePassword(passwords);
    setPasswords({ currentPassword: "", newPassword: "" });
    toast.success("Password updated");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="panel"><Moon className="text-skybrand" /><h2 className="mt-4 text-xl font-bold">Appearance</h2><p className="mt-2 text-sm text-zinc-500">Current mode: {theme}</p><button className="btn-secondary mt-5" onClick={toggleTheme}>Toggle dark mode</button></section>
      <section className="panel"><Lock className="text-coral" /><h2 className="mt-4 text-xl font-bold">Change password</h2><form onSubmit={changePassword} className="mt-4 space-y-3"><input className="input" type="password" placeholder="Current password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /><input className="input" type="password" placeholder="New password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /><button className="btn-primary">Update password</button></form></section>
      <section className="panel md:col-span-2"><ShieldCheck className="text-mint" /><h2 className="mt-4 text-xl font-bold">Security</h2><p className="mt-2 text-sm text-zinc-500">JWT auth, bcrypt hashing, Helmet, rate limiting, input validation, and MongoDB query sanitization are implemented on the API.</p></section>
    </div>
  );
}
