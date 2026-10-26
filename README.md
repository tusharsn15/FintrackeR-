# FinTrack – Smart Expense Tracker

Built with React only (plus Vite to run it). No router, chart or UI libraries.

## Run
```
npm install
npm run dev
```
Open the link shown in the terminal. Build for hosting with `npm run build`.

## Folders
- `src/pages/` one file per screen: Landing, Login, Dashboard, Transactions, Budgets, Bills, Goals, Calendar, Reports, Settings
- `src/components/` small reusable parts: Shell (sidebar), StatCard, ProgressBar, TransactionForm, GoalCard, HeroCard, HealthCard, DueSoon, SpendingCoach
- `src/context/AppContext.jsx` shared data (Context API)
- `src/hooks/useLocalStorage.js` saves data in the browser
- `src/utils/helpers.js` money, date and sum helpers
- `src/data/demoData.js` sample data
- `src/styles.css` all styling

## Notes
- Login is a frontend-only demo, not real security.
- Data stays in this browser and is not synced to the cloud.
- Month-end figures are estimates, and the spending coach uses simple rules, not AI.
