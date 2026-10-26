import { useState } from 'react'

export default function VerifyForm({ email, info, error, busy, onVerify, onResend, onBack }) {
  const [code, setCode] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onVerify(code.trim())
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <h1>Check your email</h1>
      <p className="muted">We sent a 6-digit code to {email}. It expires in 10 minutes.</p>
      <label>Verification code
        <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} />
      </label>
      {info && <p className="form-info">{info}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>Verify and enter</button>
      <p className="muted">
        <button type="button" className="link-btn" onClick={onResend} disabled={busy}>Send a new code</button>
        {' or '}
        <button type="button" className="link-btn" onClick={onBack}>change details</button>
      </p>
    </form>
  )
}
