import { dateKey } from "../utils/helpers";

export function makeDemo() {
  const list = [];
  const add = (daysAgo, title, amount, type, category) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    list.push({ id: list.length + 1, title, amount, type, category, date: dateKey(d) });
  };
  add(0, "Lunch at canteen", 120, "expense", "Food");
  add(1, "Metro card top-up", 300, "expense", "Transport");
  add(2, "Groceries", 850, "expense", "Food");
  add(3, "Netflix", 199, "expense", "Fun");
  add(4, "Freelance project", 6000, "income", "Other");
  add(5, "New headphones", 2200, "expense", "Shopping");
  add(7, "Phone recharge", 399, "expense", "Bills");
  add(9, "Online course", 1499, "expense", "Education");
  add(12, "Pizza with friends", 640, "expense", "Food");
  add(15, "Pocket money", 15000, "income", "Other");
  add(22, "Electricity bill", 1100, "expense", "Bills");
  add(25, "Groceries", 1400, "expense", "Food");
  add(28, "Bus pass", 700, "expense", "Transport");
  add(33, "Sneakers", 3200, "expense", "Shopping");
  add(36, "Pocket money", 15000, "income", "Other");
  add(40, "Movie night", 500, "expense", "Fun");
  return list;
}

export const defaultBills = [
  { id: 1, name: "Phone plan", amount: 399, day: 5, category: "Bills", active: true },
  { id: 2, name: "Netflix", amount: 199, day: 12, category: "Fun", active: true },
  { id: 3, name: "Gym", amount: 700, day: 1, category: "Health", active: true },
];
