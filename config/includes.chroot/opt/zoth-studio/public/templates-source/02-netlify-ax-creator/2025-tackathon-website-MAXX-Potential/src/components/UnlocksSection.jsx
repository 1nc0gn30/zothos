import './UnlocksSection.css'

const UnlocksSection = ({ stations, unlocks }) => {
  return (
    <section className="section unlocks" id="unlocks">
      <div className="section__header">
        <h2>Unlocked Effects</h2>
        <p className="section__sub">Every correct answer flips a switch. Track your upgrades below.</p>
      </div>
      <div className="unlock__grid">
        {stations.map((station) => {
          const reward = unlocks[station.id]
          return (
            <div key={station.id} className={`unlock__card ${reward ? 'unlock__card--on' : ''}`}>
              <div className="unlock__header">
                <span className="badge">{reward ? 'ON' : 'OFF'}</span>
                <h3>{station.title}</h3>
              </div>
              <p className="unlock__note">{station.reward}</p>
              <p className="unlock__time">{reward ? `Unlocked at ${reward.time}` : 'Answer the trivia to activate.'}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UnlocksSection
