import fs from 'node:fs';
import path from 'node:path';

const routes = [
  { url: 'https://nexia-agency.webflow.io/', file: 'src/pages/index.astro' },
  { url: 'https://nexia-agency.webflow.io/about', file: 'src/pages/about.astro' },
  { url: 'https://nexia-agency.webflow.io/projects', file: 'src/pages/projects.astro' },
  { url: 'https://nexia-agency.webflow.io/blog', file: 'src/pages/blog.astro' },
  { url: 'https://nexia-agency.webflow.io/pricing', file: 'src/pages/pricing.astro' },
  { url: 'https://nexia-agency.webflow.io/contact', file: 'src/pages/contact.astro' },
  { url: 'https://nexia-agency.webflow.io/projects/anantaraya', file: 'src/pages/projects/anantaraya.astro' },
  { url: 'https://nexia-agency.webflow.io/projects/aureva', file: 'src/pages/projects/aureva.astro' },
  { url: 'https://nexia-agency.webflow.io/projects/legolas', file: 'src/pages/projects/legolas.astro' },
  { url: 'https://nexia-agency.webflow.io/projects/morph', file: 'src/pages/projects/morph.astro' },
  { url: 'https://nexia-agency.webflow.io/projects/steelcrest', file: 'src/pages/projects/steelcrest.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/why-strong-branding-matters-in-the-digital-era', file: 'src/pages/blog-posts/why-strong-branding-matters-in-the-digital-era.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/the-role-of-user-experience-in-conversion-rates', file: 'src/pages/blog-posts/the-role-of-user-experience-in-conversion-rates.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/harnessing-social-media-for-brand-awareness', file: 'src/pages/blog-posts/harnessing-social-media-for-brand-awareness.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/the-importance-of-mobile-optimization', file: 'src/pages/blog-posts/the-importance-of-mobile-optimization.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/innovative-branding-strategies-for-startups', file: 'src/pages/blog-posts/innovative-branding-strategies-for-startups.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/leveraging-social-media-for-brand-awareness', file: 'src/pages/blog-posts/leveraging-social-media-for-brand-awareness.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/the-impact-of-consistent-messaging-across-platforms', file: 'src/pages/blog-posts/the-impact-of-consistent-messaging-across-platforms.astro' },
  { url: 'https://nexia-agency.webflow.io/blog-posts/the-role-of-user-experience-in-brand-loyalty', file: 'src/pages/blog-posts/the-role-of-user-experience-in-brand-loyalty.astro' },
  { url: 'https://nexia-agency.webflow.io/product/starter-plan', file: 'src/pages/product/starter-plan.astro' },
  { url: 'https://nexia-agency.webflow.io/product/growth-plan', file: 'src/pages/product/growth-plan.astro' },
  { url: 'https://nexia-agency.webflow.io/information-pages/style-guide', file: 'src/pages/information-pages/style-guide.astro' },
  { url: 'https://nexia-agency.webflow.io/information-pages/license', file: 'src/pages/information-pages/license.astro' },
  { url: 'https://nexia-agency.webflow.io/information-pages/changelog', file: 'src/pages/information-pages/changelog.astro' },
  { url: 'https://nexia-agency.webflow.io/401', file: 'src/pages/401.astro' },
  { url: 'https://nexia-agency.webflow.io/404', file: 'src/pages/404.astro' },
  { url: 'https://nexia-agency.webflow.io/checkout', file: 'src/pages/checkout.astro' },
];

const cdnManifest = JSON.parse(fs.readFileSync('public/assets/cdn/manifest.json', 'utf8')).assets;
const jsManifest = JSON.parse(fs.readFileSync('public/assets/js/manifest.json', 'utf8')).assets;
const variant = process.env.CLONE === '1' ? 'exact' : 'aplus';

const blogWorkflows = {
  'why-strong-branding-matters-in-the-digital-era': {
    title: 'Medication Reconciliation Copilot',
    excerpt: 'Compare current and recommended medications with synthetic data, flag discrepancies, and hand a clean review packet to the clinician.',
    persona: 'Physician',
    action: 'Paste a synthetic med list into your AI tool and ask for discrepancies, missing meds, interactions, and a Requires Physician Review section.',
    miniQuest: 'Build a one-file med-rec prompt, run it on three fake patients, and ask your IT team where medication data can be safely exported.',
    source: 'Worked Example 001',
  },
  'the-role-of-user-experience-in-conversion-rates': {
    title: 'Documentation Assistant For After-Hours Charting',
    excerpt: 'Turn rough visit notes into a SOAP-format draft that stays under physician review and reduces documentation drag.',
    persona: 'Physician',
    action: 'Use a synthetic visit note, generate a SOAP note, then check every sentence against the original note before copying anything forward.',
    miniQuest: 'Create a review checklist for hallucinations, coding hints, patient identifiers, and missing follow-up instructions.',
    source: 'Worked Example 007',
  },
  'harnessing-social-media-for-brand-awareness': {
    title: 'Referral Tracking Summary',
    excerpt: 'Turn a weekly referral list into a priority, status, and follow-up summary for care continuity.',
    persona: 'Clinic operator',
    action: 'Create a fake referral table and ask for status, priority, follow-up owner, and a Requires Immediate Follow-up section.',
    miniQuest: 'Run the summary with five fake referrals, then ask your front desk what fields are missing from the real workflow.',
    source: 'Worked Example 004',
  },
  'the-importance-of-mobile-optimization': {
    title: 'Community Resource Referral Draft',
    excerpt: 'Help community health workers turn patient needs into a reviewed list of transportation, medication, and food resources.',
    persona: 'Community health worker',
    action: 'Use synthetic needs, location, and constraints to draft resource options with eligibility, contact placeholders, and application steps.',
    miniQuest: 'Pick one neighborhood, verify three resources manually, and document what the AI got wrong before reusing the workflow.',
    source: 'Worked Example 012',
  },
  'innovative-branding-strategies-for-startups': {
    title: 'AI Practice Audit Value Calculator',
    excerpt: 'Estimate time, cost, risk, and payback before turning a workflow into an AI implementation project.',
    persona: 'Practice owner',
    action: 'Fill in cases per week, minutes per case, rework rate, delay cost, and the first workflow you want to test.',
    miniQuest: 'Make a spreadsheet with conservative, expected, and aggressive savings, then decide whether the first workflow is worth testing.',
    source: 'Audit Value Calculator',
  },
  'leveraging-social-media-for-brand-awareness': {
    title: 'PHI Scrubber Before The Demo',
    excerpt: 'Clean sensitive text into demo-safe artifacts before sharing examples with a vendor, model, or public build note.',
    persona: 'Healthcare builder',
    action: 'Take synthetic notes and ask an AI tool to remove identifiers, preserve clinical meaning, and mark anything uncertain for review.',
    miniQuest: 'Create five fake notes, scrub them, then have a second reviewer try to identify leaked names, dates, locations, or IDs.',
    source: 'PHI Scrubber case study',
  },
  'the-impact-of-consistent-messaging-across-platforms': {
    title: 'EHR Integration Planning Packet',
    excerpt: 'Turn an integration idea into a concrete map of data flows, security requirements, tests, and risks.',
    persona: 'IT lead',
    action: 'Describe a synthetic EHR integration and ask for technical approach, security considerations, data mapping, and risk factors.',
    miniQuest: 'Share the draft with IT and ask which assumptions fail against the real EHR, identity, audit logging, and data retention rules.',
    source: 'Worked Example 022',
  },
  'the-role-of-user-experience-in-brand-loyalty': {
    title: 'Healthcare AI Security Assessment',
    excerpt: 'Inventory controls, vulnerabilities, HIPAA considerations, and security priorities before a workflow touches real systems.',
    persona: 'IT and compliance',
    action: 'Describe a synthetic AI tool, data handled, storage, access control, transport, and integrations, then ask for a security assessment.',
    miniQuest: 'Turn the output into a risk register and ask IT to label each item as acceptable, blocked, or needs evidence.',
    source: 'Worked Example 021',
  },
};

