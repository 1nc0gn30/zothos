const state = {
  businesses: [],
  filtered: [],
};

const els = {
  search: document.querySelector('#search'),
  monthFilter: document.querySelector('#monthFilter'),
  categoryFilter: document.querySelector('#categoryFilter'),
  scoreFilter: document.querySelector('#scoreFilter'),
  resetBtn: document.querySelector('#resetBtn'),
  cards: document.querySelector('#cards'),
  resultCount: document.querySelector('#resultCount'),
  categoryChips: document.querySelector('#categoryChips'),
  topStats: document.querySelector('#topStats'),
  cardTemplate: document.querySelector('#cardTemplate'),
};

const UNIQUE_WEBSITE_ANGLES = {
  'Food and Beverage': [
    'Show menu highlights, hours, and ordering options before customers compare alternatives.',
    'Use location pages and photos so nearby searchers pick this spot first.',
    'Capture repeat business with events, specials, and loyalty callouts.',
  ],
  'Home and Trade Services': [
    'Separate service pages by job type so urgent buyers find the exact offer quickly.',
    'Display licenses, before/after work, and guarantees to reduce trust friction.',
    'Route leads with quote forms that collect scope, timeline, and neighborhood details.',
  ],
  'Beauty and Personal Care': [
    'Highlight specialties and style portfolio so clients can self-qualify before booking.',
    'Pair booking flow with service prep guidance to reduce no-shows and mismatched appointments.',
    'Stand out locally with clear brand visuals and social proof from real clients.',
  ],
  'Health and Wellness': [
    'Clarify services, credentials, and care approach so prospects feel safe reaching out.',
    'Use conversion-focused intake paths for consultations, classes, or appointments.',
    'Strengthen local authority through educational content and trust signals.',
  ],
  'Professional and B2B Services': [
    'Position offers by industry/use case so decision makers understand fit in one scan.',
    'Use proof-driven pages with case outcomes, process, and expected timelines.',
    'Capture higher-quality leads with forms that qualify budget, role, and project scope.',
  ],
  'Retail and E-commerce': [
    'Differentiate product quality and brand story beyond marketplace price competition.',
    'Support online and in-store conversion with inventory, pickup, and shipping clarity.',
    'Increase repeat purchases using collection pages, bundles, and lifecycle offers.',
  ],
  'Automotive and Marine': [
    'Publish issue-specific service pages so urgent customers choose faster with confidence.',
    'Display turnaround times, certifications, and warranty details to reduce call hesitation.',
    'Use structured intake forms to pre-qualify jobs and improve scheduling efficiency.',
  ],
  'Events and Creative': [
    'Use visual-first pages that prove style quality before prospects request pricing.',
    'Show packaged offers and availability windows to shorten back-and-forth sales cycles.',
    'Convert interest with portfolio-driven landing pages for each event type.',
  ],
  'Childcare and Education': [
    'Build parent trust with credentials, safety standards, and transparent program details.',
    'Simplify enrollment with clear schedules, age groups, and inquiry paths.',
    'Use program pages to communicate outcomes and differentiate from nearby options.',
  ],
  'Real Estate and Property': [
    'Present listings/services with clear next steps to capture buyer and owner intent quickly.',
    'Use neighborhood-specific pages to rank for high-intent local search terms.',
    'Show proof of outcomes, process, and response times to win trust faster.',
  ],
  'Personal and Local Services': [
    'Define service scope and pricing expectations so inquiries are better qualified.',
    'Use location signals and reviews to earn trust from nearby prospects quickly.',
    'Capture demand from mobile users with fast call, text, and booking actions.',
  ],
  'Nonprofit and Community': [
    'Clarify mission impact and programs so supporters understand value immediately.',
    'Drive volunteer and donor actions with focused campaign landing pages.',
    'Strengthen credibility with updates, outcomes, and local partnership visibility.',
  ],
  default: [
    'Differentiate this business from similar local options with clearer positioning and proof.',
    'Convert search traffic into leads using focused service pages and direct contact paths.',
    'Build trust faster through testimonials, certifications, and up-to-date business details.',
  ],
};

