import { useState } from 'react'

// File name = arena name in lowercase with dashes, for example "SummerSlam 1992" -> summerslam-1992.jpg
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ArenaCard({ arena, unlocked, active, busy, tokens, onSelect }) {
  const [noImage, setNoImage] = useState(false) // true when there is no image file, so the emoji shows instead
  const short = tokens < arena.cost
  return (
    <article className={`arena ${unlocked ? 'is-unlocked' : 'is-locked'} ${active ? 'is-active' : ''}`}>
      <div className="arena-art">
        {noImage ? (
          <span aria-hidden="true">{unlocked ? arena.icon : '🔒'}</span>
        ) : (
          <img src={`/arenas/${slug(arena.name)}.jpg`} alt="" onError={() => setNoImage(true)} />
        )}
        {!noImage && !unlocked && <span className="arena-lock" aria-hidden="true">🔒</span>}
      </div>
      <div className="arena-body">
        <h3>{arena.name}</h3>
        <p className="muted">{arena.era}</p>
        {unlocked ? (
          <span className="badge">Unlocked</span>
        ) : (
          <>
            <p className="muted">Entry {arena.cost} tokens. Win +{arena.reward}.</p>
            <button className="btn btn-primary" disabled={busy || short} onClick={() => onSelect(arena)}>
              {short ? `Need ${arena.cost} tokens` : 'Enter challenge'}
            </button>
          </>
        )}
      </div>
    </article>
  )
}