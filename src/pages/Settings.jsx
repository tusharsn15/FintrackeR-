import { useState } from "react";
import { useApp } from "../context/AppContext";
import { download } from "../utils/helpers";
import { makeDemo } from "../data/demoData";

export function Settings() {
  const { user, setUser, theme, setTheme, txs, setTxs, budgets, setBudgets, notify, accent, setAccent } = useApp();
  const [name, setName] = useState(user.name);

  const saveName = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUser({ ...user, name: name.trim() });
    notify("Name saved");
  };
  const backup = () => download("fintrack-backup.json", JSON.stringify({ txs, budgets }, null, 2), "application/json");
  const restore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const valid = Array.isArray(data.txs) && data.txs.every((t) => t.id && t.date && t.amount > 0 && ["income", "expense"].includes(t.type));
        if (!valid) throw new Error("bad file");
        setTxs(data.txs);
        if (data.budgets) setBudgets(data.budgets);
        notify("Backup restored");
      } catch (err) {
        notify("That file is not a valid FinTrack backup");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const useSample = () => { if (window.confirm("Replace all data with sample data?")) { setTxs(makeDemo()); notify("Sample data restored"); } };
  const clearAll = () => { if (window.confirm("Delete all transactions and budgets?")) { setTxs([]); setBudgets({}); notify("All data cleared"); } };

  return (
    <div className="page grid c2" style={{ alignItems: "start" }}>
      <form className="card f" onSubmit={saveName}>
        <h2>Profile</h2>
        <label>Display name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <p className="note">Signed in as {user.email}</p>
        <button className="btn" type="submit">Save name</button>
      </form>
      <div className="card">
        <h2>Appearance</h2>
        <div className="row2">
          <button className={"btn small" + (theme === "dark" ? "" : " ghost")} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark (Black & Gold)</button>
          <button className={"btn small" + (theme === "light" ? "" : " ghost")} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light (Ivory & Gold)</button>
          <span className="note" style={{ width: "100%", margin: "8px 0 0" }}>Accent colour</span>
          {["gold", "amber", "champagne", "bronze", "emerald"].map((a) => (
            <button key={a} className="swatch" data-accent={a} aria-label={a + " accent"} aria-pressed={accent === a} onClick={() => setAccent(a)} />
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Your data</h2>
        <p className="note">Everything is saved in this browser only and is not synced to the cloud.</p>
        <div className="row2">
          <button className="btn ghost small" onClick={backup}>Download backup (JSON)</button>
          <label className="btn ghost small" style={{ cursor: "pointer" }}>Restore backup
            <input type="file" accept="application/json" onChange={restore} style={{ display: "none" }} />
          </label>
        </div>
      </div>
      <div className="card">
        <h2>Reset</h2>
        <div className="row2">
          <button className="btn ghost small" onClick={useSample}>Restore sample data</button>
          <button className="btn ghost small" onClick={clearAll}>Clear all data</button>
        </div>
      </div>
    </div>
  );
}