function blogSlug(file) {
  return file.match(/blog-posts\/(.+)\.astro$/)?.[1] || '';
}

function blogWorkflow(file) {
  return blogWorkflows[blogSlug(file)] || null;
}

const offerPanel = String.raw`
<section class="aplus-offer-panel" aria-labelledby="aplus-offer-title">
  <div class="aplus-offer-head">
    <div>
      <div class="aplus-kicker">A+ Active Services</div>
      <h2 id="aplus-offer-title">Start with worked examples, then buy the Healthcare Software Factory.</h2>
    </div>
    <p>A+ Active Services helps private-practice physicians and healthcare operators get home earlier, reduce admin drag, and solve AI implementation friction with compound intelligence inside the real practice workflow.</p>
  </div>
  <div class="aplus-offer-grid">
    <article class="aplus-offer-card featured">
      <span>One-time access</span>
      <h3>Healthcare Hackathon Heroes</h3>
      <strong>$197</strong>
      <p>Templates, prompts, build notes, strategy games, and AI Practice Audit materials for people who want the healthcare engineer operating system.</p>
      <a href="https://buy.stripe.com/REPLACE_COLLECTIVE_197" data-aplus-link="collective">Join for $197</a>
    </article>
    <article class="aplus-offer-card">
      <span>Weekly rhythm</span>
      <h3>Brain workouts and office hours</h3>
      <strong>Free</strong>
      <p>Weekly classes and office hours teach point AI, workflow AI, compounding AI, and the first audit call a practice owner can actually act on.</p>
      <a href="https://cal.com/REPLACE_APLUS_ACTIVE" data-aplus-link="calendar">See the calendar</a>
    </article>
    <article class="aplus-offer-card">
      <span>Quarterly retainer</span>
      <h3>Healthcare Software Factory</h3>
      <strong>$3K+</strong>
      <p>The quarterly retainer turns ideas, practice data, podcast guest offers, clinic workflows, and company needs into scoped MVPs, customized prototypes, workflow audits, last-mile action plans, Podcast Guest Launch, managed LinkedIn, and bespoke consulting for your stack.</p>
      <a href="https://buy.stripe.com/REPLACE_FACTORY_RETAINER_3000_QTR" data-aplus-link="retainer">Start a quarter</a>
    </article>
  </div>
  <div class="aplus-visual-proof" aria-label="A+ Active proof visuals">
    <img src="/assets/cdn/69579f06-695d55bf9fdf85da8e7102af_Project-Image-1.webp" alt="Healthcare workflow prototype screen" loading="lazy" />
    <img src="/assets/cdn/69579f06-695e40f235b1cf8a899e927e_Blog-Image-2.webp" alt="Healthcare workflow design notes" loading="lazy" />
    <img src="/assets/cdn/69579f06-695d5c988048096869e58574_Project-Image-5.webp" alt="Healthcare software factory build" loading="lazy" />
  </div>
  <div class="aplus-newsletter">
    <div>
      <b>Healthcare Heroes newsletter</b>
      <p>Substack is the free entry point for essays, build notes, masterclass reminders, and the business model behind the AI Practice Audit.</p>
    </div>
    <a href="https://sweetscience.substack.com/" data-aplus-link="newsletter">Subscribe free</a>
  </div>
</section>
<section class="aplus-proof-band" aria-label="How A+ Active Services works">
  <div class="aplus-proof"><b>Documentation burden</b><p>We help physicians reduce after-hours charting by configuring the right AI tools around their EHR, note style, and review workflow.</p></div>
  <div class="aplus-proof"><b>Staffing pressure</b><p>We look for front-desk, scheduling, billing, and follow-up work that AI can draft or route while humans keep approval authority.</p></div>
  <div class="aplus-proof"><b>Implementation friction</b><p>We act like forward-deployed healthcare engineers so practices stop juggling vendors, trials, and half-working tools.</p></div>
</section>
<section class="aplus-proof-band" aria-label="A+ Active system integrations">
  <div class="aplus-proof"><b>Newsletter signups</b><p>Substack captures the free audience from masterclasses, build notes, and Healthcare Heroes essays.</p></div>
  <div class="aplus-proof"><b>Community purchase</b><p>Stripe sells Healthcare Hackathon Heroes and routes paid members into the operating system and back-office follow-up.</p></div>
  <div class="aplus-proof"><b>Event calendar</b><p>Cal.com handles masterclass, office hours, and book-with-us paths so the site can prove demand before custom software.</p></div>
</section>
<section class="aplus-strategy-panel" aria-labelledby="aplus-strategy-title">
  <div>
    <div class="aplus-kicker">Scalable acquisition</div>
    <h2 id="aplus-strategy-title">Worked examples become demos. Demos become office hours. Office hours become retainers.</h2>
  </div>
  <div class="aplus-strategy-steps">
    <article><span>01</span><b>Publish the worked example</b><p>Show one workflow, game, or audit artifact in public so a buyer can see the shape of the work.</p></article>
    <article><span>02</span><b>Run the live room</b><p>Teach the means, motivation, and opportunity behind the first small win, then answer questions live.</p></article>
    <article><span>03</span><b>Distribute the proof</b><p>Stream to LinkedIn, clip to YouTube, discuss in Slack, write it on Substack, and remix it for Twitter/X.</p></article>
    <article><span>04</span><b>Diagnose the retainer</b><p>Use discovery to move from needs to pain, impact, urgency, and a concrete Healthcare Software Factory menu item.</p></article>
  </div>
</section>
<section class="aplus-trio-panel" aria-labelledby="aplus-trio-title">
  <div class="aplus-trio-head">
    <div>
      <div class="aplus-kicker">Proof of humanity</div>
      <h2 id="aplus-trio-title">The trio behind the intelligence factory and the automation lane.</h2>
    </div>
    <p>Jai shapes the compound and natural intelligence path. Anthony and Khizar carry the middle-office and back-office automation lane for practice operations, podcast guests, and bespoke consulting.</p>
  </div>
  <div class="aplus-trio-grid">
    <article class="aplus-trio-card">
      <div class="aplus-avatar" data-aplus-trio-image="0">J</div>
      <span>Jai</span>
      <h3>Compound and natural intelligence</h3>
      <p>Turns docs, email, calendar, classes, content, and strategy games into compound intelligence systems for physicians, operators, and expert-led businesses.</p>
      <a href="https://cal.com/REPLACE_APLUS_ACTIVE" data-aplus-link="calendar">Book office hours</a>
    </article>
    <article class="aplus-trio-card">
      <div class="aplus-avatar" data-aplus-trio-image="1">K</div>
      <span>Khizar</span>
      <h3>Middle-office automation</h3>
      <p>Connects client context, EHR-adjacent workflows, stack decisions, managed services, and operational handoffs into clear execution systems.</p>
      <a href="https://sweetscience.substack.com/" data-aplus-link="newsletter">Follow the notes</a>
    </article>
    <article class="aplus-trio-card">
      <div class="aplus-avatar" data-aplus-trio-image="2">A</div>
      <span>Anthony</span>
      <h3>Back-office and offer launch</h3>
      <p>Builds the systems behind Podcast Guest Launch, managed LinkedIn, internal automations, and retained delivery.</p>
      <a href="https://www.podcastguestlaunch.com/" data-aplus-link="podcast">See Podcast Guest Launch</a>
    </article>
  </div>
</section>`;

