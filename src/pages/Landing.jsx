import { useApp } from "../context/AppContext";
import { money } from "../utils/helpers";

export function Landing({ onStart }) {
  const { stats, user, navigate } = useApp();
  const handleStart = (e) => {
    if (e && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
    }
    if (onStart) onStart();
    else navigate(user ? "/dashboard" : "/login");
  };

  return (
    <div className="wrap">
      <header className="top">
        <a
          href="/"
          className="logo"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault();
              navigate("/");
            }
          }}
        >
          Fin<span>Track</span>
        </a>
        <nav className="tabs" aria-label="Main">
          <a
            href={user ? "/dashboard" : "/login"}
            className="btn small"
            onClick={handleStart}
          >
            {user ? "Open dashboard" : "Log in"}
          </a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div>
            <h1>Know where your money went before the month ends.</h1>
            <p>FinTrack is a simple expense tracker for students. Log what you earn and spend, set budgets, and see your month-end estimate update as you go.</p>
            <p>
              <a
                href={user ? "/dashboard" : "/login"}
                className="btn"
                onClick={handleStart}
              >
                {user ? "Go to dashboard" : "Get started"}
              </a>
            </p>
          </div>
          <article className="ledger" aria-label="Sample ledger">
            <h3>This month so far</h3>
            <div className="row"><span>Income</span><b className="pos">{money(stats.income)}</b></div>
            <div className="row"><span>Spent</span><b className="neg">{money(stats.expense)}</b></div>
            <div className="row"><span>Saved</span><b>{money(stats.saved)}</b></div>
            <div className="pace">On pace to spend about <b>{money(stats.predicted)}</b> by month end.</div>
          </article>
        </section>
        <section className="feats" aria-label="Features">
          <article className="feat"><h3>Track every rupee</h3><p>Add, edit, search and filter income and expenses in seconds.</p></article>
          <article className="feat"><h3>Stay inside budgets</h3><p>Set category limits and get warnings at 75%, 90% and 100%.</p></article>
          <article className="feat"><h3>Get plain-language tips</h3><p>The spending coach reads your own data and points out what changed.</p></article>
        </section>
        <section className="cta">
          <h2>Sample data is loaded, so you can explore right away.</h2>
          <a
            href={user ? "/dashboard" : "/login"}
            className="btn"
            onClick={handleStart}
          >
            Open the dashboard
          </a>
        </section>
      </main>
      <footer>FinTrack saves data in this browser only. It is not synced to the cloud.</footer>
    </div>
  );
}
