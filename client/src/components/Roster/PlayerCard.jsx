import PlayerPortrait from './PlayerPortrait'

export default function PlayerCard({ player, unlocked, onOpen }) {
  return (
    <button className={`player ${unlocked ? 'is-unlocked' : ''}`} onClick={() => onOpen(player)}>
      <PlayerPortrait player={player} locked={!unlocked} />
      <div className="player-body">
        <h3>{player.name}</h3>
        <p className="muted">{player.style}, {player.tier}</p>
        {unlocked ? <span className="badge">Unlocked</span> : <span className="price">🪙 {player.cost}</span>}
      </div>
    </button>
  )
}
