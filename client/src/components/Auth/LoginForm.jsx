import { useState } from 'react'

export default function LoginForm({ onLogin, onSwitch, error, busy }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onLogin({ email: email.trim().toLowerCase(), password })
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <h1>Enter the arena</h1>
      <p className="muted">Sign in to keep your unlocked arenas and tokens.</p>
      <label>Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Password
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>Sign in</button>
      <p className="muted">New here? <button type="button" className="link-btn" onClick={onSwitch}>Create an account</button></p>
    </form>
  )
}