const checkoutPage = String.raw`---
import AplusPage from '../layouts/AplusPage.astro';
---
<AplusPage
  title="Choose your next step | A+ Active Services"
  eyebrow="A+ Active checkout"
  heading="Pick the system that matches the practice problem."
  intro="Slack alignment was clear: the site has to sell the community, grow the newsletter, show the event calendar, and make it easy to book with us."
>
  <section class="aplus-screen-stack" aria-label="Checkout decision path">
    <article>
      <p class="aplus-kicker">Choose by current state</p>
      <h2>Do not buy a package. Pick the next constraint.</h2>
      <p>If you need examples, start with Healthcare Hackathon Heroes. If you need live diagnosis, join the masterclass or office hours. If you need execution inside your company, start the Healthcare Software Factory.</p>
    </article>
    <article>
      <p class="aplus-kicker">DIY / DWY / DFY</p>
      <h2>The ladder matches the lean business model canvas.</h2>
      <p>DIY gives you the library. DWY gives you classes, office hours, and scorecards. DFY gives you retained healthcare engineers who connect newsletter, community, calendar, booking, Stripe, Slack, and your operational stack.</p>
    </article>
  </section>
  <section class="aplus-flywheel-strip" aria-label="Checkout system jobs">
    <span>Newsletter</span>
    <span>Community purchase</span>
    <span>Event calendar</span>
    <span>Book with us</span>
    <span>Healthcare Software Factory</span>
  </section>
  <section class="aplus-content-grid aplus-checkout-grid" aria-label="A+ Active buying paths">
    <article>
      <p class="aplus-kicker">One-time access</p>
      <h2>Healthcare Hackathon Heroes</h2>
      <p>Buy the $197 access pass for templates, prompts, AI Practice Audit materials, build notes, and special access to the healthcare engineer operating system.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_COLLECTIVE_197" data-aplus-link="collective">Join for $197</a>
    </article>
    <article>
      <p class="aplus-kicker">Free weekly rhythm</p>
      <h2>Brain workouts and office hours</h2>
      <p>Join weekly classes on point AI, workflow AI, compounding AI, and the practical audit call that turns a practice problem into a first workflow.</p>
      <a class="aplus-card-link" href="https://cal.com/REPLACE_APLUS_ACTIVE" data-aplus-link="calendar">See the calendar</a>
    </article>
    <article>
      <p class="aplus-kicker">Quarterly retainer</p>
      <h2>Healthcare Software Factory</h2>
      <p>Start the $3K+/quarter path for documentation burden, staffing pressure, AI implementation, middle-office automation, Podcast Guest Launch, managed LinkedIn, and bespoke consulting.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_FACTORY_RETAINER_3000_QTR" data-aplus-link="retainer">Start a quarter</a>
    </article>
  </section>
</AplusPage>
`;

const starterPlanPage = String.raw`---
import AplusPage from '../../layouts/AplusPage.astro';
---
<AplusPage
  title="Healthcare Hackathon Heroes | A+ Active Services"
  eyebrow="One-time access"
  heading="Healthcare Hackathon Heroes is the $197 front door."
  intro="Buy access once, then use the templates, prompts, AI Practice Audit materials, build notes, natural-intelligence workouts, and collective updates to move from practice pain to a safe first workflow."
>
  <section class="aplus-screen-stack" aria-label="Healthcare Hackathon Heroes system">
    <article>
      <p class="aplus-kicker">Worked example library</p>
      <h2>The membership is for people learning to think like Healthcare Engineers.</h2>
      <p>Members get examples that connect a real practice pain to a small artifact: prompt, workflow, audit, demo, scorecard, or implementation note.</p>
    </article>
    <article>
      <p class="aplus-kicker">Small wins compound</p>
      <h2>Means, motivation, and opportunity become a first useful workflow.</h2>
      <p>The library turns natural intelligence games, templates, build notes, and office-hours questions into repeatable judgment before anyone automates the wrong thing.</p>
    </article>
  </section>
  <section class="aplus-flywheel-strip" aria-label="Membership assets">
    <span>Templates</span>
    <span>Prompts</span>
    <span>Strategy games</span>
    <span>AI Practice Audit</span>
    <span>Build notes</span>
  </section>
  <section class="aplus-content-grid" aria-label="Healthcare Hackathon Heroes details">
    <article>
      <h2>What you get</h2>
      <p>Practical healthcare builder templates, prompts, AI Practice Audit materials, teardown notes, implementation examples, strategy games, and special access to what A+ Active is building.</p>
    </article>
    <article>
      <h2>Who it is for</h2>
      <p>Physicians, clinicians, operators, and ecosystem partners who want a clear workflow path before committing to a larger retained factory engagement.</p>
    </article>
    <article>
      <h2>How buying works</h2>
      <p>The purchase is handled through the configured Stripe payment link. The site keeps that dependency in one config surface so the URL can be swapped without rewriting pages.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_COLLECTIVE_197" data-aplus-link="collective">Join for $197</a>
    </article>
  </section>
</AplusPage>
`;

const growthPlanPage = String.raw`---
import AplusPage from '../../layouts/AplusPage.astro';
---
<AplusPage
  title="Healthcare Software Factory | A+ Active Services"
  eyebrow="Quarterly retainer"
  heading="Healthcare Software Factory starts at $3K per quarter."
  intro="Bring A+ Active in when your practice, team, or expert-led business needs help turning an idea, workflow, or offer into a useful healthcare MVP and a retained plan."
>
  <section class="aplus-screen-stack" aria-label="Healthcare Software Factory overview">
    <article>
      <p class="aplus-kicker">What you can order</p>
      <h2>A quarterly menu for practical healthcare software.</h2>
      <p>Choose workflow audit, AI Practice Audit, compound intelligence setup, prototype build, offer build, office-hours system, demo build, or launch support.</p>
    </article>
    <article>
      <p class="aplus-kicker">How we sell it</p>
      <h2>Discovery, demo, ROI, then retained execution.</h2>
      <p>We use the Work-Bench pattern: current state, cost of inaction, alternatives tried, proof, future state, and a next-step demo that makes the retainer obvious.</p>
    </article>
  </section>
  <section class="aplus-content-grid" aria-label="Healthcare Software Factory details">
    <article>
      <h2>Compound intelligence</h2>
      <p>Jai turns docs, email, calendar, classes, content, and decision loops into a system that helps buyers choose the right first AI workflow and repeat the small wins.</p>
    </article>
    <article>
      <h2>Automation lane</h2>
      <p>Anthony and Khizar build middle-office and back-office automations across front desk, scheduling, billing, guest pipelines, Podcast Guest Launch, managed LinkedIn, and your current stack.</p>
      <a class="aplus-card-link" href="https://www.podcastguestlaunch.com/" data-aplus-link="podcast">See Podcast Guest Launch</a>
    </article>
    <article>
      <h2>Retained build support</h2>
      <p>The quarterly retainer covers assessment, setup, integration planning, team training, and ongoing optimization. Stripe handles the initial contract/payment handoff.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_FACTORY_RETAINER_3000_QTR" data-aplus-link="retainer">Start a quarter</a>
    </article>
    <article>
      <h2>Start with the $197 library</h2>
      <p>Healthcare Hackathon Heroes gives teams the templates, prompts, AI Practice Audit materials, build notes, and special access before a retained factory engagement.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_COLLECTIVE_197" data-aplus-link="collective">Join for $197</a>
    </article>
  </section>
  <section class="aplus-flywheel-strip" aria-label="Partnership outputs">
    <span>Workflow audit</span>
    <span>AI Practice Audit</span>
    <span>Demo build</span>
    <span>Podcast Guest Launch</span>
    <span>Managed LinkedIn</span>
  </section>
</AplusPage>
`;

