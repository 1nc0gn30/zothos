import { serviceAreas, services, site } from "./site.js";

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${site.url}/#business`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    logo: `${site.url}/images/brand/logo.webp`,
    image: `${site.url}/images/brand/logo.webp`,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.2947",
      longitude: "-82.9840"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00"
      }
    ],
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area.h1.replace("Fence Installation in ", "").replace(", FL", "").replace("Fence Installation Serving the ", "")
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fencing Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.h1,
          url: `${site.url}/services/${service.slug}`
        }
      }))
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "50",
      bestRating: "5",
      worstRating: "1"
    },
    sameAs: site.socials
  };
}

export function faqSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };
}
