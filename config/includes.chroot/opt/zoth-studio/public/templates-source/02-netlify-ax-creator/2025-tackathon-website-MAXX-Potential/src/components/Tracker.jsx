import './Tracker.css'

const Tracker = ({ trackerState, trackerError, santaSnapshot, lastTrackerUpdate, refreshSanta }) => {
  const statusLabel =
    trackerState === 'ready'
      ? 'Online'
      : trackerState === 'refreshing'
        ? 'Refreshing'
        : trackerState === 'error'
          ? 'Offline'
          : 'Loading'

  return (
    <div className="tracker__wrap" id="tracker">
      <div className="tracker__panel">
        <div className="panel__title">Live Santa Radar (NORAD feed)</div>
        <div className="panel__body tracker__body">
          <div className="tracker__status">
            <span className={`badge ${trackerState === 'ready' ? 'badge--good' : 'badge--pulse'}`}>{statusLabel}</span>
            <p className="tracker__hint">
              Live location from a public NORAD Santa endpoint, refreshed every minute. If the API is shy, hop to the official
              tracker below while we retry.
            </p>
            {trackerError ? <p className="tracker__alert">{trackerError}</p> : null}
          </div>

          <div className="tracker__grid">
            <div>
              <p className="panel__label">Current location</p>
              <p className="tracker__value">{santaSnapshot?.city || 'Somewhere between rooftops'}</p>
              <p className="tracker__meta">Lat: {santaSnapshot?.lat ?? '—'} | Lon: {santaSnapshot?.lon ?? '—'}</p>
            </div>
            <div>
              <p className="panel__label">Speed + ETA</p>
              <p className="tracker__value">{santaSnapshot?.speed ? `${santaSnapshot.speed} kph` : 'Warp sleigh'}</p>
              <p className="tracker__meta">Next stop in: {santaSnapshot?.eta ?? 'clocking presents'}</p>
            </div>
            <div>
              <p className="panel__label">Last check</p>
              <p className="tracker__value">{lastTrackerUpdate ? lastTrackerUpdate.toLocaleTimeString() : '—'}</p>
              <p className="tracker__meta">Data refreshes automatically.</p>
            </div>
          </div>

          <div className="tracker__actions">
            <button type="button" className="btn btn-primary" onClick={refreshSanta}>
              Manual refresh
            </button>
            <a className="btn btn-ghost" href="https://www.noradsanta.org/en/" target="_blank" rel="noreferrer">
              Open official NORAD tracker
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tracker
