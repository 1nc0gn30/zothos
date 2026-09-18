export const site = {
  name: "Elite Connect LLC",
  shortName: "Elite Connect",
  url: "https://eliteconnectva.com",
  phone: "804-445-9674",
  phoneHref: "tel:+18044459674",
  email: "eliteconnectva@gmail.com",
  emailHref: "mailto:eliteconnectva@gmail.com",
  location: "Virginia Beach, VA 23464",
  serviceArea: "Virginia Beach and Hampton Roads",
  facebook: "https://facebook.com/econnect23",
  license: "Virginia Class A Contractor",
  dcjs: "DCJS # 11-20830",
  logo: "/assets/brand/elite-connect-navbar-logo.png",
  logoDark: "/assets/brand/elite-connect-navbar-logo.png",
};

export const nav = [
  { label: "Services", href: "/services/" },
  { label: "Commercial", href: "/commercial/" },
  { label: "Residential", href: "/residential/" },
  { label: "Work", href: "/gallery/" },
  { label: "About", href: "/about-us/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

export const services = [
  {
    title: "CCTV / Video Monitoring",
    slug: "cctv-video-monitoring",
    image: "/assets/service/cctv.jpeg",
    summary: "Camera systems, remote viewing, alerts, and placement planning.",
    points: ["IP cameras", "Doorbell cameras", "Remote access", "Motion alerts"],
  },
  {
    title: "Alarm Systems",
    slug: "alarm-systems",
    image: "/assets/service/alarm-systems.png",
    summary: "Intrusion alarm planning, panel setup, monitoring options.",
    points: ["Intrusion detection", "Smart panels", "Monitoring options", "Clean installation"],
  },
  {
    title: "Access Control",
    slug: "access-control",
    image: "/assets/service/access-control.png",
    summary: "Door access systems for employees, vendors, and entry points.",
    points: ["Card and fob access", "Keypads", "Door hardware", "Business security"],
  },
  {
    title: "Structured Cabling",
    slug: "structured-cabling",
    image: "/assets/service/structured-cabling.png",
    summary: "Data, voice, copper, fiber, racks, drops, and labeled infrastructure.",
    points: ["Data cabling", "Voice cabling", "Fiber and copper", "Racks and panels"],
  },
  {
    title: "Audio / Visual",
    slug: "audio-visual",
    image: "/assets/service/audio-visual.png",
    summary: "Displays, sound, meeting spaces, and integrated AV.",
    points: ["Displays", "Sound systems", "Meeting rooms", "Integrated controls"],
  },
  {
    title: "MSP / Managed IT",
    slug: "msp-managed-it",
    image: "/assets/service/msp.png",
    summary: "Managed technology support for networks, systems, and service.",
    points: ["Network support", "Security support", "Recurring service", "Business continuity"],
  },
  {
    title: "VoIP / Communications",
    slug: "voip-communications",
    image: "/assets/service/voip.jpg",
    summary: "Business phone, VoIP readiness, voice cabling, and communications planning.",
    points: ["VoIP planning", "Voice cabling", "Phone systems", "Communications support"],
  },
  {
    title: "Network & WiFi Solutions",
    slug: "network-wifi-solutions",
    image: "/assets/service/network-wifi.jpg",
    summary: "Network design, WiFi coverage planning, and wireless infrastructure for homes and businesses.",
    points: ["WiFi coverage", "Network design", "Mesh systems", "Enterprise wireless"],
  },
  {
    title: "Smart Home Integration",
    slug: "smart-home-integration",
    image: "/assets/service/smart-home.jpg",
    summary: "Smart locks, lighting, climate control, and unified home automation systems.",
    points: ["Smart locks", "Lighting control", "Climate automation", "Unified control"],
  },
];

export const faqs = [
  {
    question: "Do you work with both homes and businesses?",
    answer: "Yes. Elite Connect supports homeowners, commercial properties, offices, retail spaces, warehouses, contractors, and small businesses across Virginia Beach and Hampton Roads.",
  },
  {
    question: "Can you install cameras, alarms, and access control together?",
    answer: "Yes. Many projects combine cameras, alarms, access control, cabling, and network planning so the system works as one practical solution.",
  },
  {
    question: "Do you offer monitoring or subscription services?",
    answer: "Elite Connect can discuss monitoring and recurring service options for alarm and managed technology needs. Exact plans should be confirmed during consultation.",
  },
  {
    question: "Can you help with structured cabling for a new office or buildout?",
    answer: "Yes. Elite Connect handles structured cabling, data drops, voice cabling, racks, panels, and clean labeling for new spaces and retrofit projects.",
  },
  {
    question: "What should I prepare before requesting a consultation?",
    answer: "Share the property type, project location, service needs, urgency, and any existing systems. Photos or floor plans help but are not required for the first conversation.",
  },
  {
    question: "Is the DCJS number required on the website?",
    answer: "Yes. Elite Connect keeps its DCJS number visible: DCJS # 11-20830.",
  },
];

export const gallery = [
  { src: "/assets/gallery/camera-installation.jpg", alt: "Technician installing an outdoor security camera", category: "CCTV" },
  { src: "/assets/gallery/commercial-cabling-ceiling.jpg", alt: "Low-voltage cabling in a commercial workspace", category: "Cabling" },
  { src: "/assets/gallery/commercial-cable-runs.jpg", alt: "Organized low-voltage cable runs", category: "Cabling" },
  { src: "/assets/gallery/commercial-server-racks.jpg", alt: "Commercial server rack setup", category: "MSP" },
  { src: "/assets/gallery/convenience-store-security-1.jpg", alt: "Security cameras in a convenience store", category: "Commercial" },
  { src: "/assets/gallery/residential-outdoor-work.jpg", alt: "Technician working on low-voltage wiring", category: "Residential" },
  { src: "/assets/gallery/residential-tv-install.jpg", alt: "TV mounting in a residential living room", category: "AV" },
  { src: "/assets/gallery/doorbell-camera.jpg", alt: "Smart doorbell camera at a front door", category: "CCTV" },
  { src: "/assets/gallery/porch-security-camera.jpg", alt: "Security camera monitoring a porch", category: "CCTV" },
  { src: "/assets/gallery/client-consultation.jpg", alt: "In-person consultation with clients", category: "Process" },
  { src: "/assets/gallery/home-automation-setup.jpg", alt: "Home automation control setup", category: "AV" },

  { src: "/assets/gallery/conduit-cable-routing.webp", alt: "Organized conduit cable routing and firestop sealing in a commercial build", category: "Cabling" },
  { src: "/assets/gallery/residential-sticker-install.webp", alt: "Elite Connect technician installing equipment outside a residential home", category: "Residential" },
  { src: "/assets/gallery/convenience-store-security-install.webp", alt: "Security camera installation inside a convenience store", category: "Commercial" },
  { src: "/assets/gallery/employee-laying-low-voltage.webp", alt: "Technician laying low-voltage cable bundle on a commercial job site", category: "Cabling" },
];

export const locations = [
  "Virginia Beach", "Norfolk", "Chesapeake", "Suffolk", "Portsmouth",
  "Hampton", "Newport News", "Williamsburg", "Poquoson", "York County",
  "Isle of Wight", "Currituck",
];
