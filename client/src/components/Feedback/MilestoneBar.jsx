export default function MilestoneBar({ current, total }) {
  const pct = total ? Math.round((current / total) * 100) : 0
  return (
    <section className="milestone">
      <div className="milestone-row">
        <span>{pct === 100 ? 'Vault complete' : 'Vault progress'}</span>
        <span className="gold">{pct}%</span>
      </div>
      <div className="track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
    </section>
  )
}
