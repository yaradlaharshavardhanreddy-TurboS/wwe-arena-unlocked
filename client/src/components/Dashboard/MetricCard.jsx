export default function MetricCard({ label, value, gold }) {
  return (
    <div className={`metric ${gold ? 'metric-gold' : ''}`}>
      <span className="metric-value">{value}</span>
      <span className="muted">{label}</span>
    </div>
  )
}
