import { useApp } from "../context/AppContext";
import { money } from "../utils/helpers";

export function SpendingCoach() {
  const { stats, budgets } = useApp();
  const tips = [];
  const top = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0];
  if (top) tips.push(top[0] + " is your biggest expense this month (" + money(top[1]) + ").");
  if (stats.hasLastMonth && stats.lastAvgDaily > 0) {
    const change = Math.round(((stats.avgDaily - stats.lastAvgDaily) / stats.lastAvgDaily) * 100);
    tips.push(change > 0 ? "Your daily spending is " + change + "% higher than last month." : "Your daily spending is " + Math.abs(change) + "% lower than last month. Nice work!");
  }
  const limit = Object.values(budgets).reduce((s, n) => s + Number(n), 0);
  if (limit > 0 && stats.expense / limit >= 0.75) tips.push("You have used " + Math.round((stats.expense / limit) * 100) + "% of your total budget.");
  if (tips.length === 0) tips.push("Add a few expenses and your tips will appear here.");
  return (
    <div className="card">
      <h2>Spending coach</h2>
      <ul className="tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
      <p className="note">Simple rules applied to your own data. Not financial advice.</p>
    </div>
  );
}
