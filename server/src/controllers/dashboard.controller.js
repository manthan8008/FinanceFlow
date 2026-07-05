import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { currentMonthRange, monthKey } from "../utils/dateRanges.js";
import { asyncHandler } from "../utils/http.js";

function sum(items, key = "amount") {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function buildMonthlySeries(expenses, incomes) {
  const map = new Map();
  for (const item of expenses) {
    const month = monthKey(item.date);
    map.set(month, { month, expenses: 0, income: 0, savings: 0 });
    map.get(month).expenses += Number(item.amount);
  }
  for (const item of incomes) {
    const month = monthKey(item.date);
    map.set(month, map.get(month) || { month, expenses: 0, income: 0, savings: 0 });
    map.get(month).income += Number(item.amount);
  }
  return [...map.values()].map((item) => ({ ...item, savings: item.income - item.expenses }));
}

export const summary = asyncHandler(async (req, res) => {
  const { start, end } = currentMonthRange();
  const [monthlyExpensesList, monthlyIncomesList, allExpenses, allIncomes, budgets] = await Promise.all([
    Expense.find({ user: req.user._id, date: { $gte: start, $lt: end } }).sort("-date"),
    Income.find({ user: req.user._id, date: { $gte: start, $lt: end } }).sort("-date"),
    Expense.find({ user: req.user._id }).sort("date"),
    Income.find({ user: req.user._id }).sort("date"),
    Budget.find({ user: req.user._id }),
  ]);

  const monthlyExpenses = sum(monthlyExpensesList);
  const monthlyIncome = sum(monthlyIncomesList);
  const budgetTotal = sum(budgets, "limit");
  const categoryTotals = monthlyExpensesList.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  res.json({
    currentBalance: sum(allIncomes) - sum(allExpenses),
    monthlyIncome,
    monthlyExpenses,
    savings: Math.max(0, monthlyIncome - monthlyExpenses),
    budgetUsage: budgetTotal ? Math.round((monthlyExpenses / budgetTotal) * 100) : 0,
    netCashFlow: monthlyIncome - monthlyExpenses,
    monthlySeries: buildMonthlySeries(allExpenses, allIncomes),
    categoryBreakdown: Object.entries(categoryTotals).map(([name, value]) => ({ name, value })),
    recentTransactions: [...monthlyExpensesList.slice(0, 4), ...monthlyIncomesList.slice(0, 2)],
    insights: [
      monthlyIncome > monthlyExpenses ? "You are cash-flow positive this month." : "Expenses are currently higher than income this month.",
      budgetTotal && monthlyExpenses > budgetTotal ? "Monthly spending has crossed your budget plan." : "Budget usage is currently under control.",
    ],
  });
});
