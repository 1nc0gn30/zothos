#!/usr/bin/env python3
import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE_CSV = ROOT / "output" / "new-business-listings-2026-jan-feb.csv"
TARGET_JSON = ROOT / "app" / "data" / "businesses-enriched.json"

CATEGORY_RULES = [
    {
        "category": "Beauty and Personal Care",
        "keywords": ["SPA", "SALON", "ESTHETIC", "LASH", "BROW", "BARBER", "HAIR", "NAIL", "SKIN", "MEDICAL AESTHETICS"],
        "pain_points": [
            "Needs online booking to reduce no-shows and back-and-forth scheduling",
            "Needs photo-first proof of work to convert social traffic into booked clients",
            "Needs automated review requests to build local trust quickly"
        ],
        "website_ideas": [
            "Service pages with transparent pricing and duration",
            "Integrated booking flow with SMS/email confirmations",
            "Before-and-after gallery with SEO-optimized local pages"
        ],
        "why": "Beauty clients compare quickly and usually book the first business with clear availability and proof of quality."
    },
    {
        "category": "Health and Wellness",
        "keywords": ["DENTAL", "ORTHODONT", "THERAPY", "PHYSICAL", "MASSAGE", "HEALTH", "MEDICAL", "SPEECH", "ENDODONTICS", "HOMECARE", "WELLNESS"],
        "pain_points": [
            "Needs clear patient education content to reduce repetitive phone questions",
            "Needs conversion-focused intake forms and insurance/payment guidance",
            "Needs HIPAA-conscious lead handling and secure contact flow"
        ],
        "website_ideas": [
            "Condition/service explainer pages in plain language",
            "Online intake and triage request forms",
            "Location pages with provider credentials and trust signals"
        ],
        "why": "Healthcare decisions are high-trust and research-heavy; a weak web presence lowers appointment conversions."
    },
    {
        "category": "Food and Beverage",
        "keywords": ["COFFEE", "CAFE", "BAKERY", "BAKESHOP", "BURGER", "PIZZA", "BREAD", "POTBELLY", "BEVERAGE", "RESTAURANT", "EAT", "SNACK"],
        "pain_points": [
            "Needs up-to-date menu and hours to avoid lost foot traffic",
            "Needs local search visibility for near-me intent",
            "Needs event/catering lead capture to diversify revenue"
        ],
        "website_ideas": [
            "Fast mobile menu and ordering links",
            "Google map and parking guidance block",
            "Catering/event inquiry funnel with package tiers"
        ],
        "why": "Food buyers decide quickly on mobile; outdated info directly causes lost daily sales."
    },
    {
        "category": "Home and Trade Services",
        "keywords": ["PLUMB", "ELECTRIC", "HVAC", "CONSTRUCTION", "RENOVATION", "REPAIR", "LANDSCAP", "ROOF", "PEST", "APPLIANCE", "PAINT", "EPOXY", "WATERPROOF"],
        "pain_points": [
            "Needs quote request funnel with job-type qualifiers",
            "Needs proof of reliability (licenses, insurance, project photos)",
            "Needs quick-response lead routing to avoid losing urgent jobs"
        ],
        "website_ideas": [
            "Service-area and emergency service pages",
            "Photo case studies with project cost ranges",
            "Lead form with job urgency and budget fields"
        ],
        "why": "Service buyers compare providers fast; professional web trust signals raise close rates and average ticket size."
    },
    {
        "category": "Retail and E-commerce",
        "keywords": ["SHOP", "BOUTIQUE", "JEWELRY", "CARDS", "GEMS", "PRINT", "SMOKE", "TACKLE", "SPORT", "MARKET", "STORE", "DROPSHIPPING"],
        "pain_points": [
            "Needs product discovery beyond social posts",
            "Needs inventory/offer visibility to reduce repetitive DMs",
            "Needs email capture and retention flows for repeat buyers"
        ],
        "website_ideas": [
            "Curated catalog with category landing pages",
            "Featured launches and bundle promotions",
            "Email/SMS opt-in with first-purchase incentive"
        ],
        "why": "Retail margins improve with repeat purchases and owned channels rather than only marketplace or social dependence."
    },
    {
        "category": "Professional and B2B Services",
        "keywords": ["CONSULT", "SOLUTIONS", "STRATEG", "ACCOUNT", "FINANCIAL", "BOOKKEEP", "APPRAIS", "AGENCY", "DIGITAL", "MARKETING", "MANAGEMENT", "TECH", "IT", "LEDGERS", "TAX"],
        "pain_points": [
            "Needs authority positioning to justify premium pricing",
            "Needs clear service packaging to shorten sales cycle",
            "Needs lead magnets and case studies for warmer inbound leads"
        ],
        "website_ideas": [
            "Outcome-focused service pages by client segment",
            "Case studies with quantified results",
            "Lead magnet funnel and consult-booking page"
        ],
        "why": "B2B buyers validate credibility online before booking calls; stronger positioning increases win rate and deal size."
    },
    {
        "category": "Real Estate and Property",
        "keywords": ["REAL ESTATE", "PROPERTY", "RENTAL", "HOUSING", "APARTMENT"],
        "pain_points": [
            "Needs listing/availability clarity to reduce unqualified inquiries",
            "Needs trust-building tenant or buyer information",
            "Needs follow-up automation for inquiry conversion"
        ],
        "website_ideas": [
            "Property pages with media, amenities, and FAQs",
            "Tenant/buyer qualification pre-forms",
            "Automated follow-up sequence for inquiries"
        ],
        "why": "Property decisions require detail and trust; a better web flow converts more inquiries into qualified appointments."
    },
    {
        "category": "Childcare and Education",
        "keywords": ["LEARNING", "ACADEMY", "SCHOOL", "CHILD", "TRAINING", "TUTOR", "YMCA"],
        "pain_points": [
            "Needs enrollment-ready program pages with schedules",
            "Needs parent trust signals and safety/process transparency",
            "Needs waitlist and tour request workflows"
        ],
        "website_ideas": [
            "Program comparison pages by age or skill level",
            "Tour booking and enrollment inquiry forms",
            "Parent FAQs with policy and schedule details"
        ],
        "why": "Parents and students compare options carefully; clear information and trust proof increases enrollment conversion."
    },
    {
        "category": "Automotive and Marine",
        "keywords": ["AUTO", "CAR", "MECHANIC", "GARAGE", "MOBILE MECHANIC", "MARINE"],
        "pain_points": [
            "Needs service menu clarity to reduce low-fit calls",
            "Needs local trust via reviews and turnaround-time visibility",
            "Needs fast quote/intake capture for urgent jobs"
        ],
        "website_ideas": [
            "Vehicle/service-type landing pages",
            "Instant request form with issue selector",
            "Trust section for warranties, certifications, and reviews"
        ],
        "why": "Repair customers are urgency-driven; the first credible business with clear service details often wins."
    },
    {
        "category": "Events and Creative",
        "keywords": ["EVENT", "PHOTO", "PHOTOGRAPHY", "MUSIC", "DJ", "BALLOON", "MAGAZINE", "STUDIO", "DESIGN", "CANDLE"],
        "pain_points": [
            "Needs portfolio storytelling to command higher rates",
            "Needs package clarity and add-on upsells",
            "Needs lead capture tied to event date and budget"
        ],
        "website_ideas": [
            "Portfolio and testimonial-led conversion pages",
            "Package matrix with optional upsells",
            "Event date availability checker and inquiry form"
        ],
        "why": "Creative buyers choose based on style match and trust; polished portfolios convert better than text-only listings."
    },
    {
        "category": "Personal and Local Services",
        "keywords": ["CLEAN", "COACH", "TRAVEL", "PET", "SITTER", "RENTAL", "HANDYMAN", "INTERPRET", "HOMECARE", "ASSIST", "CONCIERGE"],
        "pain_points": [
            "Needs service clarity and scope definition to avoid unqualified inquiries",
            "Needs fast local trust-building with reviews and proof points",
            "Needs simple booking or quote flow to convert interest quickly"
        ],
        "website_ideas": [
            "Service packages with clear outcomes and turnaround times",
            "Lead form with service type, location, and urgency",
            "Testimonial and FAQ section to handle common objections"
        ],
        "why": "Local service buyers often choose the clearest and most credible option first; a focused website improves conversion speed."
    },
    {
        "category": "Nonprofit and Community",
        "keywords": ["FOUNDATION", "NONPROFIT", "WATERWAYS", "CHARITY", "CHURCH"],
        "pain_points": [
            "Needs mission clarity and impact proof for supporters",
            "Needs volunteer/donation conversion flow",
            "Needs recurring communication channel ownership"
        ],
        "website_ideas": [
            "Impact pages with stories and metrics",
            "Volunteer onboarding and event signup",
            "Donation and newsletter growth funnels"
        ],
        "why": "Community organizations rely on trust and recurring support; a strong site raises participation and donation consistency."
    }
]

