import { useState } from "react";
import { money } from "../utils/helpers";
import { ProgressBar } from "./ProgressBar";

export function GoalCard({ goal, onAdd, onDelete }) {
  const [amount, setAmount] = useState("");
  const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const left = Math.max(0, goal.target - goal.saved);
  let estimate = "";
  if (goal.date && left > 0) {
    const months = Math.max(1, Math.ceil((new Date(goal.date) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
    estimate = "Estimate: about " + money(left / months) + " a month to reach it by " + goal.date + ".";
  }
  return (
    <div className="card">
      <h2>{goal.name}</h2>
      <p style={{ margin: "0 0 6px" }}>{money(goal.saved)} of {money(goal.target)} · {percent}%</p>
      <ProgressBar percent={percent} />
      <p className="note">{left === 0 ? "Goal reached. Well done!" : money(left) + " to go. " + estimate}</p>
      <div className="row2">
        <input aria-label="Amount to add" type="number" min="0" placeholder="₹ amount" value={amount} style={{ width: 120 }} onChange={(e) => setAmount(e.target.value)} />
        <button className="btn small" onClick={() => { if (Number(amount) > 0) { onAdd(Number(amount)); setAmount(""); } }}>Add savings</button>
        <button className="btn ghost small" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
