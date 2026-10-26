import { useState, useEffect } from 'react'
import './App.css'
import { api, getToken, setToken } from './api'
import LoginForm from './components/Auth/LoginForm'
import SignupForm from './components/Auth/SignupForm'
import VerifyForm from './components/Auth/VerifyForm'
import TopNavbar from './components/Dashboard/TopNavbar'
import StatPanel from './components/Dashboard/StatPanel'
import VaultGrid from './components/Dashboard/VaultGrid'
import TriviaWindow from './components/Trivia/TriviaWindow'
import UnlockModal from './components/Feedback/UnlockModal'
import MilestoneBar from './components/Feedback/MilestoneBar'
import RosterGrid from './components/Roster/RosterGrid'
import PlayerModal from './components/Roster/PlayerModal'
import CollectionPage from './components/Collection/CollectionPage'
import LeaderboardPage from './components/Leaderboard/LeaderboardPage'

const today = () => new Date().toISOString().slice(0, 10) // UTC, same as the server

const beep = (ok) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.frequency.value = ok ? 660 : 180
    osc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch { /* audio not available */ }
}

// The central hub. The server is the source of truth for tokens, unlocks and grading.
export default function App() {
  const [catalog, setCatalog] = useState(null)   // arenas, superstars and rules from the server
  const [booting, setBooting] = useState(true)
  const [bootError, setBootError] = useState('')
  const [user, setUser] = useState(null)         // { username, email, progress }
  const [screen, setScreen] = useState('login')  // login | signup | verify
  const [pendingEmail, setPendingEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [authInfo, setAuthInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [quiz, setQuiz] = useState(null)         // { arena, questions }
  const [result, setResult] = useState(null)
  const [notice, setNotice] = useState('')
  const [muted, setMuted] = useState(false)
  const [page, setPage] = useState('vault')      // vault | collection | leaderboard
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cat = await api.catalog()
        if (alive) setCatalog(cat)
        if (getToken()) {
          try { const { user: me } = await api.me(); if (alive) setUser(me) } catch { setToken(null) }
        }
      } catch (e) {
        if (alive) setBootError(e.message)
      }
      if (alive) setBooting(false)
    })()
    return () => { alive = false }
  }, [])

  // ---- auth ----
  const authAction = async (fn) => {
    setAuthError(''); setAuthInfo(''); setBusy(true)
    try { await fn() } catch (e) { setAuthError(e.message) } finally { setBusy(false) }
  }

  const signedIn = ({ token, user: u }) => { setToken(token); setUser(u); setPage('vault'); setScreen('login') }

  const signup = (form) => authAction(async () => {
    await api.signup(form)
    setPendingEmail(form.email)
    setAuthInfo(`We sent a code to ${form.email}.`)
    setScreen('verify')
  })

  const verify = (code) => authAction(async () => signedIn(await api.verify({ email: pendingEmail, code })))

  const resend = () => authAction(async () => {
    await api.resend({ email: pendingEmail })
    setAuthInfo('A new code is on its way.')
  })

  const login = (form) => authAction(async () => {
    try {
      signedIn(await api.login(form))
    } catch (e) {
      if (!e.data?.needsVerify) throw e
      setPendingEmail(form.email)
      setAuthInfo('Verify your email first. We sent you a new code.')
      setScreen('verify')
    }
  })

  const logout = () => {
    setToken(null)
    setUser(null); setQuiz(null); setResult(null); setPlayer(null); setNotice(''); setPage('vault'); setScreen('login')
  }

  // ---- game actions: all go through the server ----
  const gameAction = async (fn) => {
    try { return await fn() } catch (e) {
      if (e.status === 401) logout(); else setNotice(e.message)
      return null
    }
  }

  const startQuiz = async (arena) => {
    const r = await gameAction(() => api.startArena(arena.id))
    if (!r) return
    setNotice(''); setUser(r.user)
    setQuiz({ arena: { ...arena, questions: r.questions } })
  }

  const finish = (res) => {
    setUser(res.user)
    setResult({ arena: quiz.arena, passed: res.passed, score: res.score, total: quiz.arena.questions.length })
    setQuiz(null)
    if (!muted) beep(res.passed)
  }

  // Something failed mid-challenge: close it and re-sync with the server.
  const abortQuiz = async (message) => {
    setQuiz(null); setNotice(message)
    try { const { user: me } = await api.me(); setUser(me) } catch { /* ignore */ }
  }

  const forfeit = async () => {
    const r = await gameAction(() => api.forfeit(quiz.arena.id))
    if (r) setUser(r.user)
    setQuiz(null)
  }

  const unlockPlayer = async (p) => {
    const r = await gameAction(() => api.unlockPlayer(p.id))
    if (r) { setUser(r.user); if (!muted) beep(true) }
  }

  const claimBonus = async () => {
    const r = await gameAction(() => api.bonus())
    if (r) { setUser(r.user); setNotice(`Daily bonus claimed: +${catalog.dailyBonus} tokens.`) }
  }

  // ---- screens ----
  if (booting) return <main className="auth-wrap"><p className="muted">Loading</p></main>
  if (bootError) {
    return (
      <main className="auth-wrap">
        <div className="auth-card"><h1>Server not reachable</h1><p className="form-error">{bootError}</p>
          <p className="muted">Start the server (see the README), then reload this page.</p></div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="auth-wrap">
        {screen === 'login' && <LoginForm onLogin={login} onSwitch={() => { setAuthError(''); setScreen('signup') }} error={authError} busy={busy} />}
        {screen === 'signup' && <SignupForm onSignup={signup} onSwitch={() => { setAuthError(''); setScreen('login') }} error={authError} busy={busy} />}
        {screen === 'verify' && (
          <VerifyForm email={pendingEmail} info={authInfo} error={authError} busy={busy}
            onVerify={verify} onResend={resend} onBack={() => { setAuthError(''); setAuthInfo(''); setScreen('signup') }} />
        )}
      </main>
    )
  }

  const progress = user.progress
  const canClaim = progress.bonusDay !== today()

  return (
    <div className="app">
      <TopNavbar user={user.username} tokens={progress.tokens} muted={muted} page={page} navLocked={!!quiz} onNavigate={setPage}
        onToggleSound={() => setMuted((m) => !m)} onLogout={logout} />
      {page === 'leaderboard' && <LeaderboardPage />}
      {page === 'collection' && (
        <CollectionPage arenas={catalog.arenas} players={catalog.players} arenaIds={progress.unlocked} playerIds={progress.players}
          onOpenPlayer={setPlayer} onGoVault={() => setPage('vault')} />
      )}
      {page === 'vault' && (
        <main className={`layout ${quiz ? 'with-trivia' : ''}`}>
          <div>
            <StatPanel tokens={progress.tokens} unlocked={progress.unlocked.length} total={catalog.arenas.length}
              players={progress.players.length} totalPlayers={catalog.players.length} streak={progress.streak} />
            <MilestoneBar current={progress.unlocked.length} total={catalog.arenas.length} />
            {(notice || canClaim) && (
              <div className="notice">
                <span>{notice || 'Your daily bonus is ready.'}</span>
                {canClaim && <button className="btn btn-ghost" onClick={claimBonus}>Claim +{catalog.dailyBonus} tokens</button>}
              </div>
            )}
            <VaultGrid arenas={catalog.arenas} unlockedIds={progress.unlocked} activeId={quiz?.arena.id} tokens={progress.tokens} onSelect={startQuiz} />
            <RosterGrid players={catalog.players} ownedIds={progress.players} onOpen={setPlayer} />
          </div>
          {quiz && (
            <TriviaWindow key={quiz.arena.id} arena={quiz.arena} passMark={catalog.passMark} seconds={catalog.questionSeconds}
              onAnswer={api.answer} onDone={finish} onError={abortQuiz} onForfeit={forfeit} />
          )}
        </main>
      )}
      <UnlockModal result={result} onClose={() => setResult(null)} />
      <PlayerModal player={player} unlocked={player ? progress.players.includes(player.id) : false} tokens={progress.tokens}
        onUnlock={unlockPlayer} onClose={() => setPlayer(null)} />
    </div>
  )
}
