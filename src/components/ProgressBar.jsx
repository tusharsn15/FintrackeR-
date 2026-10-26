export function ProgressBar({ percent }) {
  const level = percent >= 100 ? "over" : percent >= 75 ? "warn" : "";
  return <div className="bar"><i className={level} style={{ width: Math.min(percent, 100) + "%" }} /></div>;
}
