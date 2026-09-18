const schedule = [
  { time: 'Today – This week', action: 'Finish Agile App Academy materials' },
  { time: 'This week', action: 'Contact QEDC / Entrepreneur Space + local EDCs' },
  { time: 'Late next week', action: 'Call with Jai — come prepared with strategy summary and questions' },
  { time: 'Following weeks', action: 'Build MVP + secure kitchen access in agile sprints' },
];

export default function Timeline() {
  return (
    <section className="section" id="timeline" aria-labelledby="timeline-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-kicker">Schedule</span>
          <h2 id="timeline-heading" className="section-title">When things happen</h2>
          <p className="section-subtitle">A focused cadence so the next few weeks stay actionable and accountable.</p>
        </div>

        <div className="schedule" role="table" aria-label="Gameplan schedule">
          {schedule.map((row, index) => (
            <div className="schedule-row" role="row" key={index}>
              <div className="schedule-time" role="cell">{row.time}</div>
              <div className="schedule-action" role="cell">{row.action}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
