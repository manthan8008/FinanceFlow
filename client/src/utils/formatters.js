import { currencies } from "../data/demoData.js";

export function formatCurrency(amount = 0, currencyCode = "INR") {
  const currency = currencies.find((item) => item.code === currencyCode) || currencies[0];
  return `${currency.symbol}${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function percent(value = 0, total = 1) {
  if (!total) return 0;
  return Math.min(999, Math.round((Number(value) / Number(total)) * 100));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function downloadFile(filename, content, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
