import ArenaCard from './ArenaCard'

export default function VaultGrid({ arenas, unlockedIds, activeId, tokens, onSelect }) {
  return (
    <section>
      <h2>The vault</h2>
      <div className="vault-grid">
        {arenas.map((a) => (
          <ArenaCard key={a.id} arena={a} unlocked={unlockedIds.includes(a.id)} active={activeId === a.id}
            busy={activeId != null} tokens={tokens} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
