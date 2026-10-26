// status: idle | correct | wrong | dim
export default function OptionButton({ text, index, status, disabled, onChoose }) {
  return (
    <button className={`option option-${status}`} disabled={disabled} onClick={() => onChoose(index)}>
      <b>{String.fromCharCode(65 + index)}</b> {text}
    </button>
  )
}
