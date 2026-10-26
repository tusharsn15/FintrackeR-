import { useState } from "react";
import { useApp } from "../context/AppContext";
import { money, monthKey, short, sum } from "../utils/helpers";

export function CalendarPage() {
  const { txs } = useApp();
  const [offset, setOffset] = useState(0);
  const [picked, setPicked] = useState("");
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const dayKey = (n) => monthKey(first) + "-" + String(n).padStart(2, "0");

  const spendByDay = {};
  const incomeByDay = {};
  txs.forEach((t) => {
    if (t.type === "expense") {
      spendByDay[t.date] = (spendByDay[t.date] || 0) + t.amount;
    } else if (t.type === "income") {
      incomeByDay[t.date] = (incomeByDay[t.date] || 0) + t.amount;
    }
  });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const biggest = Math.max(1, ...days.map((n) => spendByDay[dayKey(n)] || 0));

  const shade = (amount) => {
    if (amount === 0) return "";
    const share = amount / biggest;
    if (share > 0.75) return " l4";
    if (share > 0.5) return " l3";
    if (share > 0.25) return " l2";
    return " l1";
  };

  const pickedTxs = txs.filter((t) => t.date === picked);
  const pickedIncome = sum(pickedTxs, "income");
  const pickedExpense = sum(pickedTxs, "expense");

  return (
    <div className="page">
      <div className="card">
        <div className="head">
          <h2>{first.toLocaleString("en-IN", { month: "long", year: "numeric" })}</h2>
          <div className="row2">
            <button className="btn ghost small" onClick={() => setOffset(offset - 1)}>← Prev</button>
            <button className="btn ghost small" onClick={() => setOffset(offset + 1)} disabled={offset >= 0}>Next →</button>
          </div>
        </div>
        <div className="cal">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span className="dow" key={"d" + i}>{d}</span>)}
          {Array.from({ length: first.getDay() }, (_, i) => <span key={"b" + i} />)}
          {days.map((n) => {
            const key = dayKey(n);
            const debit = spendByDay[key] || 0;
            const credit = incomeByDay[key] || 0;
            return (
              <button
                key={n}
                className={"day" + shade(debit) + (picked === key ? " sel" : "")}
                aria-label={`${key}: Credit ${money(credit)}, Debit ${money(debit)}`}
                onClick={() => setPicked(key)}
              >
                <span className="day-num">{n}</span>
                {(credit > 0 || debit > 0) && (
                  <div className="day-amounts">
                    {credit > 0 && <span className="day-credit">+{short(credit)}</span>}
                    {debit > 0 && <span className="day-debit">−{short(debit)}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="note">Darker days indicate higher spending. Tap any date to view all debit and credit transactions.</p>
      </div>
      {picked && (
        <div className="card">
          <h2>{picked}</h2>
          <div className="cal-day-totals">
            <div className="cal-total-chip cal-total-credit">
              <span className="cal-total-label">↑ Total Credit</span>
              <span className="cal-total-value pos">+{money(pickedIncome)}</span>
            </div>
            <div className="cal-total-chip cal-total-debit">
              <span className="cal-total-label">↓ Total Debit</span>
              <span className="cal-total-value neg">−{money(pickedExpense)}</span>
            </div>
          </div>
          {pickedTxs.length === 0 && <p className="empty">Nothing recorded on this day.</p>}
          {pickedTxs.map((t) => (
            <div className="tx" key={t.id}>
              <div><b>{t.title}</b><br /><small>{t.category}</small></div>
              <b className={t.type === "income" ? "pos" : "neg"}>{t.type === "income" ? "+" : "−"}{money(t.amount)}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

