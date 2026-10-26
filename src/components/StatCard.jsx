export function StatCard({ label, value, tone }) {
  return (
    <div className="card stat">
      <small>{label}</small>
      <b className={tone}>{value}</b>
    </div>
  );
}
