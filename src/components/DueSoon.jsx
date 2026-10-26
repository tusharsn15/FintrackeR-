import { useApp } from "../context/AppContext";
import { money, nextDue } from "../utils/helpers";

export function DueSoon({ go }) {
  const { bills } = useApp();
  const soon = bills.filter((b) => b.active).map((b) => ({ ...b, ...nextDue(b.day) })).sort((a, b) => a.days - b.days).slice(0, 3);
  return (
    <div className="card">
      <h2>Bills due soon</h2>
      {soon.length === 0 && <p className="empty">No active bills.</p>}
      {soon.map((b) => (
        <div className="tx" key={b.id}>
          <div><b>{b.name}</b><br /><small>{b.days === 0 ? "Due today" : "In " + b.days + " days"}</small></div>
          <b>{money(b.amount)}</b>
        </div>
      ))}
      <p><button className="btn ghost small" onClick={() => go("bills")}>Manage bills</button></p>
    </div>
  );
}
