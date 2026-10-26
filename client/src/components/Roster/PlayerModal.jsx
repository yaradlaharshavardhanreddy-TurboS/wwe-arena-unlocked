import { useEffect } from 'react'
import PlayerPortrait from './PlayerPortrait'

export default function PlayerModal({ player, unlocked, tokens, onUnlock, onClose }) {
  useEffect(() => {
    if (!player) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [player, onClose])

  if (!player) return null
  const short = player.cost - tokens

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={player.name} onClick={onClose}>
      <div className="modal player-modal" onClick={(e) => e.stopPropagation()}>
        <PlayerPortrait player={player} locked={!unlocked} />
        <h2>{player.name}</h2>
        <p className="muted">{player.style}, {player.tier} tier</p>
        <p className="player-bio">{player.bio}</p>
        <p className="muted">Signature move: <b className="gold">{player.move}</b></p>
        {unlocked ? (
          <span className="badge">Unlocked, he is on your roster</span>
        ) : (
          <button className="btn btn-primary" disabled={short > 0} onClick={() => onUnlock(player)}>
            {short > 0 ? `Need ${short} more tokens` : `Unlock for ${player.cost} tokens`}
          </button>
        )}
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
