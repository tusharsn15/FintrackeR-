import { useApp } from "../context/AppContext";
import { greeting } from "../utils/helpers";
import { Dashboard } from "../pages/Dashboard";
import { Transactions } from "../pages/Transactions";
import { Budgets } from "../pages/Budgets";
import { Bills } from "../pages/Bills";
import { Goals } from "../pages/Goals";
import { CalendarPage } from "../pages/CalendarPage";
import { Reports } from "../pages/Reports";
import { Settings } from "../pages/Settings";
import { HeroCard } from "./HeroCard";
import { HealthCard } from "./HealthCard";
import { DueSoon } from "./DueSoon";

export const NAV = [["dashboard", "🏠 Dashboard"], ["transactions", "💳 Transactions"], ["budgets", "🎯 Budgets"], ["bills", "🔁 Bills"], ["goals", "🐷 Goals"], ["calendar", "📅 Calendar"], ["reports", "📊 Reports"], ["settings", "⚙️ Settings"]];

export function Shell({ onLogout }) {
  const { user, currentPath, navigate } = useApp();
  const routeKey = currentPath.replace(/^\//, "");
  const validKeys = NAV.map(([k]) => k);
  const page = validKeys.includes(routeKey) ? routeKey : "dashboard";

  const go = (target) => {
    const key = String(target).replace(/^\//, "");
    navigate("/" + key);
  };

  const navMatch = NAV.find(([key]) => key === page);
  const label = navMatch ? navMatch[1] : "🏠 Dashboard";
  const title = page === "dashboard" ? greeting() + ", " + user.name.split(" ")[0] : label;

  return (
    <div className="app">
      <header className="topbar">
        <a
          href="/dashboard"
          className="logo"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault();
              go("dashboard");
            }
          }}
        >
          Fin<span>Track</span>
        </a>
        <nav className="snav" aria-label="App">
          {NAV.map(([key, text]) => (
            <a
              key={key}
              href={"/" + key}
              className={"nv" + (page === key ? " on" : "")}
              aria-current={page === key ? "page" : undefined}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  go(key);
                }
              }}
            >
              {text}
            </a>
          ))}
        </nav>
        <div className="me">
          <button
            className="user-badge-btn"
            onClick={() => go("settings")}
            title="Go to Settings"
          >
            <span className="avatar" aria-hidden="true">{user.name[0].toUpperCase()}</span>
            <span className="who">{user.name}</span>
          </button>
          <button className="btn ghost small" onClick={onLogout}>Log out</button>
        </div>
      </header>
      <main className="main">
        <div className="head">
          <h1>{title}</h1>
          <button className="btn small" onClick={() => go("transactions")}>+ Add transaction</button>
        </div>
        {page === "dashboard" && (
          <>
            <div className="page">
              <HeroCard />
              <div className="grid c2"><HealthCard /><DueSoon go={go} /></div>
            </div>
            <Dashboard go={go} />
          </>
        )}
        {page === "transactions" && <Transactions />}
        {page === "budgets" && <Budgets />}
        {page === "goals" && <Goals />}
        {page === "reports" && <Reports />}
        {page === "bills" && <Bills />}
        {page === "calendar" && <CalendarPage />}
        {page === "settings" && <Settings />}
      </main>
    </div>
  );
}
