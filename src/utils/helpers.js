export const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Fun", "Education", "Health", "Other"];

export const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export const monthKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");

export const dateKey = (d) => monthKey(d) + "-" + String(d.getDate()).padStart(2, "0");

export const sum = (list, type) => list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

export const groupByCategory = (list) => {
  const result = {};
  list.filter((t) => t.type === "expense").forEach((t) => {
    result[t.category] = (result[t.category] || 0) + t.amount;
  });
  return result;
};

export const short = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(Math.round(n)));

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export function nextDue(day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let due = new Date(today.getFullYear(), today.getMonth(), day);
  if (due < today) due = new Date(today.getFullYear(), today.getMonth() + 1, day);
  return { due, days: Math.round((due - today) / 86400000) };
}

export function download(filename, text, type) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = filename;
  link.click();
}
