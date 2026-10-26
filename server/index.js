import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import gameRoutes from './routes/game.js'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('Set JWT_SECRET (16+ characters) in server/.env')
  if (!process.env.VERCEL) process.exit(1)
}

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '10kb' }))
if (process.env.CLIENT_ORIGIN) app.use(cors({ origin: process.env.CLIENT_ORIGIN }))

let connecting
const connectDb = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve()
  connecting ??= mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wwe-arena', { serverSelectionTimeoutMS: 8000 })
    .catch((e) => { connecting = null; throw e })
  return connecting
}
app.use('/api', (req, res, next) => connectDb().then(() => next(), next))

app.use('/api/auth', authRoutes)
app.use('/api', gameRoutes)

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')
if (!process.env.VERCEL && fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

export default app

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000
  await connectDb()
  console.log('MongoDB connected')
  app.listen(port, () => console.log(`API running on http://localhost:${port}`))
}