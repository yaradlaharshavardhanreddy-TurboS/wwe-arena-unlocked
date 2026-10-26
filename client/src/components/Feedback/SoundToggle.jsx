export default function SoundToggle({ muted, onToggle }) {
  return (
    <button className="btn btn-ghost" onClick={onToggle} aria-pressed={!muted}>
      {muted ? '🔇 Sound off' : '🔊 Sound on'}
    </button>
  )
}
