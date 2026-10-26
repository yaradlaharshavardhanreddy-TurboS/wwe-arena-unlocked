import jwt from 'jsonwebtoken'
import User from './models/User.js'

// Express 4 does not catch errors from async handlers, so wrap them.
export const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next)

export const sign = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const publicUser = (user) => {
  const o = user.toObject ? user.toObject() : user
  const p = o.progress
  return { username: o.username, email: o.email, progress: { tokens: p.tokens, unlocked: p.unlocked, players: p.players, streak: p.streak, bonusDay: p.bonusDay } }
}

export const requireAuth = wrap(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Sign in first.' })
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(id)
    if (!user || !user.verified) return res.status(401).json({ error: 'Sign in again.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Your session expired. Sign in again.' })
  }
})
