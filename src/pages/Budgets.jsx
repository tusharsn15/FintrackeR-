import { useApp } from "../context/AppContext";
import { CATEGORIES, money } from "../utils/helpers";
import { ProgressBar } from "../components/ProgressBar";

export function Budgets() {
  const { budgets, setBudgets, stats } = useApp();
  const setLimit = (cat, value) => setBudgets({ ...budgets, [cat]: value === "" ? "" : Number(value) });

  return (
    <div className="page">
      <div className="card">
        <h2>Monthly budgets</h2>
        <p className="note">Set a limit per category. You will see a warning from 75% used.</p>
      </div>
      <div className="grid c3">
        {CATEGORIES.map((cat) => {
          const spent = stats.byCategory[cat] || 0;
          const limit = Number(budgets[cat]) || 0;
          const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
          let message = "";
          if (percent >= 100) message = "Over budget by " + money(spent - limit);
          else if (percent >= 90) message = "Almost at your limit";
          else if (percent >= 75) message = "Careful, 75% used";
          return (
            <div className="card" key={cat}>
              <h2>{cat}</h2>
              <label className="note">Limit (₹)
                <input type="number" min="0" value={budgets[cat] ?? ""} onChange={(e) => setLimit(cat, e.target.value)} placeholder="No limit" />
              </label>
              {limit > 0 && (
                <>
                  <p style={{ margin: "12px 0 6px" }}>{money(spent)} of {money(limit)} · {percent}%</p>
                  <ProgressBar percent={percent} />
                  <p className={percent >= 100 ? "neg" : "note"}>{message || money(limit - spent) + " left"}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