const proofPage = String.raw`---
import AplusPage from '../layouts/AplusPage.astro';
---
<AplusPage
  title="Proof | A+ Active Services"
  eyebrow="Healthcare proof"
  heading="Proof should point to safer workflows, not fake portfolio names."
  intro="This page routes buyers toward the current A+ proof surfaces: the AI Practice Audit, healthcare workflow case studies, the live masterclass, and the services factory engagement."
>
  <section class="aplus-screen-stack" aria-label="Proof strategy">
    <article>
      <p class="aplus-kicker">Worked examples</p>
      <h2>Proof should show the route from messy context to a useful artifact.</h2>
      <p>Each example should make the invisible work visible: current state, why the old approach fails, the smallest demo, and the partnership menu item it unlocks.</p>
    </article>
    <article>
      <p class="aplus-kicker">Demo discipline</p>
      <h2>A demo is not a tour. It is a diagnostic preview.</h2>
      <p>The goal is to help a buyer recognize their own pain, see the ROI driver, and book office hours with enough context for the next conversation.</p>
    </article>
  </section>
  <section class="aplus-content-grid" aria-label="A+ Active proof routes">
    <article>
      <h2>Pneumonia discharge memory</h2>
      <p>A healthcare workflow case study for turning discharge context into a usable memory layer and follow-up plan.</p>
      <a class="aplus-card-link" href="/case-studies/pneumonia-discharge-memory">Read the case study</a>
    </article>
    <article>
      <h2>PHI scrubber</h2>
      <p>A prototype path for handling sensitive healthcare text before it moves into downstream software workflows.</p>
      <a class="aplus-card-link" href="/case-studies/phi-scrubber">Read the case study</a>
    </article>
    <article>
      <h2>AI Practice Audit</h2>
      <p>For private practices, clinics, podcast guests, and founders with a real workflow, the next step is an audit call that names the first safe workflow to test.</p>
      <a class="aplus-card-link" href="https://cal.com/REPLACE_APLUS_ACTIVE" data-aplus-link="calendar">Book office hours</a>
    </article>
  </section>
</AplusPage>
`;

const fieldNotesPage = String.raw`---
import AplusPage from '../layouts/AplusPage.astro';
---
<AplusPage
  title="Field Notes | A+ Active Services"
  eyebrow="Healthcare Heroes"
  heading="Field notes now live through the Healthcare Heroes newsletter."
  intro="The branded site should not ship template SEO posts. Substack is the current source of truth for essays, build notes, event reminders, AI Practice Audit thinking, and Digital Health Collective updates."
>
  <section class="aplus-screen-stack" aria-label="Field-note screen strategy">
    <article>
      <p class="aplus-kicker">Worked example first</p>
      <h2>The article route is a demand-capture screen, not a dead archive.</h2>
      <p>Each retired post now points to the real editorial loop: a specific workflow, the public demo, the office-hours discussion, and the retained Healthcare Software Factory menu item.</p>
    </article>
    <article>
      <p class="aplus-kicker">Metacognition steering</p>
      <h2>Readers should leave with one useful decision.</h2>
      <p>The page makes the next constraint visible: learn the concept on Substack, watch the live room, buy the Healthcare Hackathon Heroes library, or book the trio for a workflow audit.</p>
    </article>
  </section>
  <section class="aplus-screen-stack" aria-label="Field-note acquisition strategy">
    <article>
      <p class="aplus-kicker">Content flywheel</p>
      <h2>Every field note should come from a worked example.</h2>
      <p>The public loop is content, office hours, demos, weekly events, LinkedIn streams, YouTube replays, Slack discussion, Substack essays, and Twitter/X clips.</p>
    </article>
    <article>
      <p class="aplus-kicker">Retainer path</p>
      <h2>The note should make one next step obvious.</h2>
      <p>Subscribe for the next example, attend the live room, buy the library, or bring the workflow into a Healthcare Software Factory call.</p>
    </article>
  </section>
  <section class="aplus-content-grid" aria-label="A+ Active field notes">
    <article>
      <h2>Subscribe free</h2>
      <p>Use the Sweet Science Substack as the newsletter entry point until the final Healthcare Heroes publication is swapped in through config.</p>
      <a class="aplus-card-link" href="https://sweetscience.substack.com/" data-aplus-link="newsletter">Subscribe on Substack</a>
    </article>
    <article>
      <h2>Join the live rhythm</h2>
      <p>The weekly masterclass and office hours turn notes into working decisions for healthcare builders.</p>
      <a class="aplus-card-link" href="/masterclass">See the masterclass</a>
    </article>
    <article>
      <h2>Buy the library</h2>
      <p>Healthcare Hackathon Heroes is the paid library and special-access layer for builders who want templates, prompts, AI Practice Audit materials, strategy games, and build notes.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_COLLECTIVE_197" data-aplus-link="collective">Join for $197</a>
    </article>
  </section>
</AplusPage>
`;

const projectDetailPage = String.raw`---
import AplusPage from '../../layouts/AplusPage.astro';
---
<AplusPage
  title="Healthcare Proof | A+ Active Services"
  eyebrow="Proof route"
  heading="This proof route now points to real healthcare build paths."
  intro="The original Webflow project slug is retained for routing compatibility, but the branded A+ page sends buyers to current case studies and office hours."
>
  <section class="aplus-screen-stack" aria-label="Proof detail strategy">
    <article>
      <p class="aplus-kicker">Slug compatibility</p>
      <h2>Old project URLs now behave like proof routers.</h2>
      <p>The page keeps the link alive while moving the buyer toward current evidence: worked examples, PHI-safe demos, office hours, and the AI Practice Audit.</p>
    </article>
    <article>
      <p class="aplus-kicker">Discovery handoff</p>
      <h2>The next step is a current-state conversation.</h2>
      <p>Use this screen to route documentation burden, staffing pressure, AI implementation friction, podcast guest offers, or bespoke consulting into a concrete retained menu item.</p>
    </article>
  </section>
  <section class="aplus-flywheel-strip" aria-label="Proof detail outputs">
    <span>Current state</span>
    <span>Worked example</span>
    <span>AI Practice Audit</span>
    <span>Office hours</span>
    <span>Retained plan</span>
  </section>
  <section class="aplus-content-grid" aria-label="Healthcare proof handoff">
    <article>
      <h2>Current case studies</h2>
      <p>Review the pneumonia discharge memory and PHI scrubber case studies for the current proof surface.</p>
      <a class="aplus-card-link" href="/projects">See proof</a>
    </article>
    <article>
      <h2>Discuss a clinic workflow</h2>
      <p>Bring a documentation, staffing, front-desk, billing, prototype, or guest opportunity to office hours with the trio.</p>
      <a class="aplus-card-link" href="https://cal.com/REPLACE_APLUS_ACTIVE" data-aplus-link="calendar">Book office hours</a>
    </article>
  </section>
</AplusPage>
`;

const utilityPage = String.raw`---
import AplusPage from '../../layouts/AplusPage.astro';
---
<AplusPage
  title="A+ Active Services"
  eyebrow="A+ Active Services"
  heading="This template utility page has been retired."
  intro="The A+ deploy keeps this route only for compatibility. Buyers should use the offer ladder, newsletter, or office hours instead."
>
  <section class="aplus-screen-stack" aria-label="Utility route strategy">
    <article>
      <p class="aplus-kicker">Compatibility route</p>
      <h2>Utility pages should still sell the operating system.</h2>
      <p>These old template routes now explain the A+ dependency stack: Substack for newsletter, Stripe for community purchase and retainers, Cal.com for events and booking, Slack for member follow-through.</p>
    </article>
    <article>
      <p class="aplus-kicker">Offer ladder</p>
      <h2>Route every confused visitor to the same three choices.</h2>
      <p>Start free with the weekly rhythm, buy Healthcare Hackathon Heroes for $197, or order the Healthcare Software Factory when the workflow needs retained execution.</p>
    </article>
  </section>
  <section class="aplus-flywheel-strip" aria-label="Utility route integrations">
    <span>Substack</span>
    <span>Stripe</span>
    <span>Cal.com</span>
    <span>Slack</span>
    <span>Netlify</span>
  </section>
  <section class="aplus-content-grid" aria-label="A+ Active routing">
    <article>
      <h2>Join the collective</h2>
      <p>Healthcare Hackathon Heroes gives builders the paid template, prompt, AI Practice Audit, strategy game, and build-note library.</p>
      <a class="aplus-card-link" href="https://buy.stripe.com/REPLACE_COLLECTIVE_197" data-aplus-link="collective">Join for $197</a>
    </article>
    <article>
      <h2>Book office hours</h2>
      <p>Use the calendar for masterclass and trio office-hour routing.</p>
      <a class="aplus-card-link" href="https://cal.com/REPLACE_APLUS_ACTIVE" data-aplus-link="calendar">See the calendar</a>
    </article>
  </section>
</AplusPage>
`;

