# A+ Active Screen Inventory

Last updated: 2026-06-28

## Standard

- Webflow-derived routes must preserve the original screen structure, classes, image grids, related sections, and animation hooks while replacing copy, links, and offer framing for A+ Active Services.
- Custom A+ routes may use `AplusPage` when there is no source Webflow screen or when the page is an intentionally new offer/wiki surface.
- Every screen should route the visitor toward at least one of: Healthcare Hackathon Heroes, weekly masterclass/office hours, Healthcare Heroes newsletter, AI Practice Audit, or Healthcare Software Factory.

## Full Webflow-Preserved Screens

These routes are generated from the matching `https://nexia-agency.webflow.io` URL through `toAstro(...)` and must not be replaced by simplified card pages.

| A+ route | Source route | Required preserved structure |
| --- | --- | --- |
| `/` | `/` | Webflow home clone plus A+ offer panel |
| `/about` | `/about` | Webflow about clone plus A+ offer panel |
| `/projects` | `/projects` | `projects-hero`, `collection-list showcase`, project cards |
| `/blog` | `/blog` | `blog-hero`, `blog-list-wrapper`, insight cards |
| `/pricing` | `/pricing` | Webflow pricing/offer ladder layout |
| `/contact` | `/contact` | Webflow contact/office-hours layout |
| `/projects/anantaraya` | `/projects/anantaraya` | `project-single`, `project-banner`, related projects |
| `/projects/aureva` | `/projects/aureva` | `project-single`, `project-banner`, related projects |
| `/projects/legolas` | `/projects/legolas` | `project-single`, `project-banner`, related projects |
| `/projects/morph` | `/projects/morph` | `project-single`, `project-banner`, related projects |
| `/projects/steelcrest` | `/projects/steelcrest` | `project-single`, `project-banner`, related projects |
| `/blog-posts/why-strong-branding-matters-in-the-digital-era` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/the-role-of-user-experience-in-conversion-rates` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/harnessing-social-media-for-brand-awareness` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/the-importance-of-mobile-optimization` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/innovative-branding-strategies-for-startups` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/leveraging-social-media-for-brand-awareness` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/the-impact-of-consistent-messaging-across-platforms` | same | `blog-banner`, `blog-details`, related blogs |
| `/blog-posts/the-role-of-user-experience-in-brand-loyalty` | same | `blog-banner`, `blog-details`, related blogs |

## Custom A+ Screens

These routes are intentionally custom because they are new offer/wiki/product surfaces or compatibility utilities.

| A+ route | Job |
| --- | --- |
| `/checkout` | DIY/DWY/DFY buying decision across newsletter, community, calendar, booking, and Healthcare Software Factory |
| `/product/starter-plan` | Healthcare Hackathon Heroes membership |
| `/product/growth-plan` | Healthcare Software Factory quarterly retainer |
| `/masterclass` | Means, motivation, opportunity and weekly event front door |
| `/healthcare-engineers` | Category ownership for Healthcare Engineers |
| `/wiki` | Healthcare wiki entry |
| `/wiki/workflow` | Discovery hierarchy and workflow audit model |
| `/wiki/ui` | Metacognition steering and healthcare UI model |
| `/wiki/managed-service` | DWY/DFY managed-service operating model |
| `/wiki/custom-cluster` | Integration boundaries and last-mile custom build model |
| `/case-studies/pneumonia-discharge-memory` | Custom healthcare case study |
| `/case-studies/phi-scrubber` | Custom PHI scrubber case study |
| `/resources` | Newsletter/resources/acquisition flywheel |
| `/information-pages/style-guide` | Compatibility utility route |
| `/information-pages/license` | Compatibility utility route |
| `/information-pages/changelog` | Compatibility utility route |
| `/401` | Private-access compatibility route |
| `/404` | Fallback compatibility route |

## Verification

- `scripts/verify-aplus.mjs` checks all 37 built pages for A+ offer language and route-specific content.
- `scripts/verify-aplus.mjs` also checks preserved Webflow structure on `/projects`, `/blog`, project detail routes, and blog-post routes.
- `scripts/verify-aplus-browser.mjs` checks representative routes on desktop and mobile, including the previously failed `/projects`, `/blog`, and `/blog-posts/why-strong-branding-matters-in-the-digital-era` route family.
- `scripts/verify-routes.mjs` checks public production reachability for all expected public routes.
