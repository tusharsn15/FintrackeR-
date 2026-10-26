import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GoalCard } from "../components/GoalCard";

export function Goals() {
  const { notify } = useApp();
  const [goals, setGoals] = useLocalStorage("fintrack-goals", []);
  const blank = { name: "", target: "", saved: "0", date: "" };
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addGoal = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !(Number(form.target) > 0)) {
      setError("Enter a goal name and a target above 0.");
      return;
    }
    setError("");
    setGoals([...goals, { id: Date.now(), name: form.name.trim(), target: Number(form.target), saved: Number(form.saved) || 0, date: form.date }]);
    setForm(blank);
    notify("Goal added");
  };
  const addSavings = (id, value) => setGoals(goals.map((g) => (g.id === id ? { ...g, saved: g.saved + value } : g)));
  const removeGoal = (g) => { if (window.confirm('Delete goal "' + g.name + '"?')) setGoals(goals.filter((x) => x.id !== g.id)); };

  return (
    <div className="page two">
      <form className="card f" onSubmit={addGoal} noValidate>
        <h2>New savings goal</h2>
        <label>Goal name<input name="name" value={form.name} onChange={change} placeholder="e.g. New laptop" /></label>
        <label>Target amount (₹)<input name="target" type="number" min="0" value={form.target} onChange={change} /></label>
        <label>Already saved (₹)<input name="saved" type="number" min="0" value={form.saved} onChange={change} /></label>
        <label>Target date (optional)<input name="date" type="date" value={form.date} onChange={change} /></label>
        {error && <span className="err">{error}</span>}
        <button className="btn" type="submit">Add goal</button>
      </form>
      <div className="grid">
        {goals.length === 0 && <div className="card empty">No goals yet. Add your first one to start saving.</div>}
        {goals.map((g) => <GoalCard key={g.id} goal={g} onAdd={(v) => addSavings(g.id, v)} onDelete={() => removeGoal(g)} />)}
      </div>
    </div>
  );
}
