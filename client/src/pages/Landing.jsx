import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, ChartNoAxesCombined, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Landing() {
  const { demoLogin } = useAuth();
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(45,212,191,0.2),transparent_28%),linear-gradient(135deg,#f8fafc,#eef2ff_55%,#f7fee7)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_34%),linear-gradient(135deg,#09090b,#18181b)]" />
        <div className="relative mx-auto grid min-h-[86vh] max-w-7xl content-center gap-10 px-4 py-16 lg:grid-cols-[1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"><Sparkles size={16} /> AI-powered personal finance</p>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-normal text-ink dark:text-white md:text-7xl">FinanceFlow</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">A premium finance tracker for budgets, receipts, goals, reports, and Gemini-powered insights that help customers understand where their money is really going.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/register">Create account <ArrowRight size={18} /></Link>
              <button className="btn-secondary" onClick={demoLogin}>Try demo workspace</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[2rem] p-4">
            <div className="rounded-[1.5rem] bg-ink p-5 text-white dark:bg-black">
              <div className="flex items-center justify-between"><span className="font-bold">June Summary</span><span className="rounded-full bg-mint/20 px-3 py-1 text-sm text-mint">+49% savings</span></div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {["Balance ₹7.42L", "Income ₹1.9L", "Spend ₹97K"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">{item}</div>)}
              </div>
              <div className="mt-5 rounded-2xl bg-white p-5 text-ink">
                <div className="flex items-center gap-3"><Bot className="text-skybrand" /><p className="font-bold">Gemini insight</p></div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">Restaurant spend is 37% higher than last month. A ₹7,500 two-week cap keeps your savings goal on track.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {[["Smart dashboards", ChartNoAxesCombined], ["Private by design", ShieldCheck], ["Conversational finance", Bot]].map(([title, Icon]) => (
          <div key={title} className="panel"><Icon className="text-skybrand" /><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-sm text-zinc-500">Built for real recurring workflows, not a one-screen tutorial.</p></div>
        ))}
      </section>
    </main>
  );
}
