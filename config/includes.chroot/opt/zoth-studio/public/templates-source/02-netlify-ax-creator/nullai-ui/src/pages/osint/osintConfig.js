import UsernameLookup from './tools/UsernameLookup'
import EmailLookup from './tools/EmailLookup'
import DomainLookup from './tools/DomainLookup'
import IpLookup from './tools/IpLookup'
import HeaderLookup from './tools/HeaderLookup'
import HexStrikePage from './tools/hexstrike/HexStrikePage'
import HoleheLookup from './tools/HoleheLookup'


export const OSINT_TOOLS = [
  // --------------------------------------------------
  // BASIC OSINT (FAST, LIGHTWEIGHT, NON-INTRUSIVE)
  // --------------------------------------------------
  {
    id: 'username',
    label: 'Username Intelligence',
    description:
      'Cross-platform username presence checks across major social and developer platforms.',
    component: UsernameLookup,
    tier: 'free',
    category: 'basic',
    level: 'Beginner',
    badge: 'OSINT',
  },

  {
    id: 'email',
    label: 'Email Intelligence',
    description:
      'Email footprint analysis including MX records, provider detection, and public exposure signals.',
    component: EmailLookup,
    tier: 'free',
    category: 'basic',
    level: 'Beginner',
    badge: 'OSINT',
  },

  {
    id: 'domain',
    label: 'Domain Intelligence',
    description:
      'Domain reconnaissance including DNS records, metadata, hosting surface, and infrastructure hints.',
    component: DomainLookup,
    tier: 'standard',
    category: 'basic',
    level: 'Intermediate',
    badge: 'OSINT',
  },

  {
    id: 'ip',
    label: 'IP Intelligence',
    description:
      'IP address intelligence covering ASN ownership, geolocation, reverse DNS, and network context.',
    component: IpLookup,
    tier: 'standard',
    category: 'basic',
    level: 'Intermediate',
    badge: 'OSINT',
  },

  {
    id: 'headers',
    label: 'HTTP Header Analysis',
    description:
      'Inspection of HTTP response headers for server stack, CDN usage, and security misconfigurations.',
    component: HeaderLookup,
    tier: 'standard',
    category: 'basic',
    level: 'Intermediate',
    badge: 'OSINT',
  },
  {
  id: 'holehe',
  label: 'Email Breach & Account Discovery',
  description:
    'Passive email footprinting across 120+ platforms to detect where an email is registered. Uses the Holehe engine with live verification.',
  component: HoleheLookup,
  tier: 'standard',
  category: 'advanced',
  level: 'Advanced',
  badge: 'OSINT · EMAIL',
},


  // --------------------------------------------------
  // ADVANCED / AI-INTEGRATED
  // --------------------------------------------------
  {
    id: 'hexstrike',
    label: 'HexStrike AI',
    description:
      'Advanced AI-integrated reconnaissance and security tooling. Executes real security tools with intelligent presets, decision logic, and controlled automation.',
    component: HexStrikePage,
    tier: 'standard', // or 'pro' later
    category: 'advanced',
    level: 'Advanced',
    badge: 'AI · SECURITY',
    experimental: true,
  },
]