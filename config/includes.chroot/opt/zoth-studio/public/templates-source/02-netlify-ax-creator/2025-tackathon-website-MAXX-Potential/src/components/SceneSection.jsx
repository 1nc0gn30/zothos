import Tracker from './Tracker'
import './SceneSection.css'

const SceneSection = ({
  stations,
  activeId,
  setActiveId,
  activeStation,
  answerInput,
  setAnswerInput,
  handleSubmit,
  unlocks,
  systemMessage,
  trackerState,
  trackerError,
  santaSnapshot,
  lastTrackerUpdate,
  refreshSanta
}) => {
  return (
    <section className="section scene" id="scene">
      <div className="section__header">
        <h2>Interactive Christmas Plaza</h2>
        <p className="section__sub">
          Click a hotspot to step inside, answer the 90s question, and add more tacky decor to the board.
        </p>
      </div>

      <Tracker
        trackerState={trackerState}
        trackerError={trackerError}
        santaSnapshot={santaSnapshot}
        lastTrackerUpdate={lastTrackerUpdate}
        refreshSanta={refreshSanta}
      />

      <div className="scene__layout">
        <div className="scene__board" role="grid" aria-label="Retro plaza game board">
          {stations.map((station) => {
            const isUnlocked = Boolean(unlocks[station.id])
            const isActive = station.id === activeId
            return (
              <button
                key={station.id}
                role="gridcell"
                className={`tile ${isActive ? 'tile--active' : ''} ${isUnlocked ? 'tile--unlocked' : ''}`}
                onClick={() => setActiveId(station.id)}
                aria-pressed={isActive}
              >
                <span className="tile__sprite" aria-hidden>
                  {station.sprite}
                </span>
                <span className="tile__title">{station.title}</span>
                <span className="tile__zone">{station.zone}</span>
                <span className="tile__status">{isUnlocked ? 'Unlocked' : 'Locked'}</span>
              </button>
            )
          })}
          <div className="scene__sparkle">✨</div>
        </div>

        <aside className="scene__panel" aria-live="polite">
          <div className="panel__title">{activeStation.title}</div>
          <p className="panel__lede">{activeStation.flavor}</p>
          <div className="panel__card">
            <p className="panel__label">Trivia to unlock:</p>
            <p className="panel__question">{activeStation.trivia}</p>
            <p className="panel__hint">Clue: {activeStation.clue}</p>
            <form className="panel__form" onSubmit={handleSubmit}>
              <label className="panel__label" htmlFor="answer">
                Type your answer
              </label>
              <input
                id="answer"
                value={answerInput}
                onChange={(event) => setAnswerInput(event.target.value)}
                placeholder="Type like a 1997 chat room"
              />
              <div className="panel__actions">
                <button type="submit" className="btn btn-primary">
                  Submit answer
                </button>
                <span className="panel__small">Correct answers add stickers to the plaza.</span>
              </div>
            </form>
          </div>
          <div className="panel__status">{systemMessage}</div>
        </aside>
      </div>
    </section>
  )
}

export default SceneSection
