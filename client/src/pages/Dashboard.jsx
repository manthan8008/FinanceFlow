import { useEffect, useState } from "react";
import { Activity, Banknote, PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import MetricCard from "../components/ui/MetricCard.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import { CategoryPieChart, IncomeExpenseBarChart, SpendingLineChart } from "../components/charts/FinanceCharts.jsx";
import { financeService } from "../services/financeService.js";
import { formatCurrency } from "../utils/formatters.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const currency = user?.currency || "INR";

  useEffect(() => {
    financeService.dashboard().then((response) => setData(response.data));
  }, []);

  if (!data) return <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-white dark:bg-white/10" />)}</div>;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard icon={Wallet} label="Current balance" value={formatCurrency(data.currentBalance, currency)} detail="Across tracked accounts" tone="bg-sky-100 text-sky-700" />
        <MetricCard icon={Banknote} label="Monthly income" value={formatCurrency(data.monthlyIncome, currency)} detail="This month" tone="bg-emerald-100 text-emerald-700" />
        <MetricCard icon={TrendingDown} label="Monthly expenses" value={formatCurrency(data.monthlyExpenses, currency)} detail="Spend so far" tone="bg-rose-100 text-rose-700" />
        <MetricCard icon={PiggyBank} label="Savings" value={formatCurrency(data.savings, currency)} detail="Net saved" tone="bg-teal-100 text-teal-700" />
        <MetricCard icon={Activity} label="Budget usage" value={`${data.budgetUsage}%`} detail="Blended category use" tone="bg-amber-100 text-amber-700" />
        <MetricCard icon={TrendingUp} label="Net cash flow" value={formatCurrency(data.netCashFlow, currency)} detail="Income minus expenses" tone="bg-violet-100 text-violet-700" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="panel"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Monthly spending trend</h2><span className="text-sm text-zinc-500">Expenses vs savings</span></div><SpendingLineChart data={data.monthlySeries} /></div>
        <div className="panel"><h2 className="text-lg font-bold">Category mix</h2><CategoryPieChart data={data.categoryBreakdown} /></div>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="panel"><h2 className="mb-4 text-lg font-bold">Income vs expense</h2><IncomeExpenseBarChart data={data.monthlySeries} /></div>
        <div className="panel"><h2 className="text-lg font-bold">AI insights</h2><div className="mt-4 space-y-3">{data.insights.map((insight) => <div key={insight} className="rounded-2xl bg-zinc-50 p-4 text-sm dark:bg-white/10">{insight}</div>)}</div><div className="mt-5"><ProgressBar value={data.budgetUsage} tone="bg-gold" /></div></div>
      </section>
    </div>
  );
}
