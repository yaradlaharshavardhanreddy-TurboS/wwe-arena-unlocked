import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'
import { sign, publicUser, wrap } from '../auth.js'
import { sendCode } from '../mailer.js'
import { STARTER_PROGRESS } from '../data.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many attempts. Wait a few minutes and try again.' } }))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_TTL_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 30 * 1000
const clean = (v) => String(v ?? '').trim()
const hashCode = (code) => crypto.createHash('sha256').update(code + process.env.JWT_SECRET).digest('hex')

// Creates a fresh 6-digit code, stores only its hash, and emails it.
async function issueCode(user) {
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0')
  user.codeHash = hashCode(code)
  user.codeExpires = new Date(Date.now() + CODE_TTL_MS)
  user.codeAttempts = 0
  user.codeSentAt = new Date()
  await user.save()
  await sendCode(user.email, code)
}

const mailFailed = (res, e) => {
  console.error('Email failed:', e.message)
  return res.status(502).json({ error: 'We could not send the email. Try again in a minute.' })
}

router.post('/signup', wrap(async (req, res) => {
  const username = clean(req.body.username)
  const email = clean(req.body.email).toLowerCase()
  const password = String(req.body.password ?? '')
  if (username.length < 3 || username.length > 24) return res.status(400).json({ error: 'Username must be 3 to 24 characters.' })
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' })

  let user = await User.findOne({ email })
  if (user?.verified) return res.status(409).json({ error: 'That email already has an account. Sign in instead.' })

  const passwordHash = await bcrypt.hash(password, 10)
  if (!user) user = new User({ email, username, passwordHash, progress: STARTER_PROGRESS })
  else { user.username = username; user.passwordHash = passwordHash }

  try { await issueCode(user) } catch (e) { return mailFailed(res, e) }
  res.json({ ok: true })
}))

router.post('/verify', wrap(async (req, res) => {
  const email = clean(req.body.email).toLowerCase()
  const code = clean(req.body.code)
  const user = await User.findOne({ email })
  if (!user || user.verified || !user.codeHash) return res.status(400).json({ error: 'There is no pending signup for that email.' })
  if (user.codeExpires < new Date()) return res.status(400).json({ error: 'That code expired. Ask for a new one.' })
  if (user.codeAttempts >= 5) return res.status(429).json({ error: 'Too many wrong codes. Ask for a new one.' })
  if (hashCode(code) !== user.codeHash) {
    user.codeAttempts += 1
    await user.save()
    return res.status(400).json({ error: 'That code is not right. Check your email and try again.' })
  }
  user.verified = true
  user.codeHash = undefined
  user.codeExpires = undefined
  await user.save()
  res.json({ token: sign(user), user: publicUser(user) })
}))

router.post('/resend', wrap(async (req, res) => {
  const email = clean(req.body.email).toLowerCase()
  const user = await User.findOne({ email })
  if (!user || user.verified) return res.json({ ok: true }) // do not reveal which emails exist
  if (user.codeSentAt && Date.now() - user.codeSentAt.getTime() < RESEND_COOLDOWN_MS) {
    return res.status(429).json({ error: 'Wait 30 seconds before asking for another code.' })
  }
  try { await issueCode(user) } catch (e) { return mailFailed(res, e) }
  res.json({ ok: true })
}))

router.post('/login', wrap(async (req, res) => {
  const email = clean(req.body.email).toLowerCase()
  const password = String(req.body.password ?? '')
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Email or password is incorrect.' })
  }
  if (!user.verified) {
    const recent = user.codeSentAt && Date.now() - user.codeSentAt.getTime() < RESEND_COOLDOWN_MS
    if (!recent) { try { await issueCode(user) } catch (e) { return mailFailed(res, e) } }
    return res.status(403).json({ error: 'Verify your email first.', needsVerify: true })
  }
  res.json({ token: sign(user), user: publicUser(user) })
}))

export default router
