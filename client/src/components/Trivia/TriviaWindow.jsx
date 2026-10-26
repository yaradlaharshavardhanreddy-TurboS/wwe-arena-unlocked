import { useState, useEffect } from 'react'
import QuestionDisplay from './QuestionDisplay'
import OptionButton from './OptionButton'

// The server holds the answers and grades every pick. This component only shows the questions and the timer.
export default function TriviaWindow({ arena, passMark, seconds, onAnswer, onDone, onError, onForfeit }) {
  const total = arena.questions.length
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null) // option index, or -1 when time ran out
  const [reveal, setReveal] = useState(null) // the server's verdict for this question
  const [left, setLeft] = useState(seconds)
  const q = arena.questions[step]
  const locked = picked !== null

  const submit = async (choice) => {
    setPicked(choice)
    try {
      const res = await onAnswer(arena.id, choice)
      if (res.correct) setScore((s) => s + 1)
      setReveal(res)
    } catch (e) {
      onError(e.message)
    }
  }

  useEffect(() => {
    if (locked) return
    if (left === 0) { submit(-1); return }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left, locked]) // eslint-disable-line react-hooks/exhaustive-deps

  // show the verdict briefly, then move on or finish
  useEffect(() => {
    if (!reveal) return
    const t = setTimeout(() => {
      if (reveal.finished) { onDone(reveal); return }
      setStep((s) => s + 1)
      setPicked(null)
      setReveal(null)
      setLeft(seconds)
    }, 1400)
    return () => clearTimeout(t)
  }, [reveal]) // eslint-disable-line react-hooks/exhaustive-deps

  const status = (i) => {
    if (!locked) return 'idle'
    if (!reveal) return i === picked ? 'pending' : 'dim'
    if (i === reveal.correctIndex) return 'correct'
    return i === picked ? 'wrong' : 'dim'
  }

  return (
    <aside className="trivia">
      <div className="trivia-head">
        <h2>{arena.name}</h2>
        <button className="btn btn-ghost" onClick={onForfeit}>Forfeit</button>
      </div>
      <p className="muted">Get {passMark} of {total} right to unlock. One try per question. Entry fee is not refunded.</p>
      <div className="timer" aria-label={`${left} seconds left`}>
        <div className={`timer-fill ${left <= 5 ? 'urgent' : ''}`} style={{ width: `${(left / seconds) * 100}%` }} />
      </div>
      <QuestionDisplay text={q.q} era={arena.era} step={step + 1} total={total} />
      <div className="options">
        {q.options.map((o, i) => (
          <OptionButton key={i} text={o} index={i} status={status(i)} disabled={locked} onChoose={submit} />
        ))}
      </div>
      <p className="muted score-line">Correct so far: {score}</p>
      {picked === -1 && reveal && <p className="form-error" role="alert">Time is up. That one counts as wrong.</p>}
    </aside>
  )
}
