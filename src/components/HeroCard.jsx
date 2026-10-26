import { useApp } from "../context/AppContext";
import { money } from "../utils/helpers";

export function HeroCard() {
  const { stats } = useApp();
  return (
    <section className="hero-card" aria-label="Balance summary">
      <div><small>Total balance</small><br /><span className="big">{money(stats.balance)}</span></div>
      <div className="chips">
        <span className="chip">⬆ Income {money(stats.income)}</span>
        <span className="chip">⬇ Spent {money(stats.expense)}</span>
        <span className="chip">💰 Saved {money(stats.saved)}</span>
      </div>
    </section>
  );
}
