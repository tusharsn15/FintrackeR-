import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, money, sum } from "../utils/helpers";
import { TransactionForm } from "../components/TransactionForm";

export function Transactions() {
  const { txs, setTxs, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const shown = txs
    .filter((t) => (t.title + " " + t.category).toLowerCase().includes(search.toLowerCase()))
    .filter((t) => type === "all" || t.type === type)
    .filter((t) => category === "all" || t.category === category)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const remove = (t) => {
    if (window.confirm('Delete "' + t.title + '"?')) {
      setTxs((list) => list.filter((x) => x.id !== t.id));
      notify("Transaction deleted");
    }
  };

  const exportCsv = () => {
    const rows = ["Date,Title,Type,Category,Amount"].concat(
      shown.map((t) => [t.date, '"' + t.title.replace(/"/g, '""') + '"', t.type, t.category, t.amount].join(","))
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    link.download = "fintrack-transactions.csv";
    link.click();
    notify("CSV downloaded");
  };

  return (
    <div className="page two">
      <TransactionForm key={editing ? editing.id : "new"} editing={editing} onDone={() => setEditing(null)} />
      <div className="card">
        <h2>All transactions ({shown.length})</h2>
        <div className="filters">
          <input aria-label="Search" placeholder="Search by title or category" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option><option value="expense">Expenses</option><option value="income">Income</option>
          </select>
          <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <p className="note">Shown: income <span className="pos">{money(sum(shown, "income"))}</span> · spent <span className="neg">{money(sum(shown, "expense"))}</span></p>
        {shown.length === 0 && <p className="empty">No transactions match. Try clearing the filters.</p>}
        {shown.map((t) => (
          <div className="tx" key={t.id}>
            <div><b>{t.title}</b><br /><small>{t.category} · {t.date}</small></div>
            <div className="acts">
              <b className={t.type === "income" ? "pos" : "neg"}>{t.type === "income" ? "+" : "−"}{money(t.amount)}</b>
              <button className="btn ghost small" onClick={() => setEditing(t)}>Edit</button>
              <button className="btn ghost small" onClick={() => remove(t)}>Delete</button>
            </div>
          </div>
        ))}
        <p><button className="btn ghost small" onClick={exportCsv}>Export CSV</button></p>
      </div>
    </div>
  );
}
