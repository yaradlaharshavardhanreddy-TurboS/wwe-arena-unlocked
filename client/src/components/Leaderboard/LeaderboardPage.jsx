import { useState, useEffect } from 'react'
import { api } from '../../api'

export default function LeaderboardPage() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.leaderboard().then((r) => setRows(r.rows)).catch((e) => setError(e.message))
  }, [])

  return (
    <main className="layout">
      <div>
        <h1>Leaderboard</h1>
        <p className="muted">Top 10 players, ranked by arenas plus superstars unlocked. Tokens break ties.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        {!rows && !error && <p className="muted">Loading the rankings</p>}
        {rows && (
          <div className="table-wrap">
            <table className="board">
              <thead>
                <tr><th>Rank</th><th>Player</th><th>Arenas</th><th>Superstars</th><th>Tokens</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.rank} className={r.isMe ? 'me' : ''}>
                    <td>{r.rank}</td><td>{r.username}{r.isMe ? ' (you)' : ''}</td><td>{r.arenas}</td><td>{r.players}</td><td>{r.tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
