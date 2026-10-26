import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { monthKey, sum, groupByCategory } from "../utils/helpers";
import { makeDemo, defaultBills } from "../data/demoData";

export const AppContext = createContext();

const isFile = typeof window !== "undefined" && window.location.protocol === "file:";

function normalizePath(raw) {
  if (!raw) return "/";
  let p = String(raw).trim();
  if (p.startsWith("#")) {
    p = p.replace(/^#\/?/, "");
  }
  if (!p.startsWith("/")) {
    p = "/" + p;
  }
  if (p.length > 1 && p.endsWith("/")) {
    p = p.slice(0, -1);
  }
  return p || "/";
}

function getInitialPath() {
  if (typeof window === "undefined") return "/";
  if (window.location.hash) {
    const fromHash = window.location.hash.replace(/^#\/?/, "");
    if (fromHash) return normalizePath("/" + fromHash);
  }
  if (isFile) return "/";
  return normalizePath(window.location.pathname);
}

export function AppProvider({ children }) {
  const [txs, setTxs] = useLocalStorage("fintrack-txs", makeDemo);
  const [budgets, setBudgets] = useLocalStorage("fintrack-budgets", { Food: 4000, Transport: 1500, Shopping: 3000, Bills: 2500, Fun: 1000 });
  const [theme, setTheme] = useLocalStorage("fintrack-theme", "dark");
  const [toast, setToast] = useState("");
  const [user, setUser] = useLocalStorage("fintrack-user", null);
  const [bills, setBills] = useLocalStorage("fintrack-bills", defaultBills);
  const [accent, setAccent] = useLocalStorage("fintrack-accent", "gold");
  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { document.documentElement.dataset.accent = accent; }, [accent]);

  const navigate = (to, { replace = false } = {}) => {
    const target = normalizePath(to);
    if (typeof window !== "undefined") {
      if (isFile) {
        const hash = target === "/" ? "" : "#" + target;
        if (window.location.hash !== hash) {
          if (replace) {
            window.location.replace(hash || "#/");
          } else {
            window.location.hash = hash;
          }
        }
      } else {
        const url = target + window.location.search;
        if (window.location.pathname !== target) {
          if (replace) {
            window.history.replaceState(null, "", url);
          } else {
            window.history.pushState(null, "", url);
          }
        }
      }
    }
    setCurrentPath(target);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const titles = {
      "/": "FinTrack – Smart Expense Tracker",
      "/landing": "FinTrack – Smart Expense Tracker",
      "/login": "FinTrack – Log In",
      "/dashboard": "FinTrack – Dashboard",
      "/transactions": "FinTrack – Transactions",
      "/budgets": "FinTrack – Budgets",
      "/bills": "FinTrack – Bills",
      "/goals": "FinTrack – Goals",
      "/calendar": "FinTrack – Calendar",
      "/reports": "FinTrack – Reports",
      "/settings": "FinTrack – Settings",
    };
    document.title = titles[currentPath] || "FinTrack – Smart Expense Tracker";
  }, [currentPath]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = txs.filter((t) => t.date.startsWith(monthKey(now)));
    const lastKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const lastMonth = txs.filter((t) => t.date.startsWith(lastKey));
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    const expense = sum(thisMonth, "expense");
    const income = sum(thisMonth, "income");
    const avgDaily = expense / now.getDate();
    const months = [2, 1, 0].map((back) => {
      const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
      const list = txs.filter((t) => t.date.startsWith(monthKey(d)));
      return { label: d.toLocaleString("en-IN", { month: "short" }), income: sum(list, "income"), expense: sum(list, "expense") };
    });
    return {
      income, expense, saved: income - expense,
      balance: sum(txs, "income") - sum(txs, "expense"),
      byCategory: groupByCategory(thisMonth),
      avgDaily, predicted: avgDaily * daysInMonth,
      lastAvgDaily: sum(lastMonth, "expense") / daysLastMonth,
      hasLastMonth: lastMonth.length > 0,
      months, daysLeft: daysInMonth - now.getDate(),
    };
  }, [txs]);

  const value = {
    txs, setTxs,
    budgets, setBudgets,
    theme, setTheme,
    notify,
    stats,
    user, setUser,
    bills, setBills,
    accent, setAccent,
    currentPath, navigate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
