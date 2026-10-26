import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth, publicUser, wrap } from '../auth.js'
import { ARENAS, PLAYERS, PASS_MARK, DAILY_BONUS, QUESTION_SECONDS, ANSWER_GRACE_SECONDS, publicCatalog } from '../data.js'

const router = Router()

router.get('/catalog', (req, res) => res.json(publicCatalog()))

router.use(requireAuth)

// Loading the page counts as leaving: an unfinished challenge is a forfeit (fee already paid).
router.get('/me', wrap(async (req, res) => {
  let user = req.user
  if (user.attempt) {
    user = await User.findByIdAndUpdate(user.id, { $set: { attempt: null, 'progress.streak': 0 } }, { new: true })
  }
  res.json({ user: publicUser(user) })
}))

router.get('/leaderboard', wrap(async (req, res) => {
  const users = await User.find({ verified: true }).select('username progress').lean()
  const rows = users
    .map((u) => ({
      isMe: String(u._id) === req.user.id,
      username: u.username,
      arenas: u.progress.unlocked.length,
      players: u.progress.players.length,
      tokens: u.progress.tokens,
    }))
    .sort((a, b) => (b.arenas + b.players) - (a.arenas + a.players) || b.tokens - a.tokens)
    .slice(0, 10)
    .map((r, i) => ({ rank: i + 1, ...r }))
  res.json({ rows })
}))

// Start a challenge: the fee is charged atomically, then the questions (without answers) are returned.
router.post('/arenas/:id/start', wrap(async (req, res) => {
  const arena = ARENAS.find((a) => a.id === Number(req.params.id))
  if (!arena) return res.status(404).json({ error: 'Unknown arena.' })
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, attempt: null, 'progress.tokens': { $gte: arena.cost }, 'progress.unlocked': { $ne: arena.id } },
    { $inc: { 'progress.tokens': -arena.cost }, $set: { attempt: { arenaId: arena.id, step: 0, score: 0, qStartedAt: new Date() } } },
    { new: true }
  )
  if (!user) return res.status(400).json({ error: 'You cannot enter this arena right now. Check your tokens and that it is still locked.' })
  res.json({ user: publicUser(user), questions: arena.questions.map(({ q, options }) => ({ q, options })) })
}))

// Grade one answer on the server. Late or timed-out answers count as wrong.
router.post('/arenas/:id/answer', wrap(async (req, res) => {
  const id = Number(req.params.id)
  const arena = ARENAS.find((a) => a.id === id)
  const at = req.user.attempt
  if (!arena || !at || at.arenaId !== id) return res.status(400).json({ error: 'No challenge is running for this arena.' })

  const question = arena.questions[at.step]
  const choice = Number(req.body.choice)
  const late = Date.now() - at.qStartedAt.getTime() > (QUESTION_SECONDS + ANSWER_GRACE_SECONDS) * 1000
  const correct = !late && Number.isInteger(choice) && choice === question.correct
  const score = at.score + (correct ? 1 : 0)
  const guard = { _id: req.user.id, 'attempt.arenaId': id, 'attempt.step': at.step } // blocks double submits

  if (at.step < arena.questions.length - 1) {
    const r = await User.updateOne(guard, { $set: { attempt: { arenaId: id, step: at.step + 1, score, qStartedAt: new Date() } } })
    if (r.modifiedCount === 0) return res.status(409).json({ error: 'That answer was already recorded.' })
    return res.json({ correct, correctIndex: question.correct, finished: false })
  }

  const passed = score >= PASS_MARK
  const update = passed
    ? { $set: { attempt: null }, $inc: { 'progress.tokens': arena.reward, 'progress.streak': 1 }, $push: { 'progress.unlocked': arena.id } }
    : { $set: { attempt: null, 'progress.streak': 0 } }
  const user = await User.findOneAndUpdate(guard, update, { new: true })
  if (!user) return res.status(409).json({ error: 'That answer was already recorded.' })
  res.json({ correct, correctIndex: question.correct, finished: true, passed, score, user: publicUser(user) })
}))

router.post('/arenas/:id/forfeit', wrap(async (req, res) => {
  const id = Number(req.params.id)
  const user = await User.findOneAndUpdate({ _id: req.user.id, 'attempt.arenaId': id }, { $set: { attempt: null, 'progress.streak': 0 } }, { new: true })
  res.json({ user: publicUser(user || req.user) })
}))

router.post('/players/:id/unlock', wrap(async (req, res) => {
  const player = PLAYERS.find((p) => p.id === req.params.id)
  if (!player) return res.status(404).json({ error: 'Unknown superstar.' })
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'progress.players': { $ne: player.id }, 'progress.tokens': { $gte: player.cost } },
    { $inc: { 'progress.tokens': -player.cost }, $push: { 'progress.players': player.id } },
    { new: true }
  )
  if (!user) return res.status(400).json({ error: 'Not enough tokens, or you already own this superstar.' })
  res.json({ user: publicUser(user) })
}))

router.post('/bonus', wrap(async (req, res) => {
  const day = new Date().toISOString().slice(0, 10)
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'progress.bonusDay': { $ne: day } },
    { $inc: { 'progress.tokens': DAILY_BONUS }, $set: { 'progress.bonusDay': day } },
    { new: true }
  )
  if (!user) return res.status(400).json({ error: 'You already claimed today\'s bonus.' })
  res.json({ user: publicUser(user) })
}))

export default router
