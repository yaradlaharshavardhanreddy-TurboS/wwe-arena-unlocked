import mongoose from 'mongoose'

const attemptSchema = new mongoose.Schema(
  { arenaId: Number, step: Number, score: Number, qStartedAt: Date },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 24 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    verified: { type: Boolean, default: false },
    codeHash: String,
    codeExpires: Date,
    codeAttempts: { type: Number, default: 0 },
    codeSentAt: Date,
    progress: {
      tokens: { type: Number, default: 50 },
      unlocked: { type: [Number], default: [] },
      players: { type: [String], default: [] },
      streak: { type: Number, default: 0 },
      bonusDay: { type: String, default: '' },
    },
    attempt: { type: attemptSchema, default: null }, // the challenge currently running, if any
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
