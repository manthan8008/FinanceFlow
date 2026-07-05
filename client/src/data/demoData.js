export const categories = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Bills",
  "Education",
  "Travel",
  "Investment",
  "Other",
];

export const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

export const demoUser = {
  name: "Aarav Mehta",
  email: "demo@financeflow.app",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  currency: "INR",
  monthlyIncome: 185000,
  savingsGoal: 45000,
};

export const monthlySeries = [
  { month: "Jan", expenses: 82000, income: 174000, savings: 92000 },
  { month: "Feb", expenses: 88000, income: 176000, savings: 88000 },
  { month: "Mar", expenses: 93000, income: 182000, savings: 89000 },
  { month: "Apr", expenses: 86000, income: 184000, savings: 98000 },
  { month: "May", expenses: 101000, income: 185000, savings: 84000 },
  { month: "Jun", expenses: 97000, income: 190000, savings: 93000 },
];

export const expenses = [
  { id: "e1", title: "Apartment rent", amount: 48000, category: "Rent", date: "2026-06-02", paymentMethod: "Bank Transfer", notes: "Monthly lease", merchant: "Greenview Homes" },
  { id: "e2", title: "Team dinner", amount: 7200, category: "Food", date: "2026-06-08", paymentMethod: "Credit Card", notes: "Client celebration", merchant: "Olive Bistro" },
  { id: "e3", title: "Metro pass", amount: 2600, category: "Transport", date: "2026-06-10", paymentMethod: "UPI", notes: "Monthly card", merchant: "Metro Rail" },
  { id: "e4", title: "Mutual fund SIP", amount: 25000, category: "Investment", date: "2026-06-12", paymentMethod: "Auto Debit", notes: "Index fund", merchant: "Groww" },
  { id: "e5", title: "Streaming bundle", amount: 1599, category: "Entertainment", date: "2026-06-18", paymentMethod: "Credit Card", notes: "Family plan", merchant: "Prime Media" },
  { id: "e6", title: "Quarterly health check", amount: 6500, category: "Healthcare", date: "2026-06-21", paymentMethod: "Debit Card", notes: "Preventive care", merchant: "Apollo Clinic" },
];

export const incomes = [
  { id: "i1", source: "Product salary", amount: 165000, category: "Salary", date: "2026-06-01", notes: "Monthly payroll" },
  { id: "i2", source: "Design consulting", amount: 18000, category: "Freelance", date: "2026-06-16", notes: "Landing page audit" },
  { id: "i3", source: "Dividend", amount: 7000, category: "Investment", date: "2026-06-25", notes: "Equity holdings" },
];

export const budgets = [
  { id: "b1", category: "Food", limit: 18000, spent: 15750, period: "monthly" },
  { id: "b2", category: "Rent", limit: 50000, spent: 48000, period: "monthly" },
  { id: "b3", category: "Entertainment", limit: 7000, spent: 8400, period: "monthly" },
  { id: "b4", category: "Travel", limit: 12000, spent: 4600, period: "monthly" },
  { id: "b5", category: "Healthcare", limit: 8000, spent: 6500, period: "monthly" },
];

export const goals = [
  { id: "g1", type: "Emergency Fund", name: "Six month safety net", targetAmount: 600000, currentAmount: 355000, deadline: "2026-12-31" },
  { id: "g2", type: "Vacation Fund", name: "Japan spring trip", targetAmount: 280000, currentAmount: 124000, deadline: "2027-03-15" },
  { id: "g3", type: "Investment Goal", name: "ETF portfolio", targetAmount: 1000000, currentAmount: 430000, deadline: "2028-01-01" },
];

export const notifications = [
  { id: "n1", type: "budget", title: "Entertainment budget exceeded", message: "You are 20% over your entertainment budget.", read: false },
  { id: "n2", type: "goal", title: "Emergency fund milestone", message: "You crossed 50% of your emergency fund goal.", read: false },
  { id: "n3", type: "bill", title: "Credit card bill upcoming", message: "Payment due in 3 days.", read: true },
];

export const assistantPrompts = [
  "Where am I overspending?",
  "How can I save more this month?",
  "Which category is growing fastest?",
  "Generate my monthly summary.",
];