const passwordPage = String.raw`---
import AplusPage from '../layouts/AplusPage.astro';
---
<AplusPage
  title="A+ Active Services"
  eyebrow="A+ Active Services"
  heading="This private template route has been retired."
  intro="The public A+ experience now routes buyers through the offer ladder, newsletter, masterclass, and office hours."
>
  <section class="aplus-screen-stack" aria-label="Private access strategy">
    <article>
      <p class="aplus-kicker">Private access</p>
      <h2>Protected routes become a clean membership explanation.</h2>
      <p>Healthcare Hackathon Heroes is the paid library and special-access layer. Retained clients move into scoped Healthcare Software Factory work after discovery, demo, ROI, and urgency are clear.</p>
    </article>
    <article>
      <p class="aplus-kicker">Back-office handoff</p>
      <h2>Access should connect payment, Slack, calendar, and follow-up.</h2>
      <p>The temporary public route names the intended system until final Stripe links, Slack onboarding, and event-calendar automations replace the placeholders.</p>
    </article>
  </section>
  <section class="aplus-content-grid">
    <article>
      <h2>Start with the offer ladder</h2>
      <p>Choose free masterclass access, the $197 collective, or the quarterly Healthcare Software Factory.</p>
      <a class="aplus-card-link" href="/pricing">See the offers</a>
    </article>
  </section>
</AplusPage>
`;

const notFoundPage = String.raw`---
import AplusPage from '../layouts/AplusPage.astro';
---
<AplusPage
  title="Not found | A+ Active Services"
  eyebrow="Not found"
  heading="That page is not part of the current A+ build path."
  intro="Use the current offer ladder, masterclass, resources, or office hours to get back into the Healthcare Software Factory flow."
>
  <section class="aplus-screen-stack" aria-label="Fallback route strategy">
    <article>
      <p class="aplus-kicker">Fallback path</p>
      <h2>A missed URL should still teach the acquisition loop.</h2>
      <p>Every path returns visitors to the same system: worked examples, office hours, demos, weekly events, LinkedIn streams, YouTube replays, Slack discussion, Substack notes, and Twitter/X clips.</p>
    </article>
    <article>
      <p class="aplus-kicker">Next decision</p>
      <h2>Choose the right level of help.</h2>
      <p>Start with the free masterclass, buy the $197 library, or book a conversation for the Healthcare Software Factory retainer when a real workflow is ready.</p>
    </article>
  </section>
  <section class="aplus-content-grid">
    <article>
      <h2>Go to the current routes</h2>
      <p>The active paths are Healthcare Hackathon Heroes, the free masterclass, AI Practice Audit, Healthcare Software Factory, Podcast Guest Launch, and the Healthcare Heroes newsletter.</p>
      <a class="aplus-card-link" href="/">Return home</a>
    </article>
  </section>
</AplusPage>
`;