function uniqueValues(list, key) {
  return [...new Set(list.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function createOption(value, text) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = text;
  return opt;
}

function titleForBusiness(item) {
  return item.trade_name || item.owner_name || 'Unnamed Business';
}

function businessSearchText(item) {
  return [
    item.trade_name,
    item.owner_name,
    item.category,
    item.address,
    item.city,
    item.zip,
  ].join(' ').toLowerCase();
}

function categoryAngles(item) {
  return UNIQUE_WEBSITE_ANGLES[item.category] || UNIQUE_WEBSITE_ANGLES.default;
}

function uniqueReasons(item) {
  const name = titleForBusiness(item);
  const categoryName = (item.category || 'local business').toLowerCase();
  const angles = categoryAngles(item).slice(0, 2);

  return [
    `${name} can stand out from other ${categoryName} options with clearer positioning and trust signals.`,
    ...angles,
  ];
}

function renderStats(items) {
  const total = items.length;
  const avgScore = total ? Math.round(items.reduce((sum, item) => sum + (item.lead_score || 0), 0) / total) : 0;
  const highPriority = items.filter((item) => item.lead_score >= 80).length;
  const categories = new Set(items.map((item) => item.category)).size;

  els.topStats.innerHTML = '';

  const stats = [
    ['Total leads', total],
    ['High priority (80+)', highPriority],
    ['Avg lead score', avgScore],
    ['Active categories', categories],
  ];

  stats.forEach(([label, value]) => {
    const dl = document.createElement('dl');
    dl.className = 'stat';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = String(value);
    dl.append(dt, dd);
    els.topStats.appendChild(dl);
  });
}

function renderCategoryChips(items) {
  const counts = new Map();
  items.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) || 0) + 1);
  });

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  els.categoryChips.innerHTML = '';

  sorted.forEach(([category, count]) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = `${category} (${count})`;
    chip.addEventListener('click', () => {
      els.categoryFilter.value = category;
      applyFilters();
    });
    els.categoryChips.appendChild(chip);
  });
}

function renderCards(items) {
  els.cards.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No results match your filters.';
    els.cards.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const node = els.cardTemplate.content.cloneNode(true);
    const card = node.querySelector('.lead-card');
    card.style.animationDelay = `${Math.min(index * 14, 220)}ms`;

    node.querySelector('.category').textContent = item.category;
    node.querySelector('.score').textContent = `Lead Score ${item.lead_score}`;
    node.querySelector('.trade').textContent = titleForBusiness(item);
    node.querySelector('.owner').textContent = `Owner: ${item.owner_name || 'N/A'}`;
    node.querySelector('.meta').textContent = `${item.month} | ${item.city}, ${item.state} ${item.zip} | ${item.telephone || 'No phone listed'}`;

    const painList = node.querySelector('.pain-points');
    item.pain_points.forEach((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      painList.appendChild(li);
    });

    const ideaList = node.querySelector('.ideas');
    item.website_ideas.forEach((idea) => {
      const li = document.createElement('li');
      li.textContent = idea;
      ideaList.appendChild(li);
    });

    const reasonList = node.querySelector('.reasons');
    uniqueReasons(item).forEach((reason) => {
      const li = document.createElement('li');
      li.textContent = reason;
      reasonList.appendChild(li);
    });

    node.querySelector('.why').textContent = `Primary reason: ${item.why_need_website}`;
    node.querySelector('.sources').innerHTML = `Source: <a href="${item.source_pdf}">PDF</a> | <a href="${item.source_xlsx}">XLSX</a> | Confidence ${item.confidence}%`;

    fragment.appendChild(node);
  });

  els.cards.appendChild(fragment);
}

function applyFilters() {
  const search = els.search.value.trim().toLowerCase();
  const month = els.monthFilter.value;
  const category = els.categoryFilter.value;
  const scoreThreshold = els.scoreFilter.value === 'all' ? null : Number(els.scoreFilter.value);

  state.filtered = state.businesses.filter((item) => {
    if (search && !businessSearchText(item).includes(search)) return false;
    if (month !== 'all' && item.month !== month) return false;
    if (category !== 'all' && item.category !== category) return false;
    if (scoreThreshold !== null && item.lead_score < scoreThreshold) return false;
    return true;
  });

  state.filtered.sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0));

  els.resultCount.textContent = `Showing ${state.filtered.length} of ${state.businesses.length} businesses`;
  renderCards(state.filtered);
  renderStats(state.filtered);
  renderCategoryChips(state.filtered);
}

function bindEvents() {
  [els.search, els.monthFilter, els.categoryFilter, els.scoreFilter].forEach((el) => {
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  els.resetBtn.addEventListener('click', () => {
    els.search.value = '';
    els.monthFilter.value = 'all';
    els.categoryFilter.value = 'all';
    els.scoreFilter.value = 'all';
    applyFilters();
  });
}

function hydrateFilterOptions() {
  uniqueValues(state.businesses, 'month').forEach((month) => {
    els.monthFilter.appendChild(createOption(month, month));
  });

  uniqueValues(state.businesses, 'category').forEach((category) => {
    els.categoryFilter.appendChild(createOption(category, category));
  });
}

async function init() {
  try {
    const response = await fetch('./data/businesses-enriched.json');
    if (!response.ok) {
      throw new Error(`Failed to load dataset (${response.status})`);
    }

    const payload = await response.json();
    state.businesses = payload.businesses || [];

    hydrateFilterOptions();
    bindEvents();
    applyFilters();
  } catch (error) {
    els.cards.innerHTML = `<p class="muted">Could not load data: ${error.message}</p>`;
  }
}

init();
