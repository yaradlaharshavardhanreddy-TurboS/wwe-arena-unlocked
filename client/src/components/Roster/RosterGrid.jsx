import PlayerCard from './PlayerCard'

export default function RosterGrid({ players, ownedIds, onOpen }) {
  return (
    <section className="roster">
      <h2>Superstar roster</h2>
      <p className="muted">Spend the tokens you win to unlock the superstars you want.</p>
      <div className="player-grid">
        {players.map((p) => (
          <PlayerCard key={p.id} player={p} unlocked={ownedIds.includes(p.id)} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
