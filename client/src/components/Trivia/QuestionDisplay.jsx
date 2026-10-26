export default function QuestionDisplay({ text, era, step, total }) {
  return (
    <div>
      <p className="muted">Question {step} of {total}, {era}</p>
      <p className="question">{text}</p>
    </div>
  )
}
