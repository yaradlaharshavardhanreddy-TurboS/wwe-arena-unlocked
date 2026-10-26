import PlayerCard from '../Roster/PlayerCard'
import ArenaCard from '../Dashboard/ArenaCard'

// Page 2: everything the player has unlocked so far.
export default function CollectionPage({ arenas, players, arenaIds, playerIds, onOpenPlayer, onGoVault }) {
  const myPlayers = players.filter((p) => playerIds.includes(p.id))
  const myArenas = arenas.filter((a) => arenaIds.includes(a.id))

  return (
    <main className="layout collection">
      <div>
        <h1>My collection</h1>
        <p className="muted">
          {myPlayers.length} of {players.length} superstars and {myArenas.length} of {arenas.length} arenas unlocked.
        </p>

        <section className="roster">
          <h2>Superstars</h2>
          {myPlayers.length === 0 ? (
            <div className="empty">
              <p>No superstars yet. Win tokens in the vault, then unlock your first one.</p>
              <button className="btn btn-ghost" onClick={onGoVault}>Go to the vault</button>
            </div>
          ) : (
            <div className="player-grid">
              {myPlayers.map((p) => <PlayerCard key={p.id} player={p} unlocked onOpen={onOpenPlayer} />)}
            </div>
          )}
        </section>

        <section className="roster">
          <h2>Arenas</h2>
          {myArenas.length === 0 ? (
            <div className="empty">
              <p>No arenas yet. Pass a trivia challenge to unlock one.</p>
              <button className="btn btn-ghost" onClick={onGoVault}>Go to the vault</button>
            </div>
          ) : (
            <div className="vault-grid">
              {myArenas.map((a) => <ArenaCard key={a.id} arena={a} unlocked />)}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
