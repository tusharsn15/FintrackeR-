import { useApp } from "../context/AppContext";

export function HealthCard() {
  const { stats, budgets } = useApp();
  const rate = stats.income > 0 ? (stats.income - stats.expense) / stats.income : 0;
  const savingsPoints = Math.round(Math.min(Math.max(rate / 0.2, 0), 1) * 40);
  const limits = Object.keys(budgets).filter((c) => Number(budgets[c]) > 0);
  const over = limits.filter((c) => (stats.byCategory[c] || 0) > Number(budgets[c]));
  const budgetPoints = limits.length === 0 ? 20 : Math.round(40 * (1 - over.length / limits.length));
  const paceOk = stats.income > 0 && stats.predicted <= stats.income;
  const score = savingsPoints + budgetPoints + (paceOk ? 20 : 0);
  let label = "Needs attention";
  if (score >= 75) label = "Great shape";
  else if (score >= 50) label = "Doing okay";

  return (
    <div className="card row2" style={{ alignItems: "center", flexWrap: "nowrap" }}>
      <div className="ring" style={{ "--p": score }}><span>{score}</span></div>
      <div>
        <h2 style={{ marginBottom: 4 }}>Health score: {label}</h2>
        <p className="note" style={{ margin: 0 }}>
          Savings rate {Math.round(rate * 100)}% (+{savingsPoints}/40) · Budgets over limit: {over.length} (+{budgetPoints}/40) · Month-end pace {paceOk ? "within income (+20)" : "above income (+0)"}
        </p>
        <p className="note" style={{ margin: "4px 0 0" }}>A simple learning score, not financial advice.</p>
      </div>
    </div>
  );
}