function brandCopy(html) {
  return html
    .replace(/https:\/\/nexia-agency\.webflow\.io/g, '')
    .replace(/https:\/\/onixtheme\.com\/customization\//g, 'mailto:hello@aplusactive.com?subject=How%20we%20built%20this')
    .replace(/https:\/\/onixtheme\.com\//g, 'mailto:hello@aplusactive.com?subject=How%20we%20built%20this')
    .replace(/tel:\+4321234567/g, 'https://cal.com/REPLACE_APLUS_ACTIVE')
    .replace(/mailto:hello@aplusactive\.com\?subject=nexia\.contact%40gmail\.com/g, 'mailto:hello@aplusactive.com?subject=How%20we%20built%20this')
    .replace(/mailto:hello@aplusactive\.com\?subject=nexia\.contact%40gmail\.com/gi, 'mailto:hello@aplusactive.com?subject=How%20we%20built%20this')
    .replace(/subject=nexia\.contact%40gmail\.com/gi, 'subject=How%20we%20built%20this')
    .replace(/https:\/\/facebook\.com/g, 'https://sweetscience.substack.com/')
    .replace(/https:\/\/www\.linkedin\.com\//g, 'mailto:hello@aplusactive.com?subject=A%2B%20Services%20Factory')
    .replace(/https:\/\/www\.instagram\.com\//g, 'https://cal.com/REPLACE_APLUS_ACTIVE')
    .replace(/https:\/\/www\.google\.com\/maps/g, 'mailto:hello@aplusactive.com?subject=How%20we%20built%20this')
    .replace(/nexia\.contact@gmail\.com/g, 'hello@aplusactive.com')
    .replace(/\+432 123 4567/g, 'Office hours by calendar')
    .replace(/75, rue Pacifique est Bromont \(Québec\) J2L 1J4/g, 'Remote healthcare engineering studio')
    .replace(/NEXIA Studio/g, 'A+ Active Services')
    .replace(/NEXIA/g, 'A+ Active')
    .replace(/Nexia/g, 'A+ Active')
    .replace(/NEXA/g, 'A+ Active')
    .replace(/Digital Solutions That Drive Success/g, 'A+ Active Services')
    .replace(/We Design, Build & Grow Digital Products/g, 'Designed by Healthcare Engineers')
    .replace(/premium Webflow template for modern creative studios, combining bold visuals, smooth layouts, and essential business pages/g, 'healthcare engineering studio for founders, clinics, podcast guests, and operators building practical healthcare software')
    .replace(/ Webflow Ecommerce website template/g, '')
    .replace(/Webflow Ecommerce website template/g, 'Healthcare Software Factory')
    .replace(/Let’s Talk/g, 'Join for $197')
    .replace(/Get Free Consultation/g, 'Join for $197')
    .replace(/Start Now/g, 'Ask how we built this')
    .replace(/Get Started/g, 'Start here')
    .replace(/Projects/g, 'Proof')
    .replace(/Blogs/g, 'Field Notes')
    .replace(/Project Details/g, 'Proof Details')
    .replace(/Blog Details/g, 'Field Notes')
    .replace(/Pricing Details/g, 'Offer Details')
    .replace(/Contact Us/g, 'Office Hours')
    .replace(/Style guide/g, 'Resources')
    .replace(/License/g, 'How We Build')
    .replace(/Changelog/g, 'Updates')
    .replace(/Password/g, 'Private Access')
    .replace(/Top Rated Agency/g, 'Compound Intelligence Factory')
    .replace(/Trusted Digital Growth Partner/g, 'Designed by Healthcare Engineers')
    .replace(/creative digital agency/gi, 'compound intelligence and automation studio')
    .replace(/brands grow faster/gi, 'healthcare ideas reach MVP')
    .replace(/business grow in the digital world/gi, 'healthcare software move from idea to MVP')
    .replace(/Ready\s*<\/h2><h2 class="cta-title">To<\/h2><h2 class="cta-title start">Start<\/h2><\/div><div data-w-id="55501429-edc0-238e-8edf-e5394b902f23" class="cta-1 _02"><h2 class="cta-title your">Your<\/h2><h2 class="cta-title">Digital<\/h2><h2 class="cta-title">Project\?/g, 'Ready</h2><h2 class="cta-title">To</h2><h2 class="cta-title start">Build</h2></div><div data-w-id="55501429-edc0-238e-8edf-e5394b902f23" class="cta-1 _02"><h2 class="cta-title your">Your</h2><h2 class="cta-title">Healthcare</h2><h2 class="cta-title">MVP?')
    .replace(/Customize Template/g, 'Ask how we built this')
    .replace(/Unlock 200\+ Template/g, 'Join the Collective')
    .replace(/Trusted by 5,000\+ Users/g, 'Built with healthcare engineers')
    .replace(/Anantaraya/g, 'Pneumonia Discharge Memory')
    .replace(/Aureva/g, 'PHI Scrubber')
    .replace(/Morph/g, 'Clinic Workflow Prototype')
    .replace(/Legolas/g, 'Guest Offer Build')
    .replace(/Steelcrest/g, 'Healthcare Factory Sprint')
    .replace(/Why Strong Branding Matters in the Digital Era/g, blogWorkflows['why-strong-branding-matters-in-the-digital-era'].title)
    .replace(/The Role of User Experience in Conversion Rates/g, blogWorkflows['the-role-of-user-experience-in-conversion-rates'].title)
    .replace(/Harnessing Social Media for Brand Awareness/g, blogWorkflows['harnessing-social-media-for-brand-awareness'].title)
    .replace(/The Importance of Mobile Optimization/g, blogWorkflows['the-importance-of-mobile-optimization'].title)
    .replace(/Innovative Branding Strategies for Startups/g, blogWorkflows['innovative-branding-strategies-for-startups'].title)
    .replace(/Leveraging Social Media for Brand Awareness/g, blogWorkflows['leveraging-social-media-for-brand-awareness'].title)
    .replace(/The Impact of Consistent Messaging Across Platforms/g, blogWorkflows['the-impact-of-consistent-messaging-across-platforms'].title)
    .replace(/The Role of User Experience in Brand Loyalty/g, blogWorkflows['the-role-of-user-experience-in-brand-loyalty'].title)
    .replace(/Discover how a strong brand identity builds trust, improves recognition, and\.\.\./g, blogWorkflows['why-strong-branding-matters-in-the-digital-era'].excerpt)
    .replace(/Explore how optimizing user experience can significantly enhance conversion ra\.\.\./g, blogWorkflows['the-role-of-user-experience-in-conversion-rates'].excerpt)
    .replace(/Learn effective strategies for leveraging social media platforms to boost brand v\.\.\./g, blogWorkflows['harnessing-social-media-for-brand-awareness'].excerpt)
    .replace(/Understand why mobile optimization is crucial for reaching customers on the g\.\.\./g, blogWorkflows['the-importance-of-mobile-optimization'].excerpt)
    .replace(/Discover creative branding strategies that can help startups establish a strong\.\.\./g, blogWorkflows['innovative-branding-strategies-for-startups'].excerpt)
    .replace(/Uncover unique branding tactics that help startups differentiate themselves\.\.\./g, blogWorkflows['innovative-branding-strategies-for-startups'].excerpt)
    .replace(/Learn the strategies to utilize social media platforms effectively, amplifying\.\.\./g, blogWorkflows['leveraging-social-media-for-brand-awareness'].excerpt)
    .replace(/Analyze the importance of maintaining consistent messaging across various c\.\.\./g, blogWorkflows['the-impact-of-consistent-messaging-across-platforms'].excerpt)
    .replace(/Explore how an exceptional user experience fosters brand loyalty, encou\.\.\./g, blogWorkflows['the-role-of-user-experience-in-brand-loyalty'].excerpt)
    .replace(/Brand Loyalty/g, 'Healthcare Team Trust')
    .replace(/User Experience/g, 'Healthcare Workflow')
    .replace(/Mobile Optimization/g, 'Mobile Healthcare Workflow')
    .replace(/Flexible Pricing/g, 'Offer Ladder')
    .replace(/Simple &amp; Transparent Pricing/g, 'Start Free, Join, Or Retain Us')
    .replace(/Simple\s*<\/h1><h1 class="hero-title">&amp;<\/h1><h1 class="hero-title">Transparent<\/h1><h1 class="hero-title">Pricing/g, 'Start</h1><h1 class="hero-title">Free,</h1><h1 class="hero-title">Join,</h1><h1 class="hero-title">Or Retain Us')
    .replace(/Choose a flexible plan that fits your business needs and scale your digital growth with confidence\./g, 'Choose the free masterclass, the $197 collective pass, or the $3K+ quarterly software factory retainer.')
    .replace(/Perfect for startups and small businesses starting their digital journey\./g, 'For healthcare builders who want the templates, skills, and special access before a retained build.')
    .replace(/Ideal for growing brands that need complete digital solutions\./g, 'For clinics, founders, podcast guests, and teams that need a working MVP and last-mile plan.')
    .replace(/UI\/UX Design for 1 Page/g, 'Healthcare MVP templates')
    .replace(/Responsive Website Layout/g, 'Build notes and implementation examples')
    .replace(/Basic Branding Setup/g, 'Healthcare workflow prompts')
    .replace(/Standard Development Support/g, 'Member updates and special access')
    .replace(/2x Revision Rounds/g, 'Digital Health Collective context')
    .replace(/Full Website UI\/UX Design/g, 'MVP scoping and prototype build')
    .replace(/Custom Web Development/g, 'Healthcare workflow customization')
    .replace(/Complete Branding &amp; Identity/g, 'Integration and data boundary planning')
    .replace(/SEO &amp; Performance Optimization/g, 'Buyer, clinic, and operator handoff')
    .replace(/Unlimited Revisions/g, 'Last-mile action plan')
    .replace(/VAT applied at checkout/g, 'Stripe or contract link applied at checkout')
    .replace(/The Impact Amplifier initiative equips organizations with tools and strategies to enhance their influence\. By blending proven principles with innovative branding and tailored digital solutions, we create adaptable experiences focused on sustainable growth, merging creativity with technical expertise\./g, 'Healthcare Hackathon Heroes gives healthcare builders a practical library of templates, prompts, AI Practice Audit materials, build notes, strategy games, and worked examples for turning practice pain into a safe first workflow.')
    .replace(/Our Growth Accelerator program offers tailored strategies and hands-on support to help your business thrive in new markets while maintaining brand identity\. This approach combines insightful planning with effective execution, perfect for companies aiming to boost their market presence\./g, 'The Healthcare Software Factory is the retained path for clinics, founders, podcast guests, and healthcare teams that need workflow audits, prototype builds, integration planning, offer builds, office-hours systems, and last-mile implementation support.')
    .replace(/Facbook/g, 'Newsletter')
    .replace(/Linkedin/g, 'Factory inquiry')
    .replace(/Instagram/g, 'Office hours')
    .replace(/Digital Marketing/g, 'Healthcare software workflows')
    .replace(/Branding &amp; Identity/g, 'Offer and product packaging')
    .replace(/We offer end-to-end digital services including UI\/UX Design, Web Development, Offer and product packaging, Healthcare software workflows, Mobile App Development, and Strategy &amp; Consulting\./g, 'We offer AI practice audits, healthcare workflow design, documentation and front-desk automation, implementation planning, and retained optimization for private practices and healthcare operators.')
    .replace(/Our comprehensive digital services encompass UI\/UX Design, Web Development, Offer and product packaging, Healthcare software workflows, Mobile App Development, and Strategy &amp; Consulting\. The duration of a typical project can vary based on its complexity and scope\./g, 'A first audit can start after one masterclass or office-hour call. Retained implementation usually starts with a focused quarter so we can assess the workflow, configure the stack, train the team, and optimize what is working.')
    .replace(/We specialize in providing comprehensive digital solutions tailored for startups and small businesses\. Our services include UI\/UX Design, Web Development, Offer and product packaging, Healthcare software workflows, Mobile App Development, and Strategy &amp; Consulting\./g, 'We work with private-practice physicians, clinics, operators, podcast guests, and founders who need AI to reduce admin burden without losing human review and compliance judgment.')
    .replace(/Yes, you can request revisions throughout the project\. Our comprehensive digital services encompass UI\/UX Design, Web Development, Offer and product packaging, Healthcare software workflows, Mobile App Development, and Strategy &amp; Consulting, ensuring we can adapt to your feedback at every stage\./g, 'Yes. The work is designed as an audit and optimization loop: identify the workflow, test it safely, review the output, and adapt the system before it touches patients, payment, or records.')
    .replace(/To kick off your project, we provide comprehensive digital solutions such as UI\/UX design, web development, branding and identity, digital marketing, mobile app development, and strategic consulting\./g, 'To start, we need your practice type, current systems, top admin burdens, data boundaries, human approval rules, and the first workflow you want to test.')
    .replace(/Yes, we provide comprehensive ongoing support after launch\. Our services include UI\/UX Design, Web Development, Offer and product packaging, Healthcare software workflows, Mobile App Development, and Strategy &amp; Consulting to ensure your project continues to thrive\./g, 'Yes. The Healthcare Software Factory is the retained support path for ongoing configuration, integration planning, training, back-office automation, and workflow optimization.')
    .replace(/Starter Plan/g, 'Healthcare Hackathon Heroes')
    .replace(/\$499\.00 USD/g, '$197 one-time')
    .replace(/\$499/g, '$197')
    .replace(/Growth Plan/g, 'Healthcare Software Factory')
    .replace(/\$1,299\.00 USD/g, '$3K+/quarter')
    .replace(/\$1,299/g, '$3K+/quarter');
}

function routeSpecificCopy(html, file) {
  if (file === 'src/pages/product/growth-plan.astro') {
    return html
      .replace(/For healthcare builders who want the templates, skills, and special access before a retained build\./g, 'For clinics, founders, podcast guests, and healthcare teams that need retained software execution.')
      .replace(/Healthcare MVP templates/g, 'Workflow audit and MVP scoping')
      .replace(/Build notes and implementation examples/g, 'Prototype build and customization')
      .replace(/Healthcare workflow prompts/g, 'Integration and data boundary planning')
      .replace(/Member updates and special access/g, 'Team training and implementation support')
      .replace(/Digital Health Collective context/g, 'Last-mile action plan');
  }
  if (file === 'src/pages/product/starter-plan.astro') {
    return html
      .replace(/Stripe or contract link applied at checkout/g, 'Stripe link applied at checkout');
  }
  return html;
}

function routeLayer(file) {
  if (file === 'src/pages/product/starter-plan.astro') {
    return String.raw`
<section class="aplus-screen-stack" aria-label="Healthcare Hackathon Heroes acquisition path">
  <article>
    <p class="aplus-kicker">One-time access</p>
    <h2>Healthcare Hackathon Heroes is the $197 front door.</h2>
    <p>Buy access once, then use templates, prompts, AI Practice Audit materials, build notes, natural-intelligence workouts, and collective updates to move from practice pain to a safe first workflow.</p>
  </article>
  <article>
    <p class="aplus-kicker">How to use it</p>
    <h2>The membership should create a first useful healthcare workflow.</h2>
    <p>Start with a worked example, test it on synthetic data, share the output with your IT team, and bring the next constraint into office hours.</p>
  </article>
</section>`;
  }
  if (file === 'src/pages/product/growth-plan.astro') {
    return String.raw`
<section class="aplus-screen-stack" aria-label="Healthcare Software Factory acquisition path">
  <article>
    <p class="aplus-kicker">Quarterly retainer</p>
    <h2>Healthcare Software Factory starts at $3K per quarter.</h2>
    <p>Bring A+ Active in when your practice, team, or expert-led business needs help turning an idea, workflow, or offer into a useful healthcare MVP and a retained plan.</p>
  </article>
  <article>
    <p class="aplus-kicker">What gets built</p>
    <h2>Discovery, demo, ROI, then retained execution.</h2>
    <p>We scope workflow audits, AI Practice Audits, prototype builds, offer builds, office-hours systems, Podcast Guest Launch handoffs, managed LinkedIn, and last-mile implementation plans.</p>
  </article>
</section>`;
  }
  if (file === 'src/pages/projects.astro') {
    return String.raw`
<section class="aplus-screen-stack" aria-label="Proof strategy">
  <article>
    <p class="aplus-kicker">Worked examples</p>
    <h2>Proof should show the route from messy context to a useful artifact.</h2>
    <p>Each example should make the invisible work visible: current state, why the old approach fails, the smallest demo, and the Healthcare Software Factory menu item it unlocks.</p>
  </article>
  <article>
    <p class="aplus-kicker">Demo discipline</p>
    <h2>A demo is not a tour. It is a diagnostic preview.</h2>
    <p>The goal is to help a buyer recognize their own pain, see the ROI driver, and book office hours with enough context for the next conversation.</p>
  </article>
</section>`;
  }
  if (file === 'src/pages/blog.astro' || file.startsWith('src/pages/blog-posts/')) {
    const workflow = blogWorkflow(file);
    const detail = workflow ? String.raw`
<section class="aplus-worked-example-panel" aria-label="Worked example starter action">
  <div>
    <p class="aplus-kicker">${workflow.source}</p>
    <h2>${workflow.title}</h2>
    <p>${workflow.excerpt}</p>
  </div>
  <div class="aplus-worked-example-grid">
    <article><span>Who</span><p>${workflow.persona}</p></article>
    <article><span>Use this now</span><p>${workflow.action}</p></article>
    <article><span>Mini quest</span><p>${workflow.miniQuest}</p></article>
    <article><span>Podcast bridge</span><p>Use the Digital Health Podcast archive as source material for the next examples: <a href="https://www.youtube.com/@DigitalHealthPodcast" target="_blank" rel="noreferrer">watch the channel</a>.</p></article>
  </div>
</section>` : String.raw`
<section class="aplus-worked-example-panel" aria-label="Worked example library">
  <div>
    <p class="aplus-kicker">Worked example library</p>
    <h2>Start with a small healthcare workflow you can test today.</h2>
    <p>These field notes should act like starter actions: try the workflow on synthetic data, share the output with IT, and decide whether it belongs in a harness, UI, managed service, or custom cluster.</p>
  </div>
  <div class="aplus-worked-example-grid">
    <article><span>Doctor</span><p>Medication reconciliation, documentation assistant, referral tracking, patient education, and care coordination.</p></article>
    <article><span>CHP</span><p>Resource referral, follow-up tracking, communication logs, risk stratification, and community mapping.</p></article>
    <article><span>IT</span><p>Security assessment, integration planning, compliance checks, data validation, and monitoring setup.</p></article>
    <article><span>Podcast source</span><p>Turn the 17 Digital Health Podcast episodes into crossover worked examples and quote cards: <a href="https://www.youtube.com/@DigitalHealthPodcast" target="_blank" rel="noreferrer">Digital Health Podcast</a>.</p></article>
  </div>
</section>`;
    return String.raw`
	<section class="aplus-screen-stack" aria-label="Field-note acquisition strategy">
	  <article>
	    <p class="aplus-kicker">Content flywheel</p>
	    <h2>Every field note should come from a worked example.</h2>
	    <p>The public loop is content, office hours, demos, weekly events, LinkedIn streams, YouTube replays, Slack discussion, Substack essays, and Twitter/X clips.</p>
  </article>
  <article>
    <p class="aplus-kicker">Retainer path</p>
	    <h2>The note should make one next step obvious.</h2>
	    <p>Subscribe for the next example, attend the live room, buy the library, or bring the workflow into a Healthcare Software Factory call.</p>
	  </article>
	</section>
${detail}`;
  }
  if (file.startsWith('src/pages/projects/')) {
    return String.raw`
<section class="aplus-screen-stack" aria-label="Proof detail strategy">
  <article>
    <p class="aplus-kicker">Slug compatibility</p>
    <h2>Old project URLs now behave like proof routers.</h2>
    <p>The page keeps the link alive while moving the buyer toward current evidence: worked examples, PHI-safe demos, office hours, and the AI Practice Audit.</p>
  </article>
  <article>
    <p class="aplus-kicker">Discovery handoff</p>
    <h2>The next step is a current-state conversation.</h2>
    <p>Use this screen to route documentation burden, staffing pressure, AI implementation friction, podcast guest offers, or bespoke consulting into a concrete retained menu item.</p>
  </article>
</section>`;
  }
  return '';
}

function injectOffer(body, file = '') {
  if (body.includes('aplus-offer-panel')) return body;
  const layer = routeLayer(file);
  if (body.includes('<div class="footer-bg">')) {
    return body.replace('<div class="footer-bg">', `${layer}${offerPanel}<div class="footer-bg">`);
  }
  return `${body}${layer}${offerPanel}`;
}

function removeElementByStartPattern(html, startPattern) {
  let output = html;
  let match;
  while ((match = startPattern.exec(output))) {
    const start = match.index;
    const openEnd = output.indexOf('>', start);
    if (openEnd === -1) break;
    const tagMatch = output.slice(start, openEnd + 1).match(/^<([a-z0-9-]+)/i);
    if (!tagMatch) break;
    const tagName = tagMatch[1].toLowerCase();
    const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
    tagPattern.lastIndex = openEnd + 1;
    let depth = 1;
    let tag;
    let end = openEnd + 1;
    while ((tag = tagPattern.exec(output))) {
      const token = tag[0];
      if (token.startsWith('</')) depth -= 1;
      else if (!token.endsWith('/>')) depth += 1;
      if (depth === 0) {
        end = tagPattern.lastIndex;
        break;
      }
    }
    if (depth !== 0) break;
    output = `${output.slice(0, start)}${output.slice(end)}`;
    startPattern.lastIndex = 0;
  }
  return output;
}

function stripAplusArtifacts(body) {
  let output = body
    .replace(/<script type="text\/x-wf-template"[\s\S]*?<\/script>/g, '')
    .replace(/<form[^>]*data-node-type="commerce-cart-form"[\s\S]*?<\/form>/g, '');

  const removableStarts = [
    /<div\b(?=[^>]*class="[^"]*\bwebsite-banner-wrapper\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*class="[^"]*\bnav-cart\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*class="[^"]*\bw-commerce-commercecartwrapper\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*class="[^"]*\bw-commerce-commercecartcontainerwrapper\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*class="[^"]*\bw-commerce-commercecartformwrapper\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*class="[^"]*\bw-commerce-commercecartemptystate\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*class="[^"]*\bw-commerce-commercecarterrorstate\b[^"]*")[^>]*>/gi,
    /<div\b(?=[^>]*data-wf-cart-type=)[^>]*>/gi,
    /<div\b(?=[^>]*data-node-type="commerce-cart[^"]*")[^>]*>/gi,
  ];

  for (const pattern of removableStarts) {
    output = removeElementByStartPattern(output, pattern);
  }

  return output;
}

