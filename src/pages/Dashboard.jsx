import { useApp } from "../context/AppContext";
import { money } from "../utils/helpers";
import { StatCard } from "../components/StatCard";
import { ProgressBar } from "../components/ProgressBar";
import { SpendingCoach } from "../components/SpendingCoach";

export function Dashboard({ go }) {
  const { txs, stats, budgets } = useApp();
  const limit = Object.values(budgets).reduce((s, n) => s + Number(n), 0);
  const cats = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  const maxMonth = Math.max(1, ...stats.months.map((m) => Math.max(m.income, m.expense)));
  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 5);

  return (
    <div className="page">
      <div className="grid c4">
        <StatCard label="Total balance" value={money(stats.balance)} />
        <StatCard label="Income this month" value={money(stats.income)} tone="pos" />
        <StatCard label="Spent this month" value={money(stats.expense)} tone="neg" />
        <StatCard label="Saved this month" value={money(stats.saved)} tone={stats.saved >= 0 ? "pos" : "neg"} />
      </div>

      <div className="grid c2">
        <div className="card">
          <h2>Month-end estimate</h2>
          <b style={{ fontSize: 28 }}>{money(stats.predicted)}</b>
          <p className="note">Average {money(stats.avgDaily)} a day × days in the month. {stats.daysLeft} days left. This is an estimate, not a guarantee.</p>
          {limit > 0 && (
            <p className={stats.predicted > limit ? "neg" : "pos"}>
              {stats.predicted > limit ? "On pace to overspend by " + money(stats.predicted - limit) : "On pace to stay " + money(limit - stats.predicted) + " under budget"}
            </p>
          )}
        </div>
        <SpendingCoach />
      </div>

      <div className="grid c2">
        <div className="card">
          <h2>Where your money went</h2>
          {cats.length === 0 && <p className="empty">No expenses yet this month.</p>}
          {cats.map(([name, amount]) => (
            <div className="line" key={name}>
              <span>{name}</span>
              <ProgressBar percent={(amount / cats[0][1]) * 100} />
              <span>{money(amount)}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h2>Income vs spending</h2>
          <div className="cols">
            {stats.months.map((m) => (
              <div className="col" key={m.label}>
                <div className="pair" aria-label={m.label + ": income " + money(m.income) + ", spent " + money(m.expense)}>
                  <i style={{ height: (m.income / maxMonth) * 100 + "%" }} />
                  <i className="e" style={{ height: (m.expense / maxMonth) * 100 + "%" }} />
                </div>
                <small>{m.label}</small>
              </div>
            ))}
          </div>
          <p className="note"><span className="pos">■</span> Income &nbsp; <span className="neg">■</span> Spent</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent transactions</h2>
        {recent.map((t) => (
          <div className="tx" key={t.id}>
            <div><b>{t.title}</b><br /><small>{t.category} · {t.date}</small></div>
            <b className={t.type === "income" ? "pos" : "neg"}>{t.type === "income" ? "+" : "−"}{money(t.amount)}</b>
          </div>
        ))}
        <p><button className="btn ghost small" onClick={() => go("transactions")}>See all transactions</button></p>
      </div>
    </div>
  );
}
