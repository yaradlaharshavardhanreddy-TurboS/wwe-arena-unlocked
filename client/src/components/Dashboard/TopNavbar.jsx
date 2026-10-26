import SoundToggle from '../Feedback/SoundToggle'

export default function TopNavbar({ user, tokens, muted, page, navLocked, onNavigate, onToggleSound, onLogout }) {
  const tab = (id, label) => (
    <button
      className={`tab ${page === id ? 'tab-active' : ''}`}
      aria-current={page === id ? 'page' : undefined}
      disabled={navLocked && page !== id}
      title={navLocked && page !== id ? 'Finish or forfeit your challenge first' : undefined}
      onClick={() => onNavigate(id)}
    >
      {label}
    </button>
  )

  return (
    <header className="navbar">
      <div className="brand">Arena <span>Unlocked</span></div>
      <nav className="tabs" aria-label="Pages">
        {tab('vault', 'The vault')}
        {tab('collection', 'My collection')}
        {tab('leaderboard', 'Leaderboard')}
      </nav>
      <div className="nav-actions">
        <SoundToggle muted={muted} onToggle={onToggleSound} />
        <span className="tokens">🪙 {tokens} tokens</span>
        <span className="muted">{user}</span>
        <button className="btn btn-ghost" onClick={onLogout}>Sign out</button>
      </div>
    </header>
  )
}
