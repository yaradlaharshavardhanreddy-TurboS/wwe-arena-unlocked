import { useState } from 'react'

export default function SignupForm({ onSignup, onSwitch, error, busy }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSignup({ username: username.trim(), email: email.trim().toLowerCase(), password })
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <h1>Create your account</h1>
      <p className="muted">Pick a name to play under.</p>
      <label>Username
        <input required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Password (6+ characters)
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>Create account</button>
      <p className="muted">Have an account? <button type="button" className="link-btn" onClick={onSwitch}>Sign in</button></p>
    </form>
  )
}
