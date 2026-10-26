import { useState } from "react";
import { useApp } from "../context/AppContext";
import { money, nextDue, dateKey, CATEGORIES } from "../utils/helpers";

export function Bills() {
  const { bills, setBills, setTxs, notify } = useApp();
  const blank = { name: "", amount: "", day: "1", category: "Bills" };
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const monthly = bills.filter((b) => b.active).reduce((total, b) => total + b.amount, 0);

  const addBill = (e) => {
    e.preventDefault();
    const day = Number(form.day);
    if (!form.name.trim() || !(Number(form.amount) > 0) || day < 1 || day > 28) {
      setError("Enter a name, an amount above 0 and a day from 1 to 28.");
      return;
    }
    setError("");
    setBills([...bills, { id: Date.now(), name: form.name.trim(), amount: Number(form.amount), day, category: form.category, active: true }]);
    setForm(blank);
    notify("Bill added");
  };
  const markPaid = (b) => {
    setTxs((list) => [...list, { id: Date.now(), title: b.name, amount: b.amount, type: "expense", category: b.category, date: dateKey(new Date()) }]);
    notify(b.name + " added to your expenses");
  };
  const toggle = (b) => setBills(bills.map((x) => (x.id === b.id ? { ...x, active: !x.active } : x)));
  const remove = (b) => { if (window.confirm('Delete "' + b.name + '"?')) setBills(bills.filter((x) => x.id !== b.id)); };

  return (
    <div className="page two">
      <form className="card f" onSubmit={addBill} noValidate>
        <h2>Add a bill</h2>
        <label>Name<input name="name" value={form.name} onChange={change} placeholder="e.g. Spotify" /></label>
        <label>Amount (₹)<input name="amount" type="number" min="0" value={form.amount} onChange={change} /></label>
        <label>Due day of month (1 to 28)<input name="day" type="number" min="1" max="28" value={form.day} onChange={change} /></label>
        <label>Category
          <select name="category" value={form.category} onChange={change}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        {error && <span className="err">{error}</span>}
        <button className="btn" type="submit">Add bill</button>
      </form>
      <div className="card">
        <h2>Your monthly bills</h2>
        <p className="note">Active bills cost {money(monthly)} a month, about {money(monthly * 12)} a year (an estimate). Paused bills are not counted.</p>
        {bills.length === 0 && <p className="empty">No bills yet. Add rent, subscriptions or fees.</p>}
        {bills.map((b) => {
          const { due, days } = nextDue(b.day);
          return (
            <div className="tx" key={b.id}>
              <div><b>{b.name}</b> {!b.active && <small>(paused)</small>}<br /><small>{money(b.amount)} · next on {dateKey(due)} ({days === 0 ? "today" : "in " + days + " days"})</small></div>
              <div className="acts">
                <button className="btn small" onClick={() => markPaid(b)}>Mark paid</button>
                <button className="btn ghost small" onClick={() => toggle(b)}>{b.active ? "Pause" : "Resume"}</button>
                <button className="btn ghost small" onClick={() => remove(b)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
