const FIXED_PACKAGES = [20, 40, 100] as const;

// Client-side fallback only.
// Real Stripe links should come from the Netlify Function.
const STRIPE_BASE_LINKS: Record<(typeof FIXED_PACKAGES)[number], string> = {
  20: '#',
  40: '#',
  100: '#',
};

/**
 * Generates the credit packages with the user ID appended 
 * as a client_reference_id for the webhook to track.
 */
export function getCreditPackages(userId?: string) {
  return FIXED_PACKAGES.map((amount) => {
    const baseHref = STRIPE_BASE_LINKS[amount];
    
    // Append the userId if it exists, otherwise return base link
    const href = userId 
      ? `${baseHref}?client_reference_id=${encodeURIComponent(userId)}`
      : baseHref;

    return {
      amount,
      href,
      isPlaceholder: !userId || baseHref === '#',
    };
  });
}
