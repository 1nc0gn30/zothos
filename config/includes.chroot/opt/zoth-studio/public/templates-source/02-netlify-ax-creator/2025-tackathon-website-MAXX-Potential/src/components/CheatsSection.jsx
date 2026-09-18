import './CheatsSection.css'

const CheatsSection = ({ cheatSheet }) => {
  return (
    <section className="section cheats" id="cheat-codes">
      <div className="section__header">
        <h2>1990s Christmas Cheat Codes</h2>
        <p className="section__sub">Drop these facts in the plaza chat to impress the elf moderators.</p>
      </div>
      <div className="cheat__grid">
        {cheatSheet.map((item) => (
          <article key={item.header} className="cheat__card">
            <h3>{item.header}</h3>
            <p>{item.body}</p>
          </article>
        ))}
        <article className="cheat__card bonus">
          <h3>Bonus Quest</h3>
          <p>
            Unlock all four hotspots to reveal snowglobe confetti, a Secret Santa VHS frame, and a candy-cane cursor. The plaza
            resets at midnight like a Tamagotchi nap.
          </p>
        </article>
      </div>
    </section>
  )
}

export default CheatsSection
