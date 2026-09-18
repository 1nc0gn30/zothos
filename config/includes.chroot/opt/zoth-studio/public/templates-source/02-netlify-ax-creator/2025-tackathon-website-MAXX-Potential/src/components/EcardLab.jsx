import './EcardLab.css'

const EcardLab = ({
  ecardTemplates,
  ecardTemplateId,
  setEcardTemplateId,
  ecardTo,
  setEcardTo,
  ecardMessage,
  setEcardMessage,
  ecardFrom,
  setEcardFrom,
  selectedTemplate,
  handleDownloadEcard,
  handlePrintEcard
}) => {
  return (
    <section className="section ecard" id="ecard-lab">
      <div className="section__header">
        <h2>E-Card Designer Lab</h2>
        <p className="section__sub">Spin up tacky printable greetings and download them as a mini HTML you can save or print.</p>
      </div>
      <div className="ecard__grid">
        <div className="ecard__form">
          <label className="panel__label" htmlFor="ecard-template">
            Template
          </label>
          <select
            id="ecard-template"
            value={ecardTemplateId}
            onChange={(event) => setEcardTemplateId(event.target.value)}
          >
            {ecardTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <label className="panel__label" htmlFor="ecard-to">
            To
          </label>
          <input id="ecard-to" value={ecardTo} onChange={(event) => setEcardTo(event.target.value)} />
          <label className="panel__label" htmlFor="ecard-message">
            Message
          </label>
          <textarea
            id="ecard-message"
            value={ecardMessage}
            onChange={(event) => setEcardMessage(event.target.value)}
            rows={4}
          />
          <label className="panel__label" htmlFor="ecard-from">
            From
          </label>
          <input id="ecard-from" value={ecardFrom} onChange={(event) => setEcardFrom(event.target.value)} />
          <div className="panel__actions">
            <button type="button" className="btn btn-primary" onClick={handleDownloadEcard}>
              Download HTML
            </button>
            <button type="button" className="btn btn-ghost" onClick={handlePrintEcard}>
              Open print view
            </button>
          </div>
          <p className="panel__hint">Your card stays local — the download is a self-contained HTML you can reopen or print.</p>
        </div>
        <div className="ecard__preview" aria-label="E-card preview">
          <div
            className="ecard__canvas"
            style={{
              background: selectedTemplate.background,
              border: selectedTemplate.border
            }}
          >
            <p className="ecard__title" style={{ color: selectedTemplate.accent }}>
              CRT Plaza Greetings
            </p>
            <p className="ecard__to">To: {ecardTo}</p>
            <p className="ecard__message">{ecardMessage}</p>
            <p className="ecard__from">— {ecardFrom}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EcardLab
