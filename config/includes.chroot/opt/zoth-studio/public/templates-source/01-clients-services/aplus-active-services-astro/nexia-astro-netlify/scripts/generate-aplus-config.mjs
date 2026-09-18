import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function env(name, fallback) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : fallback;
}

function person(prefix, fallback) {
  return {
    name: env(`${prefix}_NAME`, fallback.name),
    role: env(`${prefix}_ROLE`, fallback.role),
    imageUrl: env(`${prefix}_IMAGE_URL`, ''),
    calendarUrl: env(`${prefix}_CALENDAR_URL`, env('APLUS_CALENDAR_URL', 'https://cal.com/REPLACE_APLUS_ACTIVE')),
  };
}

const config = {
  collectiveStripeUrl: env('APLUS_COLLECTIVE_STRIPE_URL', 'https://buy.stripe.com/REPLACE_COLLECTIVE_197'),
  retainerStripeUrl: env('APLUS_RETAINER_STRIPE_URL', 'https://buy.stripe.com/REPLACE_FACTORY_RETAINER_3000_QTR'),
  substackUrl: env('APLUS_SUBSTACK_URL', 'https://sweetscience.substack.com/'),
  calendarUrl: env('APLUS_CALENDAR_URL', 'https://cal.com/REPLACE_APLUS_ACTIVE'),
  inboundUrl: env('APLUS_INBOUND_URL', 'mailto:hello@aplusactive.com?subject=How%20we%20built%20this'),
  podcastGuestLaunchUrl: env('APLUS_PODCAST_GUEST_LAUNCH_URL', 'https://www.podcastguestlaunch.com/'),
  primaryOffer: env('APLUS_PRIMARY_OFFER', 'Healthcare Hackathon Heroes'),
  primaryPrice: env('APLUS_PRIMARY_PRICE', '$197'),
  retainerPrice: env('APLUS_RETAINER_PRICE', '$3K/quarter'),
  retainerOffer: env('APLUS_RETAINER_OFFER', 'Healthcare Software Factory'),
  trio: [
    person('APLUS_TRIO_JAI', {
      name: 'Jai',
      role: 'Compound and natural intelligence',
    }),
    person('APLUS_TRIO_KHIZAR', {
      name: 'Khizar',
      role: 'Middle-office automation',
    }),
    person('APLUS_TRIO_ANTHONY', {
      name: 'Anthony',
      role: 'Back-office and offer launch',
    }),
  ],
};

const output = `window.APLUS_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'public/aplus-config.js'), output);

const placeholders = output.match(/REPLACE_[A-Z0-9_]+/g) || [];
console.log(JSON.stringify({
  wrote: 'public/aplus-config.js',
  placeholders: [...new Set(placeholders)],
}, null, 2));