GENERIC_PROFILE = {
    "category": "General Local Business",
    "pain_points": [
        "Needs a clear first impression to establish legitimacy",
        "Needs lead capture instead of relying only on phone/social",
        "Needs local SEO footprint to appear for nearby buyers"
    ],
    "website_ideas": [
        "One-page conversion site with services and proof",
        "Simple contact and quote request workflow",
        "Google Business Profile integration and review funnel"
    ],
    "why": "Most local buyers search online before reaching out; businesses without a clear site lose trust and leads."
}

CATEGORY_PRIORITY = {
    "Health and Wellness": 84,
    "Home and Trade Services": 82,
    "Professional and B2B Services": 78,
    "Beauty and Personal Care": 77,
    "Automotive and Marine": 76,
    "Food and Beverage": 74,
    "Retail and E-commerce": 72,
    "Real Estate and Property": 72,
    "Childcare and Education": 71,
    "Events and Creative": 69,
    "Personal and Local Services": 68,
    "Nonprofit and Community": 65,
    "General Local Business": 60,
}


def normalize_text(row):
    return " ".join([
        row.get("owner_name", ""),
        row.get("trade_name", ""),
        row.get("address", ""),
    ]).upper()


def classify_business(row):
    txt = normalize_text(row)
    best = None
    best_hits = 0
    for rule in CATEGORY_RULES:
        hits = sum(1 for k in rule["keywords"] if k in txt)
        if hits > best_hits:
            best_hits = hits
            best = rule
    if best and best_hits > 0:
        confidence = min(95, 50 + best_hits * 12)
        profile = best
    else:
        confidence = 48
        profile = GENERIC_PROFILE

    score = CATEGORY_PRIORITY.get(profile["category"], 60)
    if row.get("city", "").upper() == "VIRGINIA BEACH":
        score += 4
    if row.get("telephone", "").startswith("757"):
        score += 3
    if "STE" in row.get("address", "") or "UNIT" in row.get("address", ""):
        score += 2
    score = max(35, min(100, score))

    return {
        "category": profile["category"],
        "confidence": confidence,
        "pain_points": profile["pain_points"],
        "website_ideas": profile["website_ideas"],
        "why_need_website": profile["why"],
        "lead_score": score,
    }