function localize(html) {
  let output = html;
  const replacements = { ...cdnManifest, ...jsManifest };
  for (const [remote, local] of Object.entries(replacements)) {
    output = output.split(remote).join(local);
    output = output.split(remote.replace(/&/g, '&amp;')).join(local);
  }
  output = output.replaceAll('https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg', '/assets/webflow-bundle/favicon.svg');
  output = output.replaceAll('https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg'.replace(/&/g, '&amp;'), '/assets/webflow-bundle/favicon.svg');
  output = output.replace(/<link href="https:\/\/cdn\.prod\.website-files\.com\/69577d210b4351354040f31c\/css\/nexia-agency\.webflow\.shared\.5b4cdb57c\.css"[^>]*>/, '<link href="/assets/webflow-bundle/c36a0562fb6b95e9.css" rel="stylesheet" type="text/css"/>');
  output = output.replace(/<script src="https:\/\/ajax\.googleapis\.com\/ajax\/libs\/webfont\/1\.6\.26\/webfont\.js"[^>]*><\/script>/, '<script src="/assets/js/webfont.js"></script>');
  output = output.replace(/<link href="https:\/\/fonts\.googleapis\.com"[^>]*>/g, '');
  output = output.replace(/<link href="https:\/\/fonts\.gstatic\.com"[^>]*>/g, '');
  output = output.replace(/(<script\b[^>]*\bsrc="\/assets\/js\/[^"]+"[^>]*)\s+integrity="[^"]*"/g, '$1');
  output = output.replace(/(<script\b[^>]*\bsrc="\/assets\/js\/[^"]+"[^>]*)\s+crossorigin="[^"]*"/g, '$1');
  return output;
}

function toAstro(html, file = '') {
  const localized = variant === 'aplus' ? routeSpecificCopy(brandCopy(localize(html)), file) : localize(html);
  const htmlTagMatch = localized.match(/<html\b([^>]*)>/i);
  const headMatch = localized.match(/<head>([\s\S]*?)<\/head>/i);
  const bodyMatch = localized.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!htmlTagMatch || !headMatch || !bodyMatch) throw new Error('Could not parse live html/head/body');

  let head = headMatch[1];
  let body = bodyMatch[1];
  const htmlAttrs = variant === 'aplus'
    ? htmlTagMatch[1].trim().replace(/data-wf-domain="[^"]*"/, 'data-wf-domain="aplus-active-services.netlify.app"')
    : htmlTagMatch[1].trim();

  head = head.replace(/<meta charset="utf-8"\/>?/, '');
  head = head.replace(/<meta content="width=device-width, initial-scale=1" name="viewport"\/>?/, '');
  head += '<style is:global>.w-webflow-badge{display:none!important;visibility:hidden!important;}</style>';
  if (variant === 'aplus') {
    head = head.replace(/nexia-agency\.webflow\.io/g, 'A+ Active Services');
    head = head.replace(/<link href="https:\/\/cdn\.prod\.website-files\.com"[^>]*>/g, '');
    head = head.replace(/<meta content="Webflow" name="generator"\/?>/g, '<meta content="Astro on Netlify" name="generator"/>');
    head = head.replace(/<script type="text\/javascript">window\.__WEBFLOW_CURRENCY_SETTINGS[\s\S]*?<\/script>/g, '');
    head = head.replace(/<title>[\s\S]*?<\/title>/i, '<title>A+ Active Services | Compound Intelligence Factory</title>');
    head = head.replace(/creative studios/g, 'healthcare engineers');
    head = head.replace(/modern creative/g, 'healthcare software');
    head += '<link rel="stylesheet" href="/aplus-overrides.css" />';
    body = stripAplusArtifacts(body);
    body = injectOffer(body, file);
    body = body.replace(/Powered by\s*<a[^>]*href="https:\/\/webflow\.com[^"]*"[^>]*>Webflow<\/a>/gi, '<a href="mailto:hello@aplusactive.com?subject=How%20we%20built%20this" data-aplus-link="inbound">Designed by Healthcare Engineers</a>');
    body = body.replace(/<a([^>]*href="https:\/\/webflow\.com[^"]*"[^>]*)>Webflow<\/a>/gi, '<a$1 data-aplus-link="inbound">Designed by Healthcare Engineers</a>');
    body += '<script is:inline src="/aplus-config.js"></script><script is:inline src="/aplus-bindings.js"></script>';
  }
  body += '<script is:inline>function normalizeWebflowCloneDom(){document.querySelectorAll(".w-webflow-badge,[href*=\\"webflow.com\\"][class*=\\"badge\\"]").forEach(function(el){el.remove();});document.querySelectorAll(".related-title > .lightbox-gallery").forEach(function(el){el.replaceWith(document.createTextNode(el.textContent));});if(window.innerWidth<768&&window.location.pathname.indexOf("/product/")===0){document.querySelectorAll(".section.pricing-single .pricing-3").forEach(function(el){el.style.opacity="0";el.style.transform="";el.style.transformStyle="";});}}normalizeWebflowCloneDom();setInterval(normalizeWebflowCloneDom,250);</script>';

  return `---
---
<!doctype html>
<html ${htmlAttrs}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

async function readRoute(route) {
  if (route.url === 'https://nexia-agency.webflow.io/' && fs.existsSync('/tmp/nexia-live.html')) {
    return fs.readFileSync('/tmp/nexia-live.html', 'utf8');
  }
  const response = await fetch(route.url);
  if (!response.ok) throw new Error(`Fetch failed ${response.status} for ${route.url}`);
  return response.text();
}

for (const route of routes) {
  const html = await readRoute(route);
  fs.mkdirSync(path.dirname(route.file), { recursive: true });
  const output = variant === 'aplus' && route.file === 'src/pages/checkout.astro'
    ? checkoutPage
    : variant === 'aplus' && route.file.startsWith('src/pages/information-pages/')
              ? utilityPage
              : variant === 'aplus' && route.file === 'src/pages/401.astro'
                ? passwordPage
    : variant === 'aplus' && route.file === 'src/pages/404.astro'
                  ? notFoundPage
    : toAstro(html, route.file);
  fs.writeFileSync(route.file, output);
  console.log(`${route.file} <- ${route.url} (${variant})`);
}
