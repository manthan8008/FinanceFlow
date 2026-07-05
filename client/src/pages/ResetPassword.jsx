import { useState } from "react";
import toast from "react-hot-toast";
import { financeService } from "../services/financeService.js";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  async function submit(event) {
    event.preventDefault();
    await financeService.resetPassword({ email });
    toast.success("Reset instructions generated");
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-4 py-10">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-6 text-left">
        <h1 className="text-3xl font-extrabold">Reset password</h1>
        <p className="mt-2 text-sm text-zinc-500">Enter your email and the backend will issue a reset token for configured mail delivery.</p>
        <label className="label mt-6 block">Email</label>
        <input className="input mt-2" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="btn-primary mt-6 w-full">Send reset link</button>
      </form>
    </main>
  );
}
