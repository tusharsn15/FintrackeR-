import { useState } from "react";
import { useApp } from "../context/AppContext";
import { monthKey, sum, groupByCategory, money, download } from "../utils/helpers";
import { StatCard } from "../components/StatCard";
import { ProgressBar } from "../components/ProgressBar";

export function Reports() {
  const { txs, notify } = useApp();
  const months = [0, 1, 2, 3, 4, 5].map((back) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - back);
    return { key: monthKey(d), label: d.toLocaleString("en-IN", { month: "long", year: "numeric" }) };
  });
  const [month, setMonth] = useState(months[0].key);
  const list = txs.filter((t) => t.date.startsWith(month));
  const income = sum(list, "income");
  const expense = sum(list, "expense");
  const cats = Object.entries(groupByCategory(list)).sort((a, b) => b[1] - a[1]);
  const biggest = list.filter((t) => t.type === "expense").sort((a, b) => b.amount - a.amount).slice(0, 5);
  const daysInMonth = new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate();
  const elapsed = month === monthKey(new Date()) ? new Date().getDate() : daysInMonth;
  const rate = income > 0 ? Math.round(((income - expense) / income) * 100) + "%" : "n/a";

  const exportReport = () => {
    const rows = ["Category,Amount,Share"].concat(cats.map(([c, a]) => c + "," + a + "," + Math.round((a / expense) * 100) + "%"));
    download("fintrack-report-" + month + ".csv", rows.join("\n"), "text/csv");
    notify("Report downloaded");
  };

  return (
    <div className="page">
      <div className="card row2" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <label className="note">Report month
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </label>
        <button className="btn small" onClick={exportReport} disabled={cats.length === 0}>Download report</button>
      </div>
      <div className="grid c4">
        <StatCard label="Income" value={money(income)} tone="pos" />
        <StatCard label="Spent" value={money(expense)} tone="neg" />
        <StatCard label="Savings rate" value={rate} />
        <StatCard label="Average per day" value={money(expense / elapsed)} />
      </div>
      {list.length === 0 && <div className="card empty">No transactions in this month.</div>}
      <div className="grid c2">
        <div className="card">
          <h2>Spending by category</h2>
          {cats.map(([name, amount]) => (
            <div className="line" key={name}>
              <span>{name}</span><ProgressBar percent={(amount / expense) * 100} />
              <span>{Math.round((amount / expense) * 100)}%</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h2>Biggest expenses</h2>
          {biggest.map((t) => (
            <div className="tx" key={t.id}>
              <div><b>{t.title}</b><br /><small>{t.category} · {t.date}</small></div>
              <b className="neg">{money(t.amount)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
