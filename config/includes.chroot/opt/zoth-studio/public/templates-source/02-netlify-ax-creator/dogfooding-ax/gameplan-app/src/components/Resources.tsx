const resources = [
  {
    title: 'Agile App Academy',
    description: 'Jai’s #1 recommendation. Work through the full course to define your MVP, map an agile build process, and find fast dogfooding loops.',
    url: 'https://trydogfooding.com/agile-app-academy',
    label: 'Start the course',
  },
  {
    title: 'QEDC Entrepreneur Space',
    description: 'Shared commercial kitchen + food business incubator in Long Island City, Queens. Ask about free or subsidized incubation programs.',
    url: 'https://entrepreneurspace.org',
    label: 'Visit the site',
  },
  {
    title: 'Local EDC Finder',
    description: 'Search your city/state for food business incubators, SBDCs, SCORE chapters, and economic development corporations.',
    url: 'https://www.sba.gov/local-assistance',
    label: 'SBA local assistance',
  },
  {
    title: 'Jai’s Follow-up Call',
    description: 'After the academy, come prepared with your strategy summary, questions, and kitchen outreach update to unlock the “big goodies.”',
    url: '#phases',
    label: 'Review checklist',
  },
];

export default function Resources() {
  return (
    <section className="section" id="resources" aria-labelledby="resources-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-kicker">Launch Links</span>
          <h2 id="resources-heading" className="section-title">Fuel the mission</h2>
          <p className="section-subtitle">Contacts, courses, and references referenced throughout the gameplan.</p>
        </div>

        <div className="resources-grid">
          {resources.map((resource, index) => (
            <article className="resource-card" key={resource.title}>
              <span className="resource-number">0{index + 1}</span>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <a
                href={resource.url}
                className="resource-link"
                target={resource.url.startsWith('http') ? '_blank' : undefined}
                rel={resource.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {resource.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
