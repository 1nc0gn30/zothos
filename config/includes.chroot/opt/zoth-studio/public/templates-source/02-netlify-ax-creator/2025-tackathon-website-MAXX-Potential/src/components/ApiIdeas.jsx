import './ApiIdeas.css'

const ApiIdeas = ({ christmasApis }) => {
  const snowfallHours = [
    { label: '6a', value: 0.2 },
    { label: '9a', value: 0.6 },
    { label: 'noon', value: 0.9 },
    { label: '3p', value: 0.4 },
    { label: '6p', value: 0.7 },
    { label: '9p', value: 1.1 }
  ]

  const tvCameos = [
    { label: 'Sitcoms', count: 6 },
    { label: 'Cartoons', count: 9 },
    { label: 'Game Shows', count: 4 },
    { label: 'Music Specials', count: 5 }
  ]

  const releaseYears = [
    { year: 1991, hits: 3 },
    { year: 1993, hits: 4 },
    { year: 1995, hits: 6 },
    { year: 1997, hits: 5 },
    { year: 1999, hits: 7 }
  ]

  const maxSnow = Math.max(...snowfallHours.map((item) => item.value))
  const maxHits = Math.max(...releaseYears.map((item) => item.hits))

  return (
    <section className="section api" id="api-ideas">
      <div className="section__header">
        <div className="api__decor api__decor--garland" aria-hidden />
        <div className="api__decor api__decor--spark" aria-hidden />
        <h2>Free Christmas Data Streams</h2>
        <p className="section__sub">
          Drop-in APIs with no signup to sprinkle live nostalgia data onto your plaza — perfect for 1990s movie trivia or snow
          warnings. This lab renders the data on-page so you can see the glow without downloading a congested file.
        </p>
      </div>

      <div className="api__layout">
        <div className="api__grid">
          {christmasApis.map((api) => (
            <article key={api.name} className="api__card">
              <div className="api__card-top">
                <h3>{api.name}</h3>
                <span className="api__tag">No auth</span>
              </div>
              <p>{api.description}</p>
              <div className="api__meta">
                <span className="api__pill">Returns JSON</span>
                <span className="api__pill">Works in-browser</span>
              </div>
              <div className="api__actions">
                <a className="btn btn-ghost" href={api.url} target="_blank" rel="noreferrer">
                  Open sample endpoint
                </a>
                <code className="api__code">fetch('{api.url.split('?')[0]}')</code>
              </div>
            </article>
          ))}
        </div>

        <div className="api__visuals">
          <div className="api__panel">
            <div className="api__panel-head">
              <span className="api__light" aria-hidden />
              <div>
                <p className="eyebrow">On-page visualization</p>
                <h3>Snowfall + nostalgia tracker</h3>
              </div>
              <span className="api__light api__light--pink" aria-hidden />
            </div>

            <div className="api__charts">
              <div className="api__chart">
                <header className="api__chart-head">
                  <p className="api__chart-title">Snowfall pulse (Open Meteo)</p>
                  <span className="api__chip">cm/hr</span>
                </header>
                <div className="api__bars">
                  {snowfallHours.map((item) => (
                    <div key={item.label} className="api__bar">
                      <div
                        className="api__bar-fill"
                        style={{ height: `${(item.value / maxSnow) * 100}%` }}
                        aria-label={`${item.value} centimeters at ${item.label}`}
                      />
                      <span className="api__bar-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="api__chart">
                <header className="api__chart-head">
                  <p className="api__chart-title">90s release heatmap (iTunes)</p>
                  <span className="api__chip">hits/year</span>
                </header>
                <div className="api__heat">
                  {releaseYears.map((item) => (
                    <div key={item.year} className="api__heat-cell" style={{ '--heat': item.hits / maxHits }}>
                      <span className="api__heat-year">{item.year}</span>
                      <span className="api__heat-value">{item.hits}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="api__table">
              <header className="api__table-head">
                <p className="api__chart-title">Holiday cameos (TVMaze)</p>
                <span className="api__chip">preview</span>
              </header>
              <div className="api__rows">
                {tvCameos.map((item) => (
                  <div key={item.label} className="api__row">
                    <div className="api__row-label">{item.label}</div>
                    <div className="api__row-bar">
                      <span style={{ width: `${(item.count / 10) * 100}%` }} />
                    </div>
                    <div className="api__row-value">{item.count}</div>
                  </div>
                ))}
              </div>
              <p className="api__note">
                Use the endpoints to swap in your own counts; this preview renders live in the plaza instead of a static download.
              </p>
            </div>
          </div>

          <div className="api__snowglobe" aria-hidden>
            <div className="api__snow" />
            <div className="api__tree" />
            <div className="api__gift" />
            <div className="api__gift api__gift--tiny" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ApiIdeas
