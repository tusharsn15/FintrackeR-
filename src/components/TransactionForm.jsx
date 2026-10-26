import { useState } from "react";
import { useApp } from "../context/AppContext";
import { dateKey, CATEGORIES } from "../utils/helpers";

export const emptyForm = () => ({ title: "", amount: "", type: "expense", category: "Food", date: dateKey(new Date()) });

export function validate(f) {
  const errors = {};
  if (!f.title.trim()) errors.title = "Enter a title.";
  if (!(Number(f.amount) > 0)) errors.amount = "Enter an amount above 0.";
  if (!f.date) errors.date = "Pick a date.";
  return errors;
}

export function TransactionForm({ editing, onDone }) {
  const { setTxs, notify } = useApp();
  const [form, setForm] = useState(editing || emptyForm());
  const [errors, setErrors] = useState({});
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const clean = { ...form, title: form.title.trim(), amount: Number(form.amount) };
    if (editing) {
      setTxs((list) => list.map((t) => (t.id === editing.id ? clean : t)));
      notify("Transaction updated");
    } else {
      setTxs((list) => [...list, { ...clean, id: Date.now() }]);
      notify("Transaction added");
    }
    setForm(emptyForm());
    onDone();
  };

  return (
    <form className="card f" onSubmit={submit} noValidate>
      <h2>{editing ? "Edit transaction" : "Add transaction"}</h2>
      <label>Title
        <input name="title" value={form.title} onChange={change} placeholder="e.g. Lunch" />
        {errors.title && <span className="err">{errors.title}</span>}
      </label>
      <label>Amount (₹)
        <input name="amount" type="number" min="0" value={form.amount} onChange={change} />
        {errors.amount && <span className="err">{errors.amount}</span>}
      </label>
      <label>Type
        <select name="type" value={form.type} onChange={change}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label>Category
        <select name="category" value={form.category} onChange={change}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Date
        <input name="date" type="date" value={form.date} onChange={change} />
        {errors.date && <span className="err">{errors.date}</span>}
      </label>
      <button className="btn" type="submit">{editing ? "Save changes" : "Add transaction"}</button>
      {editing && <button className="btn ghost" type="button" onClick={onDone}>Cancel</button>}
    </form>
  );
}
