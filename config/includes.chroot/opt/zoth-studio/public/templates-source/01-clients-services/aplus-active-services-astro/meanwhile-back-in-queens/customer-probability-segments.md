# Meanwhile Back in Queens — Customer Probability Segments

Date: 2026-06-13
Derived live from Shopify data on 2026-06-12.

## Why Probability, Not Personas

Drop-based commerce produces a long-tail spend distribution. Naming demographic personas hides the part of the business that matters most: the small cohort of very-high-spend buyers. So we segment by spend percentile.

The framing Jai used in the room (and it is the right one): probability is not intuitive. If you have a 5% chance per attempt, it takes ~80 attempts for a ~95-99% chance, not 20. Customer value is the same — the average buyer and the long-tail buyer are different businesses, and you have to look at the tail deliberately or you never see it.

## The Three Segments

### p50 — The Average / Single-Drop Buyer
- Buys one item in a drop because it's *them*.
- Highest volume, lowest spend.
- **Job:** convert efficiently from local social; make the accessible hero item obvious.
- **ROI driver:** identity signal + accessibility.

### p95 — The Power User
- Joins the waitlist in advance, co-promotes, tells friends, buys across drops.
- **Job:** waitlist mechanics, early access, UGC, collectible framing.
- **ROI driver:** belonging + collectibility.

### p99 — The High-Taste / Institutional Buyer
- **Observed spend: $500-$2,300.** Often has taste and works inside a brand with budget; the customer who can pull Meanwhile Back in Queens into a paid collaboration (the Coca-Cola-marketer / Uber-commercial archetype).
- **25 of these surfaced with names + phone numbers in-session.**
- **Job:** call them. Build a dedicated p99 campaign. Numbered / capped artifacts. Direct relationship.
- **ROI driver:** identity + access + leverage.

## Validation Discipline

Do not trust the p99 LTV on the model's word. The correct move (and the one queued in-session):

> "Show me the receipts on the observed LTV. I don't believe you for p99 — source me their exact names and last purchase date."

Then call them. A cohort spending $500-$2,300 with phone numbers is a relationship business, not an analytics row.

## Activation Plan Per Segment

| Segment | Campaign | Content | First Action |
|---|---|---|---|
| p99 | Dedicated high-taste / collaboration campaign | Numbered, capped, behind-the-scenes | Call the 25 surfaced names; R&D interviews for next drop |
| p95 | Waitlist + early access | UGC, co-promotion, "founding fan" framing | Build waitlist email flow (no flow exists today) |
| p50 | Broad drop launch | Fan UGC from p95/p99 carries them in | Accessible hero item + local social |

## Connection To R&D

The segmentation matched an R&D idea Imtiaz already had: **neighborhood caps** (neighborhood-specific, capped editions). The p99/p95 collectibility driver and the neighborhood-cap product idea are the same insight from two directions. Use the p99 call list as the interview pool for which neighborhoods to cap first.

## Open Data Questions

- Map each spike to the drop and the content that preceded it.
- Compare p99 carts to pre-spike content.
- How do p99s differ from each other (taste, geography, brand affiliation)?
- Which neighborhoods over-index → which caps to make first.

## Caveat

The HTML dashboards prototyped in-session (segment economics, gap vector, ROI lab, time-series) are read surfaces for *chatting with the data*, not a reactive BI product. Dropdowns appeared interactive but did not recompute. Treat them as exploration, and validate any number that triggers an action.
