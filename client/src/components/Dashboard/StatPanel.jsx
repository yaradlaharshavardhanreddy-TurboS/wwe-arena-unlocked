import MetricCard from './MetricCard'

export default function StatPanel({ tokens, unlocked, total, players, totalPlayers, streak }) {
  return (
    <section className="stats">
      <MetricCard label="Vault tokens" value={tokens} gold />
      <MetricCard label="Arenas unlocked" value={`${unlocked} of ${total}`} />
      <MetricCard label="Superstars unlocked" value={`${players} of ${totalPlayers}`} />
      <MetricCard label="Correct in a row" value={streak} />
    </section>
  )
}
