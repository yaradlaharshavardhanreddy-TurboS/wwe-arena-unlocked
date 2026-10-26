import { useState } from 'react'

// Shows player.image if the file exists, otherwise a colored monogram.
export default function PlayerPortrait({ player, locked }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`portrait ${locked ? 'portrait-locked' : ''}`} style={{ '--tone': player.color }}>
      {failed
        ? <span className="monogram" aria-hidden="true">{player.initials}</span>
        : <img src={player.image} alt={locked ? '' : player.name} onError={() => setFailed(true)} />}
      {locked && <span className="lock-tag" aria-hidden="true">🔒</span>}
    </div>
  )
}