def main():
    if not SOURCE_CSV.exists():
        raise SystemExit(f"Missing source CSV: {SOURCE_CSV}")

    businesses = []
    with SOURCE_CSV.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=1):
            meta = classify_business(row)
            businesses.append({
                "id": i,
                "month": row["month"],
                "owner_name": row["owner_name"],
                "trade_name": row["trade_name"],
                "address": row["address"],
                "city": row["city"],
                "state": row["state"],
                "zip": row["zip"],
                "zip4": row["zip4"],
                "telephone": row["telephone"],
                "source_xlsx": row["source_xlsx"],
                "source_pdf": row["source_pdf"],
                **meta,
            })

    categories = Counter(item["category"] for item in businesses)
    months = Counter(item["month"] for item in businesses)
    cities = Counter(item["city"] for item in businesses)

    out = {
        "meta": {
            "title": "Virginia Beach New Business Listings Enriched Dataset",
            "source_page": "https://cor.virginiabeach.gov/businesses/new-business-listings",
            "generated_from": str(SOURCE_CSV.relative_to(ROOT)),
            "record_count": len(businesses),
            "months": dict(months),
            "top_categories": dict(categories.most_common(20)),
            "top_cities": dict(cities.most_common(20)),
        },
        "businesses": businesses,
    }

    TARGET_JSON.parent.mkdir(parents=True, exist_ok=True)
    TARGET_JSON.write_text(json.dumps(out, indent=2, ensure_ascii=True), encoding="utf-8")
    print(f"Wrote {TARGET_JSON} ({len(businesses)} records)")


if __name__ == "__main__":
    main()
