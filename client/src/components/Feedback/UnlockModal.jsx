// Shows the result of a challenge: unlocked or failed.
export default function UnlockModal({ result, onClose }) {
  if (!result) return null
  const { arena, passed, score, total } = result
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Challenge result">
      <div className={`modal ${passed ? '' : 'modal-fail'}`}>
        <div className="modal-icon" aria-hidden="true">{passed ? arena.icon : '🔒'}</div>
        <h2>{passed ? `${arena.name} unlocked` : `${arena.name} stays locked`}</h2>
        <p className="muted">
          You got {score} of {total} right.{' '}
          {passed ? `You earned ${arena.reward} tokens.` : `You lost the ${arena.cost} token entry fee. Study up and try again.`}
        </p>
        <button className="btn btn-primary" onClick={onClose} autoFocus>Back to the vault</button>
      </div>
    </div>
  )
}
