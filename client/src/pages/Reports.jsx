import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { financeService } from "../services/financeService.js";
import { downloadFile, formatCurrency } from "../utils/formatters.js";
import { expenses } from "../data/demoData.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const reports = ["monthly", "annual", "category", "budget"];

export default function Reports() {
  const [active, setActive] = useState("monthly");
  const { user } = useAuth();

  async function exportCsv() {
    const { data } = await financeService.reports(active);
    const rows = [["Title", "Category", "Amount", "Date"], ...(data.expenses || expenses).map((item) => [item.title, item.category, item.amount, item.date])];
    downloadFile(`${active}-report.csv`, rows.map((row) => row.join(",")).join("\n"));
  }

  return (
    <div className="space-y-6">
      <section className="panel flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-xl font-bold">Reports</h2><p className="text-sm text-zinc-500">Monthly, annual, category, and budget exports.</p></div>
        <button onClick={exportCsv} className="btn-primary"><Download size={18} /> Export CSV</button>
      </section>
      <div className="flex flex-wrap gap-2">{reports.map((report) => <button key={report} onClick={() => setActive(report)} className={active === report ? "btn-primary" : "btn-secondary"}>{report[0].toUpperCase() + report.slice(1)}</button>)}</div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expenses.map((expense) => <div key={expense.id} className="panel"><FileText className="text-skybrand" /><p className="mt-4 font-bold">{expense.title}</p><p className="text-sm text-zinc-500">{expense.category}</p><p className="mt-4 text-2xl font-extrabold">{formatCurrency(expense.amount, user?.currency)}</p></div>)}
      </section>
    </div>
  );
}
