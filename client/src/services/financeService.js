import api from "./api.js";
import { budgets, expenses, goals, incomes, monthlySeries, notifications } from "../data/demoData.js";

const fallback = (data) => Promise.resolve({ data });
const STORAGE_KEYS = {
  expenses: "financeflow_expenses",
  incomes: "financeflow_incomes",
  budgets: "financeflow_budgets",
};

function readCollection(key, seed) {
  try {
    const value = localStorage.getItem(STORAGE_KEYS[key]);
    if (!value) {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(value);
  } catch {
    return seed;
  }
}

function writeCollection(key, value) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  return value;
}

function getExpenses() {
  return readCollection("expenses", expenses);
}

function getIncomes() {
  return readCollection("incomes", incomes);
}

function getBudgets() {
  return readCollection("budgets", budgets);
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function buildDashboardSummary() {
  const localExpenses = getExpenses();
  const localIncomes = getIncomes();
  const localBudgets = getBudgets();
  const monthlyExpenses = localExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const monthlyIncome = localIncomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBudget = localBudgets.reduce((sum, item) => sum + Number(item.limit || 0), 0);
  const budgetSpent = localBudgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
  const netCashFlow = monthlyIncome - monthlyExpenses;

  return {
    currentBalance: 742000 + netCashFlow,
    monthlyIncome,
    monthlyExpenses,
    savings: Math.max(0, netCashFlow),
    budgetUsage: totalBudget ? Math.round((budgetSpent / totalBudget) * 100) : 0,
    netCashFlow,
    monthlySeries,
    categoryBreakdown: localBudgets.map((budget) => ({ name: budget.category, value: budget.spent })),
    recentTransactions: [...localExpenses.slice(0, 4), ...localIncomes.slice(0, 2)],
    insights: [
      monthlyExpenses > monthlyIncome * 0.6 ? "Expenses are taking more than 60% of income this month." : "Spending is within a healthy share of income this month.",
      netCashFlow > 0 ? "You are on track to finish the month cash-flow positive." : "Income is trailing expenses this month; review flexible categories first.",
    ],
  };
}

async function safeRequest(request, demoData) {
  try {
    return await request();
  } catch {
    return fallback(typeof demoData === "function" ? demoData() : demoData);
  }
}

export const financeService = {
  dashboard: () =>
    safeRequest(() => api.get("/dashboard/summary"), buildDashboardSummary),
  expenses: (params) => safeRequest(() => api.get("/expenses", { params }), getExpenses),
  createExpense: async (payload) => {
    try {
      return await api.post("/expenses", payload);
    } catch {
      const expense = { ...payload, id: createId("expense") };
      writeCollection("expenses", [expense, ...getExpenses()]);
      return fallback(expense);
    }
  },
  updateExpense: async (id, payload) => {
    try {
      return await api.put(`/expenses/${id}`, payload);
    } catch {
      const updated = getExpenses().map((item) => (item.id === id || item._id === id ? { ...item, ...payload } : item));
      writeCollection("expenses", updated);
      return fallback(updated.find((item) => item.id === id || item._id === id));
    }
  },
  deleteExpense: async (id) => {
    try {
      return await api.delete(`/expenses/${id}`);
    } catch {
      writeCollection("expenses", getExpenses().filter((item) => item.id !== id && item._id !== id));
      return fallback({ id });
    }
  },
  incomes: () => safeRequest(() => api.get("/incomes"), getIncomes),
  createIncome: async (payload) => {
    try {
      return await api.post("/incomes", payload);
    } catch {
      const income = { ...payload, id: createId("income") };
      writeCollection("incomes", [income, ...getIncomes()]);
      return fallback(income);
    }
  },
  budgets: () => safeRequest(() => api.get("/budgets"), getBudgets),
  createBudget: async (payload) => {
    try {
      return await api.post("/budgets", payload);
    } catch {
      const budget = { ...payload, id: createId("budget"), spent: Number(payload.spent || 0) };
      writeCollection("budgets", [budget, ...getBudgets()]);
      return fallback(budget);
    }
  },
  goals: () => safeRequest(() => api.get("/goals"), goals),
  createGoal: (payload) => safeRequest(() => api.post("/goals", payload), { ...payload, id: crypto.randomUUID() }),
  updateGoal: (id, payload) => safeRequest(() => api.put(`/goals/${id}`, payload), { ...payload, id }),
  deleteGoal: (id) => safeRequest(() => api.delete(`/goals/${id}`), { id }),
  notifications: () => safeRequest(() => api.get("/notifications"), notifications),
  reports: (type) => safeRequest(() => api.get(`/reports/${type}`), { type, monthlySeries, expenses: getExpenses(), budgets: getBudgets() }),
  askAi: (message) =>
    safeRequest(() => api.post("/ai/chat", { message }), {
      role: "assistant",
      content:
        "Your food and entertainment categories are trending above plan. A practical move is to cap restaurant spend at ₹7,500 for the next two weeks and redirect the difference to your emergency fund.",
    }),
  aiHistory: () => safeRequest(() => api.get("/ai/history"), []),
  scanReceipt: (formData) => safeRequest(() => api.post("/expenses/scan-receipt", formData), { merchant: "Detected Merchant", amount: 1299, date: new Date().toISOString().slice(0, 10) }),
  updateProfile: (payload) => api.put("/profile", payload),
  changePassword: (payload) => api.post("/auth/change-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
};
