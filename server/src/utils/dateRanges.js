export function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end, month: now.getMonth(), year: now.getFullYear() };
}

export function monthKey(date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(date));
}
