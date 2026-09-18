const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

import { getStore } from '@netlify/blobs';

const BASE_CREATORS = [
  {
    id: 'maya',
    handle: '@buildwithmaya',
    xHandle: 'buildwithmaya',
    status: 'verified',
    name: 'Maya',
    emoji: '🐼',
    avatar: "/creators/maya/avatar.jpg",
    banner: "/creators/maya/banner.jpg",
    followers: 1774,
    followersStr: '1.8K+',
    bio: 'just me, my laptop, and ideas\ndesigning + building + 9 to 5\nSharing lessons to help you build faster',
    products: [
      { name: 'IdeaPanda', url: 'https://getideapanda.com', description: 'Validated idea discovery tool' },
      { name: 'Newbie Marketer', url: 'https://newbiemarketer.to', description: 'Newsletter on distribution & marketing for builders' },
    ],
    pillars: [
      "9-5 side builder — locked in after work, shipping anyway",
      "Founder lessons — binge stories then synthesize the principles",
      "Distribution over vanity — post relentlessly, own your audience"
    ],
    milestones: [
      { label: 'Followers', value: '1,638+' },
      { label: 'Posts', value: '4,889' },
      { label: 'Products', value: '2' },
      { label: 'Newsletter', value: 'Issue #2' },
    ],
    media: ["/creators/maya/media-1.jpg", "/creators/maya/media-2.jpg"],
    category: 'indie-hackers',
    theme: { primary: '#ec4899', secondary: '#8b5cf6', accent: '#22d3ee' },
    plays: [
      {
        "id": "maya-volume",
        "emoji": "⚡",
        "title": "Volume + speed",
        "description": "Post relentlessly to test hooks, angles, and messaging. Content creates demand before the product exists. Three posts a day helps you find winning formats quickly. The market will tell you what resonates.",
        "action": "Post three times today testing different hooks. One short update, one lesson or reminder, one question or insight.",
        "frequency": "Daily"
      },
      {
        "id": "maya-owned",
        "emoji": "📬",
        "title": "Own your distribution",
        "description": "X is rented land. Build a newsletter (like NewbieMarketer.to) so your audience survives algorithm changes. Distribution is the moat that separates winners.",
        "action": "Add a newsletter signup link to your profile, landing page or pinned post this week. Share one distribution lesson publicly.",
        "frequency": "Weekly"
      },
      {
        "id": "maya-synth",
        "emoji": "🧠",
        "title": "Synthesize founder lessons",
        "description": "When X is slow, binge high-signal founder content like Starter Story videos. Extract common themes and principles from those making real money. Turn it into a valuable numbered thread.",
        "action": "Watch or read 3-5 founder stories this week. Identify 5-8 shared principles. Write and post a detailed numbered thread sharing the synthesized lessons.",
        "frequency": "Weekly"
      },
      {
        "id": "maya-waves",
        "emoji": "🌊",
        "title": "Ride the X growth waves",
        "description": "X growth happens in waves. Go all out when momentum is high. Lay low and deep build when the algo is quiet. Focus posting energy on strong periods.",
        "action": "Track engagement for 7 days. On high-momentum days post 3x and engage heavily. On slow days focus on building and ship 1 high-quality update.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "reminder to self: some of the most successful founders I have seen on here have < 1000 followers",
      "i'm convinced x growth happens in waves",
      "post 9-5 getting locked in 🔒",
      "Distribution is the moat",
      "Speed is the solo founder's edge"
    ],
    angles: [
      "Personal reminder or observation that turns into universal builder advice",
      "Deep synthesis: binge real founder stories then extract and number the patterns",
      "Anti-vanity: celebrate low follower success and smart timing over constant output",
      "Practical frameworks over fluff — sell before build, one core action, portfolio of bets",
      "9-5 realism: disciplined side building while teaching what you learn"
    ],
    tags: ['buildinpublic', 'indiehackers', 'startups', 'solopreneur', 'marketing', 'product'],
  },
  {
    id: 'kp',
    handle: '@thisiskp_',
    xHandle: 'thisiskp_',
    status: 'verified',
    name: 'KP',
    emoji: '📡',
    avatar: "/creators/kp/avatar.jpg",
    banner: "/creators/kp/banner.jpg",
    followers: 70600,
    followersStr: '70.6K',
    bio: 'The "Build In Public" Guy. Head of Community at @Netlify. Vibe Coder. Prev: @PaddleHQ @joinODF',
    products: [
      { name: 'AI Shippers Cohort', url: 'https://aishippers.netlify.app', description: 'Invite-only cohort for high-caliber Netlify builders' },
      { name: 'Netlify Community', url: 'https://netlify.com', description: 'Platform empowering builders to push ideas to the world' },
    ],
    pillars: [
      "Build-in-Public Shipping",
      "Netlify Community Amplification",
      "Curiosity-Driven Thought Leadership",
      "Vibe Coding & Creative Reactions"
    ],
    milestones: [
      { label: 'Followers', value: '70.4K' },
      { label: 'Posts', value: '48.5K' },
      { label: 'Role', value: 'Head of Community @Netlify' },
      { label: 'Cohort', value: 'AI Shippers' },
    ],
    media: ["/creators/kp/media-1.jpg"],
    category: 'big-players',
    theme: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' },
    plays: [
      {
        "id": "kp-1",
        "emoji": "📦",
        "title": "Just Shipped Demos",
        "description": "Announce newly completed apps and tools using the signature 'Just shipped:' opener. Include a short description of what it does, the live link, and credit to Netlify tools (especially Agent Runners) to demonstrate speed and platform power.",
        "action": "1. Finish and deploy a small real project (AI tool, interactive site, etc.) on Netlify.\n2. Capture 1-2 screenshots or a short demo video.\n3. Post starting exactly with \"Just shipped: [Project Name]\".\n4. Add one clear sentence on what it does and who it's for.\n5. Paste the live URL.\n6. End with \"Built by @Netlify Agent Runners\" or the specific stack note.\n7. Engage with the first replies.",
        "frequency": "Weekly"
      },
      {
        "id": "kp-2",
        "emoji": "🌟",
        "title": "Community Milestone Amplifier",
        "description": "Celebrate Netlify community program progress with specific numbers, excitement, and direct links to showcases. Turn program updates into FOMO and belonging that drives more submissions and positions you as the connector.",
        "action": "1. Track active Netlify community programs (e.g. Hot AR Summer) and their key milestones.\n2. When numbers are compelling, post an upbeat update: \"Guess what? We are nearing 50 app submissions (currently 47!) at @Netlify Hot AR Summer\".\n3. Add positive framing: \"So many wonderful ideas.. check out the showcase 👇🏼\".\n4. Include the direct showcase URL.\n5. Tag @Netlify and invite people to participate.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "kp-3",
        "emoji": "⚡",
        "title": "Vibe Code & Themed Prototypes",
        "description": "Rapidly build fun, timely, or creative experiences using Netlify Agent Runners and share them with clear engagement hooks (trivia challenges, AI demos, holiday tie-ins) to show how fast anyone can ship.",
        "action": "1. Pick a timely theme (holiday, event, trend, or fun challenge).\n2. Use Netlify Agent Runners to generate a complete functional web app from scratch.\n3. Add one interactive hook (trivia with high-score challenge, photo AI classifier, etc.).\n4. Deploy to Netlify.\n5. Post with contextual opener: \"Happy 4th of July 🇺🇸 To celebrate..., I built a new site using @Netlify... Check it out & challenge yourself to beat the highest score\".\n6. Share the URL.",
        "frequency": "Monthly"
      },
      {
        "id": "kp-4",
        "emoji": "🧠",
        "title": "Sticky Idea Reflections",
        "description": "Read high-signal essays, extract one idea that sticks, and share a personal, builder-focused breakdown. The curiosity-over-discipline post from Paul Graham performed strongly and fits your voice perfectly.",
        "action": "1. Read one strong essay (Paul Graham or equivalent).\n2. Identify the single idea that \"has been stuck in my head ever since.\"\n3. Open the post by naming the source + the core idea.\n4. Explain it in plain language, then share your personal realization and story.\n5. Translate to a clear takeaway for makers (e.g. curiosity beats forced discipline; follow what keeps pulling you).\n6. Credit the source at the end.\n7. Post as a longer single update or short thread when it feels authentic.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "Just shipped: ",
      "Guess what?",
      "Wow who did this art work for Anthropic?!!!",
      "I recently read @paulg's essay, “How to Do Great Work”, and one idea has been stuck in my head ever since.",
      "The \"Build In Public\" Guy."
    ],
    angles: [
      "The Build In Public Guy who actually ships Netlify + AI demos in public",
      "Netlify's community face who makes programs feel exciting by highlighting real submissions and wins",
      "Curiosity-first thinker who turns essays into practical maker advice instead of grind culture",
      "Vibe coder who balances serious tool demos with fun, timely, interactive experiments",
      "Authentic reactor who mixes quick design/art appreciation with deeper reflections for reach and personality"
    ],
    tags: ['buildinpublic', 'netlify', 'ai-shipper', 'vibecoding', 'community', 'startups'],
  },
  {
    id: 'gerrit',
    handle: '@halfmage',
    xHandle: 'halfmage',
    status: 'verified',
    name: 'Gerrit Halfmann',
    emoji: '🇵🇱',
    avatar: "/creators/gerrit/avatar.jpg",
    banner: "/creators/gerrit/banner.jpg",
    followers: 1114,
    followersStr: '1.1K',
    bio: 'Solo dev shipping small software with big dreams:\n👾 pixelarticons.com\n👑 majesticons.com\n🍌 qrcodebanana.com',
    products: [
      { name: 'Pixelarticons', url: 'https://pixelarticons.com', description: 'Pixel-art icon library' },
      { name: 'Majesticons', url: 'https://majesticons.com', description: 'Premium icon library' },
      { name: 'QR Code Banana', url: 'https://qrcodebanana.com', description: 'Simple QR code generator' },
    ],
    pillars: [
      "Deliberately pixelated and premium icon libraries",
      "Public updates showing products growing and maturing",
      "Career-rooted product launches and expansions",
      "Community co-creation through direct feedback asks"
    ],
    milestones: [
      { label: 'Followers', value: '1,112' },
      { label: 'Posts', value: '3,624' },
      { label: 'Products', value: '4' },
      { label: 'Client SEO', value: '3.2M impressions' },
    ],
    media: ["/creators/gerrit/media-1.jpg", "/creators/gerrit/media-2.jpg", "/creators/gerrit/media-3.jpg", "/creators/gerrit/media-4.jpg", "/creators/gerrit/media-5.jpg", "/creators/gerrit/media-6.png"],
    category: 'netlify-shippers',
    theme: { primary: '#64748b', secondary: '#10b981', accent: '#38bdf8' },
    plays: [
      {
        "id": "gerrit-multi",
        "emoji": "🛍️",
        "title": "Build a product portfolio",
        "description": "Multiple small products diversify reach and income. Icon libraries (pixelarticons + majesticons) plus new adjacent tools like shadcn travel components cross-promote and keep skills sharp.",
        "action": "List your current icon libraries and pick one adjacent idea (e.g. specialized UI components for a niche you know). Start a simple first version this month.",
        "frequency": "Monthly"
      },
      {
        "id": "gerrit-icons",
        "emoji": "🎨",
        "title": "Free icon assets drive distribution",
        "description": "The free deliberately pixelated icons (pixelarticons) and public updates build awareness, backlinks, and authority that feed premium majesticons and future products.",
        "action": "Update or expand your free pixelarticons set (add icons or announce colored mode) and post about the release or preview.",
        "frequency": "Quarterly"
      },
      {
        "id": "gerrit-progress",
        "emoji": "📈",
        "title": "Share product progress snapshots",
        "description": "Short, visual, low-text updates like '⭐️ majesticons ~ growing and maturing' or 'travelcn is taking shape ❤️' keep the audience following the journey and create anticipation.",
        "action": "Screenshot or photo your current work-in-progress on one product. Post a 1-line status update with a relevant emoji and no long explanation.",
        "frequency": "Weekly"
      },
      {
        "id": "gerrit-ask",
        "emoji": "🧳",
        "title": "Roots story + community ask",
        "description": "Share a short personal backstory from past work that directly motivates the new project, then ask the audience a specific question to gather ideas and build engagement.",
        "action": "Tweet: connect a past job/experience (e.g. 'back in the days I worked a lot for travel agencies') to what you're building now, say why it feels good, and ask 'Anything you really hate about [domain] that we can fix all together?'",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "you wanna be right or you wanna be rich?",
      "⭐️ majesticons ~ growing and maturing",
      "travelcn is taking shape ❤️",
      "#pixelart icons colored mode is coming this YEAR",
      "Anything you really hate about travel websites that we can fix all together?"
    ],
    angles: [
      "Deliberate pixel art as a strong, intentional aesthetic choice for modern interfaces",
      "Public maturation: celebrate products growing and improving over time instead of only launches",
      "Authentic roots: use real past career experience as the genuine reason for new products",
      "Direct negative asks: 'what do you hate' uncovers sharp product opportunities and invites co-creation",
      "Time-bound teases: specific promises like 'this YEAR' create accountability and follower excitement"
    ],
    tags: ['solodev', 'astro', 'tailwind', 'netlify', 'seo', 'designsystems', 'ai-shipper'],
  },
  {
    id: 'lynnzeng',
    handle: '@zeng_wt',
    xHandle: 'zeng_wt',
    status: 'verified',
    name: 'Lynn Zeng',
    emoji: '🇲🇾',
    avatar: "/creators/lynnzeng/avatar.png",
    banner: "/creators/lynnzeng/banner.jpg",
    followers: 6568,
    followersStr: '6.6K',
    bio: 'AI Creative, Film Maker, AI Artist | picaisso.xyz | picaisso.substack.com | newmom.help | DM for projects and partnerships 💜☕',
    products: [
      { name: 'PicAisso', url: 'https://picaisso.xyz', description: 'AI image creation platform' },
      { name: 'PicAisso Substack', url: 'https://picaisso.substack.com', description: 'AI creative newsletter and tutorials' },
      { name: 'NewMom Help', url: 'https://newmom.help', description: 'Resource for new mothers' },
    ],
    pillars: [
      "Deep test emerging AI models and break down what makes them useful for film, editorial and design",
      "Share full prompts and workflows generously so others can follow along and remix",
      "Start from personal passion or memory and use AI to turn it into shareable branded work",
      "Craft poetic, high-taste visuals and short films that feel designed with intention"
    ],
    milestones: [
      { label: 'Followers', value: '6,529' },
      { label: 'Posts', value: '46.6K' },
      { label: 'Products', value: '3' },
      { label: 'YouTube', value: '61 subs' },
    ],
    media: ["/creators/lynnzeng/media-1.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#f43f5e', secondary: '#fb923c', accent: '#fb7185' },
    plays: [
      {
        "id": "lynnzeng-prompt",
        "emoji": "💬",
        "title": "Share complete prompts",
        "description": "Post the AI output and paste the exact prompt (including constraints like 'no questions, just the restored video') so followers can instantly try it themselves.",
        "action": "Create or restore one piece of AI media. In the post or reply, share the full prompt verbatim. Mention the tool and any special settings used. Tag relevant creators.",
        "frequency": "Weekly"
      },
      {
        "id": "lynnzeng-motion",
        "emoji": "🎥",
        "title": "Ship short AI motion clips",
        "description": "Use video models like Seedance to produce thematic, high-quality short clips. Pair with minimal, evocative captions that sell the mood first.",
        "action": "Generate a 10-30s AI video around a simple concept (e.g. 'Under the sea'). Post with a poetic one-liner title, the tool name, and a hashtag. Attach the video.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "lynnzeng-experiment",
        "emoji": "🧪",
        "title": "Run and document AI tool experiments",
        "description": "Thoroughly test new models. Call out standout features like precise editing, 100% subject consistency, design intent understanding, and list real use cases (fashion, film, editorial).",
        "action": "Select a new model or feature. Run a deliberate test (e.g. precise portrait edit or typography on generated art). Write a post listing 3 specific things that impressed you, practical applications, and end with a question to the audience.",
        "frequency": "Weekly"
      },
      {
        "id": "lynnzeng-story",
        "emoji": "🌸",
        "title": "Turn personal stories into branded AI threads",
        "description": "Anchor in authentic personal detail (childhood flower love, garden). Use one focused AI session to create a brand, then thread the exact process with disclosure for trust and engagement.",
        "action": "Pick one personal object or memory. Spend one chat in an AI tool (like Adobe Firefly) in one session to concept a brand from it. Post the story hook + reveal + numbered 'exactly how' steps in a thread. Add partner hashtags if applicable.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "Under the sea.",
      "Beyond the stars. ✨",
      "This flower grows in my garden. 💜",
      "Testing @AIatMeta’s new Muse Image and I’m genuinely impressed.💜",
      "It’s not just generating pixels; it’s designing with genuine taste.💜"
    ],
    angles: [
      "Start with a short sensory or personal hook, reveal the AI process and tool after",
      "Obsess over technical strengths: face/skin consistency, instruction following, and design taste",
      "Use real-life personal connections (garden, childhood) as authentic entry point to AI creation",
      "Position AI as a collaborator with 'genuine taste' rather than a pure generator",
      "Disclose partnerships transparently while delivering value-first threads and demos"
    ],
    tags: ['aiart', 'aicreative', 'filmmaker', 'adobefirefly', 'promptengineering', 'contentcreator', 'ai-shipper', 'netlify'],
  },
  {
    id: 'jaibhagat',
    handle: '@ChaiWithJai',
    xHandle: 'ChaiWithJai',
    status: 'verified',
    name: 'Jai Bhagat',
    emoji: '☕',
    avatar: "/creators/jaibhagat/avatar.jpg",
    banner: "/creators/jaibhagat/cover.png",
    followers: 901,
    followersStr: '901',
    bio: 'Product Engineer | Breathwork Facilitator\n\nex @HashiCorp @Webflow',
    products: [
      { name: 'Chai With Jai', url: 'https://chaiwithjai.com', description: 'Media channel and workshops for builders' },
      { name: 'Dogged Pursuits', url: 'https://chaiwithjai.com', description: 'Personal branding and DevRel workshop series' },
      { name: 'Claude Code Workshop', url: 'https://chaiwithjai.com', description: 'Live AI-assisted coding training' },
    ],
    pillars: [
      "Indie hacker project shipping with real traction metrics",
      "AI-assisted engineering: ship practical tools and open source them",
      "T-shaped product engineer positioning with frameworks and examples",
      "Grounded takes on AI progress, hype cycles, and industry power dynamics"
    ],
    milestones: [
      { label: 'Followers', value: '896' },
      { label: 'Posts', value: '4,075' },
      { label: 'Shows', value: 'Dogged Pursuits' },
      { label: 'Workshops', value: 'Claude Code, Build in Public' },
    ],
    media: ["/creators/jaibhagat/media-1.jpg", "/creators/jaibhagat/media-2.jpg", "/creators/jaibhagat/media-3.jpg", "/creators/jaibhagat/media-4.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#8b5cf6', secondary: '#d946ef', accent: '#f472b6' },
    plays: [
      {
        "id": "jai-ai-code",
        "emoji": "🤖",
        "title": "Ship AI-coded tools for real problems",
        "description": "Use Codex and AI agents to solve difficult domain problems like PHI in healthcare. Build runnable apps (iPhone, WebGPU, Rust) and release the source code.",
        "action": "Identify a painful real problem. Build a working prototype with an AI coding agent. Make sure it runs on everyday hardware. Post the live link or video, GitHub repo, and note that the code is open source for hackathons.",
        "frequency": "Weekly"
      },
      {
        "id": "jai-brand",
        "emoji": "🧠",
        "title": "Build your brand as a T-shaped product engineer",
        "description": "Create and share mental models for modern engineering careers, then use your own shipped projects as the concrete worked example.",
        "action": "Post a crisp definition of a T-shaped (or similar) developer profile. Immediately follow with how your recent work (Rust app, side projects, broad tech) demonstrates it.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "jai-traction",
        "emoji": "📈",
        "title": "Share exact project metrics and next moves",
        "description": "Publicly celebrate real performance of indie projects with hard numbers, claim the win, and signal concrete plans like ad expansion or feature growth.",
        "action": "For a live project, post the exact stats (e.g. 'X is doing Y visitors/week!'). Boldly state it is your most successful indie hacker project. Mention what's exciting about the niche and one expansion move (ads, etc.).",
        "frequency": "Weekly"
      },
      {
        "id": "jai-forecast",
        "emoji": "🔮",
        "title": "Publish realistic AI capability forecasts",
        "description": "Break down recent model news (nerfs, delays) into honest implications for future releases, builder workflows, and the coming collision with regulation and capital.",
        "action": "Write one post about a current AI story. Detail the capability reality vs hype. Predict effects on 2027 regulation fights and 2028 constraints. Keep tone direct and data-informed.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "The T-shaped Developer:",
      "I made my first Rust app with Codex! The goal was solving the biggest problem in healthcare... working with PHI.",
      "techweeknyc dot com is doing 700+ visitors/week! THIS IS MY MOST SUCCESSFUL INDIE HACKER PROJECT",
      "I made a 3D brain using threejs over the weekend:",
      "Fable 5 is staying for 5 more days (but it’s nerfed SIGNIFICANTLY"
    ],
    angles: [
      "Define the archetype then prove it with your own work as the worked example",
      "Lead with precise usage numbers and bold success claims",
      "Build tools that tackle serious constraints (privacy, healthcare, consumer devices) and give the code away",
      "Weekend creative coding experiments hosted live on the web",
      "Challenge AI hype with specific predictions about capability plateaus, release delays, and future regulation"
    ],
    tags: ['devrel', 'personalbranding', 'claudecode', 'ai-shipper', 'workshops', 'mindfulness', 'netlify'],
  },
  {
    id: 'nullai',
    handle: '@DemoAgentOrg',
    xHandle: 'DemoAgentOrg',
    status: 'verified',
    name: 'Zoth Studio Team',
    emoji: '🇺🇸',
    avatar: "/creators/nullai/avatar.jpg",
    banner: "/creators/nullai/banner.jpg",
    followers: 116,
    followersStr: '116',
    bio: 'Creative Technologist',
    products: [
      { name: 'Zoth Studio Team Tech', url: 'https://nullai.tech', description: 'Virginia Beach web development and local SEO' },
      { name: 'Netlify Composable Launchpad', url: 'https://nullai.tech', description: 'Migration-safe Netlify architecture service starting at $499' },
    ],
    pillars: [
      "Daily documented shipping: Day X updates listing exact changes and results",
      "Static Netlify creator labs powered by live APIs, real cover art, and fallbacks",
      "Clear offers that point straight to live assets and copyable plans",
      "Visual launch storytelling with reusable cinematic prompts"
    ],
    milestones: [
      { label: 'Followers', value: '86' },
      { label: 'Posts', value: '1,569' },
      { label: 'Challenge', value: '100 sites / 30 days' },
      { label: 'Partner', value: 'Certified Netlify Partner' },
    ],
    media: ["/creators/nullai/media-1.png", "/creators/nullai/media-2.jpg", "/creators/nullai/media-3.jpg", "/creators/nullai/media-4.jpg", "/creators/nullai/media-5.jpg", "/creators/nullai/media-6.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#10b981', secondary: '#047857', accent: '#34d399' },
    plays: [
      {
        "id": "nullai-clear",
        "emoji": "🎯",
        "title": "Clear offer, point straight to the lab",
        "description": "Make the value and next step unmistakable in every post. Neal made the offer clear and pointed people straight to the live lab.",
        "action": "State the concrete outcome in one sentence. Give a direct link to the live lab or product. Add one simple next action: 'open the lab, pick a mentor, run today's plan.'",
        "frequency": "Daily"
      },
      {
        "id": "nullai-sprint",
        "emoji": "📅",
        "title": "Public Day X build logs",
        "description": "Run public sprints with structured daily updates. Detail exact technical wins (API wiring, asset rendering, fallbacks), the result, and influences. Turns each day into proof-of-work content.",
        "action": "Write a Day X post with date headline, 4-6 'what changed' bullets including specifics like endpoints and behaviors, one result sentence, credits, and a visual. Post as a thread or series.",
        "frequency": "Daily"
      },
      {
        "id": "nullai-lab",
        "emoji": "🧪",
        "title": "Ship live API-driven static labs",
        "description": "Productize static sites on Netlify that load real mentor/creator data from public APIs, display authentic cover images, gracefully fallback to animated canvases, and bundle ready-to-copy daily X plans. The homepage is the asset.",
        "action": "Wire cards to pull from /api/creators (or equivalent). Source covers from structured paths like /creators/<id>/cover.png. Implement canvas fallback when media missing. Add copy buttons for execution plans. Deploy to Netlify.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "nullai-visual",
        "emoji": "✨",
        "title": "Cinematic visual launch stories",
        "description": "Craft detailed prompts for atmospheric visuals of your product (neon dashboards, glowing cards). Share the prompt, generate the asset, then repurpose into carousels or short clips. Lead with the dream, follow with reality.",
        "action": "Write a wide cinematic prompt describing your dashboard or tool with lighting, motion, and overlay text. Generate image. Post the prompt + image. Create a 3-frame carousel or walkthrough repurposing the same concept.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "Day 6 — July 7, 2026",
      "Today I launched the CreatorPlaybooks Virtual Mentor Lab using the 6 mentor playbooks:",
      "I build static Netlify-ready creator labs that:",
      "Result: Day 6 is live — every mentor loads from the API, covers render from real assets, missing media falls back to animated canvases, and the lab is launch-ready.",
      "Any feedback from @web3 users would be much appreciated!! Leave them in the comments below!!"
    ],
    angles: [
      "Day X public logs that enumerate concrete technical deliverables as content",
      "Static Netlify as a platform for perpetually current, API-sourced creator experiences",
      "Playbook influence attribution paired with personal execution proof",
      "Prompt-first visual assets that sell the vision before showing implementation details",
      "Targeted asks for feedback from specific builder communities (web3, Netlify shippers)"
    ],
    tags: ['localseo', 'netlify', 'astro', 'webdev', 'freelance', 'bookingfunnels', 'ai-shipper'],
  },

  {
    id: 'maddiedreese',
    handle: '@maddiedreese',
    xHandle: 'maddiedreese',
    status: 'verified',
    name: 'Maddie D. Reese',
    emoji: '🚀',
    avatar: "/creators/maddiedreese/avatar.jpg",
    banner: "/creators/maddiedreese/banner.jpg",
    followers: 5006,
    followersStr: '5.0K+',
    bio: 'Learning! I don’t write code (but you probably won’t believe me). maddie@maddiedreese.com Check my website for my past projects! Send a message to my printer ⬇️',
    products: [
      { name: 'maddiedreese.com', url: 'https://maddiedreese.com', description: 'Personal site with 50+ past projects' },
      { name: 'Printer project', url: 'https://maddiedreese.com', description: 'Send a message to my printer' },
    ],
    pillars: [
      "Weird AI Experiments & Retro Tech Hacks",
      "Unconventional Benchmarks & Weird Evals",
      "Conference Takeaways to Immediate Public Builds",
      "Relatable Tech Humor & Observations"
    ],
    milestones: [
      { label: 'Followers', value: '5.0K+' },
      { label: 'Projects', value: '50+' },
    ],
    media: ["/creators/maddiedreese/media-1.jpg", "/creators/maddiedreese/media-2.jpg", "/creators/maddiedreese/media-3.jpg", "/creators/maddiedreese/media-4.jpg", "/creators/maddiedreese/media-5.jpg", "/creators/maddiedreese/media-6.jpg", "/creators/maddiedreese/media-7.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "maddiedreese-1",
        "emoji": "💿",
        "title": "Post Quirky Retro-AI Hardware Projects",
        "description": "Build and openly share strange experiments that combine vintage hardware with modern AI. Use curiosity-driven hooks and GitHub links to differentiate and demonstrate playful technical creativity.",
        "action": "1. Tinker with or finish a weird mashup like running an LLM on an old iMac G3 or CD-ROM setup.\n2. Start the tweet with a surprising hook: \"iMac LLM on a CD-ROM?!\"\n3. Follow immediately with the relatable detail and GitHub: \"Luckily my G3 has a tray-loader\\n\\nhttps://github.com/maddiedreese/imac-llm\"\n4. Attach a photo of the hardware/setup.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "maddiedreese-2",
        "emoji": "✈️",
        "title": "Turn Events into Visible Projects Fast",
        "description": "Attend AI conferences, start executing on ideas the same day, and post an authentic recap thread that includes photos plus the specific project you began to prove follow-through and excitement.",
        "action": "1. Attend (or deeply consume) an AI event like aiDotEngineer.\n2. Start a real project based on 1-2 talks as soon as you can — even on the flight home.\n3. Post a recap thread: \"I had an amazing time at my first @aiDotEngineer!\" covering standout talks, people (and non-humans) met, and the project you started.\n4. Share 3-4 photos that \"sum up the experience pretty well.\"\n5. Close with \"Until next time!\"",
        "frequency": "Monthly"
      },
      {
        "id": "maddiedreese-3",
        "emoji": "📊",
        "title": "Launch Weird Personal Benchmarks",
        "description": "Create signature playful benchmarks (maddie-bench style) that test models on creative/human tasks using structured outputs, run comparative evals with blind judging, then announce and tease results to own the \"weird evals\" niche.",
        "action": "1. Design a fun, insightful eval (e.g. how well models \"draw\" your profile picture via structured JSON).\n2. Test multiple models and use blind pairwise judging (by other models) to calculate Elo.\n3. Announce the launch: \"Introducing maddie-bench!\" then explain exactly what it measures and frame it as \"the first installment in my 'more weird evals' quest (and I think this one is decently weird).\"\n4. Post separate result teases: \"Fable and Sonnet 5 results on maddie-bench!\"\n5. Link to the full leaderboard and details.",
        "frequency": "Quarterly"
      },
      {
        "id": "maddiedreese-4",
        "emoji": "👀",
        "title": "Drop Nosy Builder Observations",
        "description": "Publish short, voice-forward standalone tweets that reveal how you observe AI builder culture and everyday tech moments. These build personality, relatability, and easy engagement.",
        "action": "1. Notice a small, specific behavior (zooming into visible screens in photos, etc).\n2. Write it in first person with direct voice: \"I must tell you: if you post a picture with your screen visible, I’m zooming in on your screen and reading everything on it. Sorry. I’m nosy.\"\n3. Post as a single tweet. No links, threads, or extra CTAs unless they feel completely natural.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "Building strange AI things in public.",
      "Helping non-traditional builders get technical!",
      "I must tell you: if you post a picture with your screen visible, I’m zooming in on your screen and reading everything on it. Sorry. I’m nosy.",
      "iMac LLM on a CD-ROM?!",
      "Introducing maddie-bench!"
    ],
    angles: [
      "Creator of 'more weird evals' — playful, personality-driven benchmarks for frontier models",
      "Retro hardware tinkerer shipping open-source AI experiments on old machines",
      "Fast executor who turns conference inspiration into public projects within hours",
      "Humor-first, nosy observer who humanizes technical building with short relatable takes",
      "Transparent non-traditional builder who is deeply technical and openly experimental"
    ],
    tags: ['no-code', 'ai-assisted', 'learning-in-public', 'hardware', 'ai-shipper', 'netlify'],
  },

  {
    id: 'clarklab',
    handle: '@clarklab',
    xHandle: 'clarklab',
    status: 'verified',
    name: 'Clark Wimberly',
    emoji: '🚀',
    avatar: "/creators/clarklab/avatar.jpg",
    banner: "/creators/clarklab/banner.jpg",
    followers: 3718,
    followersStr: '3.7K+',
    bio: 'I try to make things that are awesome. One half of Superfun. Design engineer. BBQ, games, AI wonk. SXSW, Microsoft, NASDAQ, Blockchain...',
    products: [
      { name: 'Superfun', url: 'https://superfun.team', description: 'One half of Superfun' },
    ],
    pillars: [
      "Prototyping & Shipping Games",
      "AI & Design Tool Spotlights",
      "Playful Humor & Absurd Wins",
      "Retro CRT & System Aesthetics"
    ],
    milestones: [
      { label: 'Followers', value: '3.7K+' },
      { label: 'Projects', value: '10+' },
    ],
    media: ["/creators/clarklab/media-1.jpg", "/creators/clarklab/media-2.jpg", "/creators/clarklab/media-3.jpg", "/creators/clarklab/media-4.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "clarklab-1",
        "emoji": "🍖",
        "title": "Personality-driven content",
        "description": "Mix absurd personal wins, food milestones, and silly pop-culture edits with AI and game dev work so the feed feels human and fun.",
        "action": "1. Spot a personal stat, trip milestone, or timely event (kebabs, holidays).\n2. Create a quick funny post or short video edit (e.g. exaggerated count or 'only the X' clip).\n3. Frame it with 'BREAKING:' or 'To celebrate X, here's...' and keep it light.\n4. Post roughly one humor piece for every three build or tool updates.",
        "frequency": "Weekly"
      },
      {
        "id": "clarklab-2",
        "emoji": "✨",
        "title": "Awesome-first curation",
        "description": "Try to make things that are awesome — and publicly break down the small, delightful details in your process and tools.",
        "action": "1. Finish a small piece of a project or notice a satisfying tool behavior.\n2. Capture the specific delightful detail (avoided button styles, added scanlines, a clean mechanic).\n3. Post a short breakdown or screenshot thread that emphasizes why it feels awesome.\n4. End with a subtle tie back to building better things.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "clarklab-3",
        "emoji": "🎮",
        "title": "Share Fable 5 + Godot cross-platform prototypes",
        "description": "Regularly document games built fast in Godot with Fable 5, focusing on real Android and iOS app potential.",
        "action": "1. Use Fable 5 to build or iterate a feature/level in a Godot game (fishing/pirate style or similar).\n2. Record a short video clip or GIF of gameplay or the editor.\n3. Tweet starting with 'Been using Fable 5 to crank out...' and call out fully baked Android (working) and iOS apps (coming soon).\n4. Reply to your tweet with stack details or a link to superfun.team when it fits the project.",
        "frequency": "Weekly"
      },
      {
        "id": "clarklab-4",
        "emoji": "📰",
        "title": "Publish 'Breaking Claude News' on tool wins",
        "description": "Use a consistent signature format to highlight smart AI behaviors and retro feature additions in tools like Fable and Claude.",
        "action": "1. Notice or test a specific useful capability (Fable dodging ledge-shadow buttons, classic palettes, scanlines + CRT vignette).\n2. Open the post with 'Breaking Claude News:' + the win, or follow up with 'It also has...'\n3. Add one sentence on why it matters to design engineers.\n4. Include 1-2 screenshots and ask followers what similar small wins they've spotted.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "I try to make things that are awesome",
      "Been using Fable 5 to crank out an Alaskan fishing/pirate game built in Godot",
      "To celebrate July 4th, here's Jaws (1975) but only the times someone says \"shark\".",
      "BREAKING: we have now consumed over 60 kebabs on this trip! Just a stunning accomplishment, really.",
      "Breaking Claude News: Fable is smart enough to avoid the ledge-shadow (aka chin shadow) button style everyone loves to hate"
    ],
    angles: [
      "Design engineer shipping real cross-platform games fast with Fable 5 + Godot",
      "AI power user who publicly cheers specific, delightful tool improvements and UX wins",
      "Humor-first poster using 'BREAKING' framing and pop-culture edits for low-stakes engagement",
      "Retro-futurist who brings classic palettes, scanlines and CRT effects into modern builds",
      "One half of Superfun who makes awesome things with craft, personality and playfulness"
    ],
    tags: ['design-engineer', 'superfun', 'personality', 'ai', 'ai-shipper', 'netlify'],
  },

  {
    id: 'rasaljaya',
    handle: '@rasaljaya',
    xHandle: 'rasaljaya',
    status: 'verified',
    name: 'Rasal Jayasinghe',
    emoji: '🚀',
    avatar: "/creators/rasaljaya/avatar.jpg",
    banner: "/creators/rasaljaya/banner.jpg",
    followers: 500,
    followersStr: '500+',
    bio: "Hosting Sri Lanka's #1 Tech Podcast, TechTalk 360 | Cursor Ambassador & Regional Lead South Asia | ElevenLabs Ambassador.",
    products: [
      { name: 'TechTalk 360', url: 'https://techtalk360.lk', description: 'Sri Lanka #1 tech podcast' },
      { name: 'Cursor Community', url: 'https://cursor.com', description: 'Ambassador + regional events' },
    ],
    pillars: [
      "Local Sri Lankan Tech Policy & Regulatory Updates",
      "AI Tool Evangelism (Cursor & ElevenLabs)",
      "TechTalk 360 Podcast & Insights",
      "Local Ecosystem Advocacy & Wins"
    ],
    milestones: [
      { label: 'Followers', value: '488+' },
      { label: 'Projects', value: '20+' },
      { label: 'Cities', value: '4+' },
    ],
    media: ["/creators/rasaljaya/media-1.jpg", "/creators/rasaljaya/media-2.jpg", "/creators/rasaljaya/media-3.jpg", "/creators/rasaljaya/media-4.png", "/creators/rasaljaya/media-5.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "rasaljaya-1",
        "emoji": "🎙️",
        "title": "TechTalk 360 Authority Building",
        "description": "Clip and share insights from Sri Lanka's #1 tech podcast to grow listeners and cement host authority.",
        "action": "1. Publish or finish a TechTalk 360 episode.\n2. Extract 1-2 key quotes or actionable takeaways that resonate with local tech audience.\n3. Post on X with a short lead-in and link to https://techtalk360.lk.\n4. Use #lka and engage with every reply.\n5. Repeat on a consistent weekly cadence.",
        "frequency": "Weekly"
      },
      {
        "id": "rasaljaya-2",
        "emoji": "🚀",
        "title": "Ambassador Tool Drops",
        "description": "Drive tool adoption with ultra-short, high-energy posts that highlight Cursor or ElevenLabs using your regional lead status.",
        "action": "1. Have a real win or new discovery with Cursor (or ElevenLabs).\n2. Open with a proven hook like \"RUN!\" or \"Finally!\".\n3. Immediately follow with the direct link (App Store or product page).\n4. Optionally add \"Cursor Ambassador & Regional Lead South Asia\" for credibility.\n5. Post and reply to early engagers.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "rasaljaya-3",
        "emoji": "📋",
        "title": "Local Policy & VAT Explainers",
        "description": "Turn complex Sri Lankan tech tax, billing, and infrastructure announcements into crystal-clear action lists that local developers and businesses need.",
        "action": "1. Track official updates from AWS, banks (e.g. Sampath, Visa), airlines or regulators.\n2. Break it down starting with \"[Topic] Update – Key Points\".\n3. List precise next steps (e.g. \"AWS Billing Console → Tax Settings. Enter your Sri Lanka VAT Tax Registration Number (TRN).\").\n4. Note deadlines and add #lka #tax.\n5. Post and invite questions for follow-ups.",
        "frequency": "Monthly"
      },
      {
        "id": "rasaljaya-4",
        "emoji": "📢",
        "title": "Direct Callouts & Manifesting",
        "description": "Build reach and conversation by directly addressing local companies on issues and posting short aspirational statements about AI and tech progress.",
        "action": "1. Notice a concrete local service problem or personal tech excitement (e.g. airlines, next Cursor feature).\n2. For issues: \"Sri Lankan Airlines, Are you aware about this?\" + cc relevant people + #srilanka #lka.\n3. For momentum: \"Always on top! Manifesting the next Composer.\" or \"Finally!\" + context + hashtags.\n4. Keep copy extremely short.\n5. Post when the feeling or observation is fresh.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "Finally!",
      "RUN!",
      "Always on top!",
      "Sri Lankan Airlines, Are you aware about this?",
      "AWS Sri Lanka VAT Update – Key Points"
    ],
    angles: [
      "Sri Lanka's go-to source for practical, step-by-step guidance on local tech policy and compliance",
      "Regional Cursor & ElevenLabs ambassador delivering high-signal tool recommendations to South Asia",
      "Host of TechTalk 360, the premier platform for Sri Lankan tech conversations and interviews",
      "Direct advocate who publicly calls out service gaps to drive accountability in the local ecosystem",
      "Concise, optimistic voice that celebrates wins and manifests the next wave of AI tooling"
    ],
    tags: ['podcast', 'cursor', 'elevenlabs', 'south-asia', 'ambassador', 'ai-shipper', 'netlify'],
  },

  {
    id: 'ayushtweetshere',
    handle: '@ayushtweetshere',
    xHandle: 'ayushtweetshere',
    status: 'verified',
    name: 'Ayush 🙏',
    emoji: '🚀',
    avatar: "/creators/ayushtweetshere/avatar.jpg",
    banner: "/creators/ayushtweetshere/cover.png",
    followers: 12100,
    followersStr: '12.1K',
    bio: 'Father, Husband, Son, Friend. Independent Entrepreneur.',
    products: [
      { name: 'Portfolio', url: 'https://superframeworks.com', description: 'Independent entrepreneur projects & idea bank' },
      { name: 'OutlierKit', url: 'https://outlierkit.com', description: 'No-code tools for indie hackers' },
      { name: 'Voibe', url: 'https://getvoibe.com', description: 'Audio & voice tools' },
    ],
    pillars: [
      "Transparent MRR Milestones & Churn Resolution",
      "SaaS Product Feature Launches & Iterations",
      "Detailed Side Project Sales & Portfolio Focus",
      "Honest Reflections & Quick Takes"
    ],
    milestones: [
      { label: 'Followers', value: '12.1K+' },
      { label: 'Projects', value: '20+' },
    ],
    media: ["/creators/ayushtweetshere/media-1.jpg", "/creators/ayushtweetshere/media-2.jpg", "/creators/ayushtweetshere/media-3.png", "/creators/ayushtweetshere/media-4.jpg", "/creators/ayushtweetshere/media-5.jpg", "/creators/ayushtweetshere/media-6.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "ayushtweetshere-1",
        "emoji": "📈",
        "title": "Post Transparent MRR Milestones with Churn Fixes and Next Goals",
        "description": "Share precise revenue milestones for core products. Detail the tough periods, list the exact actions taken to fix churn or improve the product, highlight traction signals, and state a clear next target.",
        "action": "1. Draft the post when you cross a meaningful revenue milestone (e.g. $3K MRR). 2. Open with the exact style: \"OutlierKit just crossed $3K MRR today morning 🤩\". 3. Acknowledge the reality: \"Last couple of months have been tough. Ideally we should have reached $3K back in May or June.. but churn was troubling..\". 4. List the concrete improvements as bullets:\n- Improved the data\n- Launched Competitor Studio - best in category YT research\n- Launched API+MCP\n- Made some changes to the pricing page to make the pro plan more attractive. 5. Share proof of progress: \"Last 10 customers are all on the pro plan..\". 6. End with forward momentum: \"Still a lot of work to do.. Next stop - $5K MRR by September LFG 🚀\". 7. Post and reply to comments with more context.",
        "frequency": "Monthly"
      },
      {
        "id": "ayushtweetshere-2",
        "emoji": "😅",
        "title": "Share Honest Founder Reflections, Churn Stories and Product Sunsets",
        "description": "Use short, vulnerable, low-friction posts to show the real journey: small portfolio wins, the grind of churn, and graceful exits from experiments. This builds deep trust and relatability.",
        "action": "1. For a quiet portfolio win across products post something short and positive like \"Good day for Voibe yesterday🤩\". 2. For closing a chapter use the reflective pattern: \"phew!!! it was good while it lasted 😅 Good bye Fable!\". 3. When talking churn or tough periods, keep the tone honest and specific without drama. 4. Limit to 1-4 lines. 5. Use matching emojis and post when the feeling is fresh. No forced CTA needed.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "ayushtweetshere-3",
        "emoji": "🏷️",
        "title": "Publish Full-Data Side Project Sale Announcements",
        "description": "When selling a side project, create a high-signal post with every metric a buyer needs: revenue, subscribers, traffic, assets included, momentum, reason for sale, price, and third-party verification.",
        "action": "1. Gather all stats before posting (MRR, lifetime revenue, email subs, social followers, monthly visitors, community size, domain age + DR). 2. Start the post: \"🏷️ For Sale - My PM Job Board - BestPMJobs\". 3. Use clean bullets for every number. 4. Explicitly list what is included: \"Includes lifetime deal of Job Boardly NoCode job board tool + LinkedIn page + subreddit\". 5. Add momentum and positioning: \"Traffic is mostly Google organic and AI engines.. Not actively working on this project.. but recently traffic and revenue started to pick up with some SEO efforts.. Could be a perfect project for someone looking scale a job board in the product management space\". 6. State reason + price: \"Reason for sale - focused on my other projects rn asking price - $3000\". 7. Finish with proof and CTA: \"All data verifiable via TrustMRR by @marclou DM if interested RT for karma 🙏\". 8. Attach dashboard screenshots and engage with serious DMs.",
        "frequency": "Quarterly"
      },
      {
        "id": "ayushtweetshere-4",
        "emoji": "🚀",
        "title": "Announce Feature Launches and Pricing Experiments with Revenue Impact",
        "description": "When you ship new capabilities (Competitor Studio, API+MCP) or adjust pricing/monetization, post about them and directly connect the work to reduced churn and better customer plans.",
        "action": "1. After shipping or seeing results, open the composer. 2. Lead with the new thing: \"Launched Competitor Studio - best in category YT research\" or \"Launched API+MCP\". 3. Mention complementary changes: \"Made some changes to the pricing page to make the pro plan more attractive\". 4. Tie to outcomes if available: \"Last 10 customers are all on the pro plan..\". 5. Keep tone excited yet grounded with product-relevant emojis. 6. Post and add the product URL in the thread or bio for easy discovery.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "OutlierKit just crossed $3K MRR today morning 🤩",
      "🏷️ For Sale - My PM Job Board - BestPMJobs",
      "phew!!! it was good while it lasted 😅 Good bye Fable!",
      "Good day for Voibe yesterday🤩",
      "The AI fear mongering is crazy among non tech folks🤦‍♂️"
    ],
    angles: [
      "Transparent bootstrapped founder who posts exact MRR numbers together with the specific churn fixes and pro plan upgrades that got him there",
      "Focused indie entrepreneur who runs a portfolio, ships high-leverage features on the core SaaS, then cleanly exits non-core projects with full data transparency",
      "Product builder who launches concrete tools (Competitor Studio for YT research, API + MCP) and pairs them with pricing changes that drive measurable customer upgrades",
      "Candid voice that mixes milestone celebrations, short vulnerable product sunsets, and grounded real-world observations on AI outside the tech bubble",
      "Seller of mature side projects who packages every verifiable signal (revenue, traffic sources, audiences, lifetime tools, domain metrics) so buyers can decide fast"
    ],
    tags: ['indie-entrepreneur', 'family', 'portfolio', 'lifestyle', 'ai-shipper', 'netlify'],
  },

  {
    id: 'phanindra_ai',
    handle: '@phanindra_ai',
    xHandle: 'phanindra_ai',
    status: 'verified',
    name: 'Phanindra Reddy',
    emoji: '🚀',
    avatar: "",
    banner: "",
    followers: 1966,
    followersStr: '2.0K+',
    bio: 'Building the best AI OS for founders.',
    products: [
      { name: 'MagicTeams AI', url: 'https://magicteams.ai', description: 'AI-powered team collaboration platform' },
    ],
    pillars: [
      "Daily and weekly building-in-public logs",
      "Rapid AI-powered product development",
      "Demo content and warm outreach for founders"
    ],
    milestones: [
      { label: 'Followers', value: '1.9K+' },
      { label: 'Product', value: '1' },
    ],
    media: ["/creators/phanindra_ai/media-1.jpg", "/creators/phanindra_ai/media-2.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "phanindra_ai-1",
        "emoji": "🎯",
        "title": "Talk to founders and recap publicly",
        "description": "Have real conversations with founders and prospects then turn outcomes into public day or weekly updates that demonstrate learning and traction.",
        "action": "Do 3 founder talks or 'fable and meets' this week. Include 1-2 highlights and finalised decisions in your next Day N or weekly recap post.",
        "frequency": "Weekly"
      },
      {
        "id": "phanindra_ai-2",
        "emoji": "🎥",
        "title": "Share what you are building videos",
        "description": "Regularly post short videos or demos of your AI OS and MagicTeams progress, especially paired with applications or updates.",
        "action": "Record one short video or Loom of your current work. Post it with phrasing like 'applied, waiting for the results by the way this is what i am building' plus the link.",
        "frequency": "Weekly"
      },
      {
        "id": "phanindra_ai-3",
        "emoji": "📅",
        "title": "Publish structured Day N logs",
        "description": "Use consistent numbered day updates mixing personal life, building activity, AI tool usage, and focus statements to stay visible and human.",
        "action": "Post 'Day X' with 4 bullets: 1 relaxing/personal (e.g. farming exotic fruits), 2-3 building actions (talks, video for CEO, smashing with Fable, decisions). Close with gratitude or clarity statement.",
        "frequency": "Daily"
      },
      {
        "id": "phanindra_ai-4",
        "emoji": "⚡",
        "title": "Declare shipping sprints + targeted outreach",
        "description": "Make bold public commitments on velocity and create specific content to trigger real conversations with targeted founders and CEOs.",
        "action": "Post a comeback sprint declaration like 'we are backkkk baby, gonna do 6 months of features in 7 days'. Create one fun video or asset for a specific person, tag them, and add 'p.s: can we talk now'.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "This is day 18 of building aios for founders",
      "we are backkkk baby, gonna do 6 months of features in 7 days",
      "This week is all about clarity and focus and that is what we are gonna get",
      "by the way this is what i am building",
      "had fun creating this"
    ],
    angles: [
      "Authentic day-by-day builder logging the real journey of an AI OS for founders",
      "Fable-powered extreme velocity — smashing accounts and features fast with frontier AI",
      "Calm personal routines paired with ruthless clarity, focus and aggressive execution",
      "Demo videos and casual tagging as warm, low-pressure founder outreach",
      "Radical transparency on applications, comebacks, and weekly intentions"
    ],
    tags: ['ai-os', 'founders', 'productivity', 'b2b', 'ai-shipper', 'netlify'],
  },

  {
    id: 'ash_wesley_',
    handle: '@AshAmplifies',
    xHandle: 'AshAmplifies',
    status: 'verified',
    name: 'Ash 🔊',
    emoji: '🚀',
    avatar: '/creators/ashamplifies/avatar.jpg',
    banner: '/creators/ashamplifies/cover.png',
    followers: 3131,
    followersStr: '3.1K+',
    bio: 'AI Shipper building in public on X as @AshAmplifies. Product builder, internet curator, meetup co-founder.',
    products: [
      { name: 'AI Shippers Community', url: 'https://aishippers.netlify.app', description: 'Invite-only cohort for Netlify AI builders' },
      { name: 'Meetups', url: 'https://x.com/AshAmplifies', description: 'Co-founded builder meetups' },
    ],
    pillars: [
      "Playful Product Experiments",
      "Serial Tiny Shipping",
      "Creative Discovery & Unlocks",
      "Community Amplification"
    ],
    milestones: [
      { label: 'Followers', value: '3.1K+' },
      { label: 'Projects', value: '10+' },
      { label: 'Community', value: 'AI Shippers' },
    ],
    media: ["/creators/ash_wesley_/media-1.jpg", "/creators/ash_wesley_/media-2.jpg", "/creators/ash_wesley_/media-3.jpg", "/creators/ash_wesley_/media-4.jpg", "/creators/ash_wesley_/media-5.jpg", "/creators/ash_wesley_/media-6.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "ash_wesley_-1",
        "emoji": "🕹️",
        "title": "Gamify a Standard Web Feature",
        "description": "Transform boring website components like contact forms into fun, interactive games to highlight delightful product thinking and spark shares.",
        "action": "1. Choose one everyday web element (contact form, button, navigation). 2. Invent a game-like twist (collect coins to grow message size, race to fill form etc). 3. Prototype it fast with vanilla JS or your favorite tool. 4. Create a short demo clip or live link. 5. Post on X starting with 'What if you turned your [feature] into [game]?' Describe the mechanics, use relevant emojis, credit sources, and tag creators who get it.",
        "frequency": "Weekly"
      },
      {
        "id": "ash_wesley_-2",
        "emoji": "🏡",
        "title": "Run a Numbered 30-Day Tiny Build Series",
        "description": "Consistently ship small themed projects (like Tiny Village) with progress numbering to create habit, anticipation, and a body of fun, shareable work.",
        "action": "1. Brainstorm a cute, focused theme (e.g. 'Tiny Village'). 2. Commit to building one small customizable or randomizable mini-app per entry. 3. Use consistent post format: 'X/30\n\n[TITLE] [emoji]\n\n[1-2 sentences on what players do, customize, export, connect]'. 4. Post regularly (aim for daily or frequent cadence) and engage with people who build their own versions.",
        "frequency": "Daily"
      },
      {
        "id": "ash_wesley_-3",
        "emoji": "📹",
        "title": "Share Full Video Walkthroughs",
        "description": "Post 'Full video:' links to YouTube or detailed demos to give followers complete context and value beyond quick tweets.",
        "action": "1. Record or compile a full video showing your project in action, build process, or how-to. 2. Upload publicly to YouTube. 3. Tweet a clean post: 'Full video: [paste URL]'. 4. Pair it with a previous teaser tweet for the project to drive views.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "ash_wesley_-4",
        "emoji": "🗺️",
        "title": "Document Sidequestmaxxing Publicly",
        "description": "Embrace and broadcast your ongoing creative detours and experiments to humanize your process and attract like-minded curious builders.",
        "action": "1. When you find yourself exploring a fun new idea or deep in a playful side project, capture a moment of it. 2. Tweet using your voice like 'Forever sidequestmaxxing 🗺️ 😃' plus a link, screenshot or short note. 3. Add a link to current work if possible. 4. Reply to comments to continue the conversation about exploration.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "What if you turned your website's Contact Us form into a playable Mario Kart game? 🕹️🏎️",
      "Oh gosh, what did I unlock here???!",
      "Forever sidequestmaxxing 🗺️ 😃",
      "13/30\n\nTiny Village 🏡"
    ],
    angles: [
      "The playful inventor who gamifies the mundane to create delightful web experiences",
      "The serial tiny-shipper who builds momentum through themed public series",
      "The excited unlocker who shares surprising creative coding moments and side explorations",
      "The generous community builder who credits collaborators and tags peers"
    ],
    tags: ['ai-shipper', 'netlify', 'product-builder', 'curation', 'meetups', 'community'],
  },

  {
    id: 'conormartin_',
    handle: '@conormartinai',
    xHandle: 'conormartin_',
    status: 'verified',
    name: 'Conor Martin',
    emoji: '🚀',
    avatar: "/creators/conormartin_/avatar.jpg",
    banner: '/creators/conormartin_/banner.jpg',
    followers: 568,
    followersStr: '568+',
    bio: 'Growth Marketer. Looking for a full-time role. I have millions of views on YouTube and through SEO.',
    products: [
      { name: 'YouTube', url: 'https://youtube.com/@conormartinai', description: 'Growth marketing content' },
    ],
    pillars: [
      "YouTube Gold Curation & Breakdowns",
      "Parasite SEO & Platform Shifts",
      "AI Video Workflow Sharing",
      "Proof & Metrics Storytelling"
    ],
    milestones: [
      { label: 'Followers', value: '560+' },
      { label: 'Views', value: 'Millions+' },
    ],
    media: ["/creators/conormartin_/media-1.jpg", "/creators/conormartin_/media-2.jpg", "/creators/conormartin_/media-3.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "conormartin_-1",
        "emoji": "📺",
        "title": "Break Down YouTube Gold",
        "description": "Curate and comment on high-value long-form YouTube content like Sam Ovens to demonstrate sharp growth marketing insight and taste.",
        "action": "1. Watch or re-watch a 30+ minute high-signal YouTube video on growth or business (Sam Ovens style).\n2. Extract a standout quote, metaphor or moment (e.g. the battery hen analogy).\n3. Tweet the quote or insight + your reaction with emojis if it fits + an engagement question like \"Anyone still watching this gold?\".\n4. Credit the source and briefly note why it's gold (e.g. emergence of Skool).\n5. Engage replies by adding more context from your own YouTube/SEO experience.",
        "frequency": "Weekly"
      },
      {
        "id": "conormartin_-2",
        "emoji": "🔍",
        "title": "Test Next-Phase Parasite SEO",
        "description": "Experiment with Instagram and Facebook as distribution channels and publicly discuss shifting SEO efforts for lighter moderation and reach.",
        "action": "1. Pick a growth marketing topic or keyword you want visibility for.\n2. Create and post optimized short-form content (Reels, carousels, posts) on Instagram and/or Facebook.\n3. Post your take on X: \"Are we moving to the next phase of parasite SEO? Instagram and Facebook could well be the places to be putting your effort and you don't need to worry as much about moderation.\"\n4. Follow up with results, comparisons to YouTube/Google, or examples.\n5. Track performance over 1-2 weeks and report back in a follow-up post.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "conormartin_-3",
        "emoji": "📈",
        "title": "Storytell with Real View Metrics",
        "description": "Use concrete view counts and SEO results as social proof to support your positioning as a growth marketer seeking full-time roles.",
        "action": "1. When a video or SEO project reaches a meaningful milestone, capture the data or screenshot.\n2. Post a clear update with the number + the tactic behind it.\n3. Reference your track record naturally: \"I have millions of views on YouTube and through SEO\".\n4. Use these updates when replying to growth marketing discussions or opportunities.\n5. Keep your bio and any pinned content updated with the proof.",
        "frequency": "Monthly"
      },
      {
        "id": "conormartin_-4",
        "emoji": "🎥",
        "title": "Share Your AI Video Generation Flows",
        "description": "Document and demonstrate your specific image-to-video creation process using tools like ElevenCreative to show practical, replicable AI skills for marketers.",
        "action": "1. Select or prepare a source image for your video.\n2. Connect the source image using your @ElevenCreative flow.\n3. Write a description for the video in seedance (or your video gen tool) and generate the clip.\n4. Tweet something like: \"not sure to be honest, I have an @ElevenCreative flow that I use, where you connect the source image and then describe the video in seedance here's another one!\" + attach or link the result.\n5. Reply to questions with extra details or prompt tips.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "I have millions of views on YouTube and through SEO",
      "Are we moving to the next phase of parasite SEO?",
      "Instagram and Facebook could well be the places to be putting your effort and you don't need to worry as much about moderation",
      "Anyone still watching this gold?",
      "not sure to be honest, I have an @ElevenCreative flow that I use, where you connect the source image and then describe the video in seedance"
    ],
    angles: [
      "Growth marketer curating and distilling the best long-form YouTube content into sharp X commentary",
      "SEO experimenter identifying and testing parasite opportunities on Instagram and Facebook",
      "Transparent practitioner openly sharing exact AI image-to-video production workflows",
      "Proof-first creator who uses millions of views as credibility while openly seeking full-time growth roles"
    ],
    tags: ['growth-marketing', 'youtube', 'seo', 'distribution', 'ai-shipper', 'netlify'],
  },

  {
    id: 'monroe_carol',
    handle: '@CarolMonroe',
    xHandle: 'CarolMonroe',
    status: 'verified',
    name: 'Carol Monroe',
    emoji: '🚀',
    avatar: "/creators/monroe_carol/avatar.jpg",
    banner: '/creators/monroe_carol/banner.jpg',
    followers: 7771,
    followersStr: '7.8K+',
    bio: 'AI Strategist & Creative Builder.',
    products: [
      { name: 'AI Strategy', url: 'https://carolmonroe.com', description: 'AI strategy consulting' },
    ],
    pillars: [
      "Frontier AI Creative Building",
      "Humanitarian Tech for Impact",
      "Builder Community Mobilization",
      "Authentic Personal & Cultural Voice"
    ],
    milestones: [
      { label: 'Followers', value: '7.8K+' },
      { label: 'Projects', value: '5+' },
    ],
    media: ["/creators/monroe_carol/media-1.jpg", "/creators/monroe_carol/media-2.jpg", "/creators/monroe_carol/media-3.jpg", "/creators/monroe_carol/media-4.jpg", "/creators/monroe_carol/media-5.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "monroe_carol-1",
        "emoji": "🧡",
        "title": "Declare Locked-In Deep Work Sprints",
        "description": "Publicly announce intense focus periods on creative AI projects using frontier tools like Fable to show real velocity and attract engagement from other builders.",
        "action": "1. Begin a serious creative or strategic building session with a high-powered AI tool (Fable 5 or equivalent). 2. Post a direct, short declaration: \"Fable 5 is back 🧡 Locked in until further notice!\". 3. Attach a relevant image, screenshot, or teaser of the work. 4. Share a follow-up update after emerging with concrete progress or output.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "monroe_carol-2",
        "emoji": "❤️",
        "title": "Share Specific Humanitarian Tech Contributions",
        "description": "Document and amplify real, usable tools or resources you create or share for crisis response, then mobilize the broader builder community with concrete asks.",
        "action": "1. When you have a tangible contribution (free app, resource, knowledge) for a humanitarian cause like disaster relief: Post in Spanish or bilingual starting with \"Mi pequeño aporte desde mi cancha por [crisis]: [link]\". 2. Clearly explain what it does and who it helps in 1-2 sentences. 3. Follow up with an English rallying post: \"Builders from all over the world are coming together to build solutions...\" 4. List specific actionable ways to help (Build something, mentor a team, contribute API or cloud credits, share expertise). Close with relevant emojis and flags.",
        "frequency": "Monthly"
      },
      {
        "id": "monroe_carol-3",
        "emoji": "🧠",
        "title": "Publish AI Strategy Frameworks",
        "description": "Distill real experience using AI tools into practical, visual frameworks that position you as a strategist who actually builds.",
        "action": "1. After focused AI work or project completion, extract one clear strategy, process, or lesson. 2. Create a post or short thread featuring a simple diagram, list, or before/after. 3. Frame it as actionable advice others can apply immediately in creative or impact projects. 4. Post weekly with your AI Strategist & Creative Builder voice.",
        "frequency": "Weekly"
      },
      {
        "id": "monroe_carol-4",
        "emoji": "💚",
        "title": "Share Event Applications and Travel Plans",
        "description": "Build visibility in the AI ecosystem by transparently posting about applications to major conferences and how they align with your travel and other events.",
        "action": "1. Right after submitting an application to a key AI or tech event, tweet: \"just applied to OpenAI DevDay 2026 💚\". 2. Immediately add context: \"already gonna be in SF that week for Supabase Select + Tech Week, so it'd be perfect timing\". 3. Close with genuine excitement: \"genuinely hoping this one happens\". 4. Attach media or a relevant photo when possible.",
        "frequency": "Quarterly"
      }
    ],
    hooks: [
      "Fable 5 is back 🧡 Locked in until further notice!",
      "Mi pequeño aporte desde mi cancha por los terremotos en Venezuela:",
      "Builders from all over the world are coming together to build solutions for the people affected by the earthquakes in Venezuela.",
      "just applied to OpenAI DevDay 2026 💚",
      "already gonna be in SF that week for Supabase Select + Tech Week, so it'd be perfect timing"
    ],
    angles: [
      "AI Strategist & Creative Builder who actually locks in with frontier models and ships output",
      "Humanitarian practitioner who turns AI and tech skills into immediate, specific crisis support",
      "Community mobilizer who gives clear, actionable ways for global builders to contribute to impact projects",
      "Bilingual and culturally grounded (🇸🇻) voice that mixes personal recommendations with high-signal tech content",
      "Transparent AI conference circuit participant who shares applications, timing, and real excitement"
    ],
    tags: ['ai-strategy', 'consulting', 'creative-ai', 'b2b', 'ai-shipper', 'netlify'],
  },

  {
    id: 'picsoung',
    handle: '@picsoung',
    xHandle: 'picsoung',
    status: 'active',
    name: 'Nicolas Grenié',
    emoji: '🚀',
    avatar: "/creators/picsoung/avatar.jpg",
    banner: "/creators/picsoung/banner.jpg",
    followers: 4100,
    followersStr: '4.1K+',
    bio: 'AI Shipper building in public on X as @picsoung. Developer Advocate, API enthusiast, and builder.',
    products: [],
    pillars: [
      "Build in public as a developer advocate and workshop facilitator",
      "Custom app building for education, training and demos",
      "Voice AI experimentation shared publicly",
      "Community events, organizing and ambassadorship amplification"
    ],
    milestones: [
      { label: 'Followers', value: '4.1K+' },
    ],
    media: ["/creators/picsoung/media-1.jpg", "/creators/picsoung/media-2.jpg", "/creators/picsoung/media-3.jpg", "/creators/picsoung/media-4.jpg", "/creators/picsoung/media-5.jpg", "/creators/picsoung/media-6.jpg", "/creators/picsoung/media-7.jpg", "/creators/picsoung/media-8.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "picsoung-1",
        "emoji": "🛠️",
        "title": "Build Custom Tools During Workshops",
        "description": "After or during AI workshops, immediately build a small custom app that supports the learning (progress tracking, etc.) and share the complete experience publicly as a developer advocate.",
        "action": "1. Attend or lead a workshop (Lovable or similar AI tool session). 2. Build one useful custom app during or right after (e.g. a student progress tracker across modules). 3. Post using a real hook like 'Just finished 5hrs of @Lovable workshop all in Spanish 😅' or 'I even built a custom app to follow progress of the students...'. 4. Show what you built with screenshots or a quick demo. 5. Mention key conversations with builders and tag the organizers + tool accounts.",
        "frequency": "Weekly"
      },
      {
        "id": "picsoung-2",
        "emoji": "🎙️",
        "title": "Publicly Commit to Voice Experiments",
        "description": "Time-box and announce focused experiments with voice agents to create accountability, attract engagement, and document real learnings in public.",
        "action": "1. Choose an emerging capability (voice agents). 2. Post the commitment: 'Joining voice gang for the next few weeks'. 3. Spend dedicated time building or testing voice features in personal or demo projects. 4. Share regular honest updates (wins, surprises, and challenges). 5. Engage with replies and the broader conversation.",
        "frequency": "Weekly"
      },
      {
        "id": "picsoung-3",
        "emoji": "🎮",
        "title": "Ship Gamified Voice Agent Demos",
        "description": "Create playful, persona-driven AI experiences (like Pokémon-style training games) and share them to demonstrate practical applications of voice agents.",
        "action": "1. Pick a real training scenario (sales reps, customer support, etc.). 2. Design simple game mechanics where users face different AI personas. 3. Add voice agent interactions. 4. Post with phrasing like 'Team [name] built a game with voice agent to train new sales reps. Like Pokémon, in the gym you meet different customer personas asking questions...'. 5. Include video, screenshots or a link and tag relevant communities.",
        "frequency": "Monthly"
      },
      {
        "id": "picsoung-4",
        "emoji": "🤝",
        "title": "Amplify Events via Ambassador & Organizer Roles",
        "description": "Leverage roles as Lovable ambassador, hackbarna organizer, and builspace alum to generate recurring pre-event, live, and post-event content that grows reach and positions you as a connector.",
        "action": "1. List upcoming events or programs tied to your roles. 2. Tease in advance: 'Excited for @MWCapital upskilling week Starting with a oversubscribed @lovable workshop'. 3. During events share live moments and any builds. 4. After: recap highlights, custom apps created, and conversations with builders. 5. Tag all partners (@lovable_dev, @hackbarna, @MWCapital etc.) and use consistent energetic tone + emojis.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "Joining voice gang for the next few weeks",
      "Just finished 5hrs of @Lovable workshop all in Spanish 😅",
      "I even built a custom app to follow progress of the students through the different modules",
      "Excited for @MWCapital upskilling week",
      "Team sellfast built a game with voice agent to train new sales reps"
    ],
    angles: [
      "The hands-on workshop facilitator who ships custom tools to enhance the builder experience",
      "The public voice AI experimenter who makes time-boxed commitments and shares the real journey",
      "The creator of playful gamified voice agent demos for practical training use cases",
      "The active ambassador and community organizer who turns events into consistent content engines",
      "The authentic long-term builder who mixes humor, nostalgia, and fresh experiments"
    ],
    tags: ['ai-shipper', 'netlify', 'devrel', 'api'],
  },

  {
    id: 'nkgoutham',
    handle: '@nkgoutham',
    xHandle: 'nkgoutham',
    status: 'verified',
    name: 'Krishna Goutham',
    emoji: '🚀',
    avatar: "/creators/nkgoutham/avatar.jpg",
    banner: "/creators/nkgoutham/banner.jpg",
    followers: 1300,
    followersStr: '1.3K+',
    bio: 'Your thinking is more scalable than you think. We build AI employees around your framework.',
    products: [
      { name: 'AI Employees', url: 'https://thelaunch.space', description: 'Framework-based AI agents' },
    ],
    pillars: [
      "Candid AI tool opinions and comparisons",
      "Agent workflow experiments and setups",
      "Personalizing AI employees",
      "Framework-based scalable thinking"
    ],
    milestones: [
      { label: 'Followers', value: '1.3K+' },
      { label: 'Projects', value: '65+' },
    ],
    media: ["/creators/nkgoutham/media-1.png", "/creators/nkgoutham/media-2.png", "/creators/nkgoutham/media-3.png", "/creators/nkgoutham/media-4.jpg", "/creators/nkgoutham/media-5.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "nkgoutham-1",
        "emoji": "🤖",
        "title": "Framework-to-AI-Employee Mapping",
        "description": "Show how to encode a user's specific thinking framework into a reliable AI employee that executes it.",
        "action": "1. Identify one concrete framework or decision process (yours or a customer's). 2. Prompt or configure your AI employee (Hermes) to strictly operate according to that framework. 3. Run it on an example task and capture the result. 4. Post the mapping: briefly explain the original framework, show what the agent did differently or better, and the scaling benefit. Use casual tone and link to thelaunch.space.",
        "frequency": "Monthly"
      },
      {
        "id": "nkgoutham-2",
        "emoji": "🧠",
        "title": "Share Scalable Thinking Content",
        "description": "Teach audiences that their thinking can be captured as systems and scaled with AI employees.",
        "action": "1. Choose one repeatable thinking pattern, mental model, or decision process you use. 2. Break it down into clear steps or principles. 3. Show or describe how an AI employee (Hermes or similar) can now run or amplify it. 4. Post or thread it, opening with a strong line like 'Your thinking is more scalable than you think' and include a practical takeaway.",
        "frequency": "Weekly"
      },
      {
        "id": "nkgoutham-3",
        "emoji": "⏱️",
        "title": "Document Real AI Agent Experiments",
        "description": "Share detailed, honest reports from running substantial tasks on different agentic tools and setups with metrics and direct comparisons.",
        "action": "1. Run a meaningful, non-trivial task on an AI agent or tool (Fable, droid setup, cc, Hermes, etc). 2. Track specifics: duration, tokens (e.g. 168k), context, time grinding, pricing model (subsidized vs API). 3. Note subjective feel and any tradeoffs. 4. Tweet casually starting with the experience ('burning the last subsidized hours of X') then the numbers and your bet ('betting the droid version actually feels better than running it in cc'). Add screenshot if useful.",
        "frequency": "Weekly"
      },
      {
        "id": "nkgoutham-4",
        "emoji": "😎",
        "title": "Share Personal AI Employee Moments",
        "description": "Post the human side of AI employees (naming them, emotional connection) alongside candid model and tool observations.",
        "action": "1. Personalize your AI employee (give it a real-life nickname like your wife's). 2. Use it for actual instructions and notice the difference in feel. 3. Draft a short post leading with the personal win ('I gave my Hermes Agent my wife's nick-name. It feels so good to give instructions to Hermes now 😎'). 4. Add a natural follow-up take ('BTW - Hermes with @grok is actually good so far' or a balanced review like the poke one). Post in lowercase conversational style.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "Your thinking is more scalable than you think",
      "It feels so good to give instructions to Hermes now 😎",
      "I gave my Hermes Agent my wife's nick-name.",
      "agents behave like humans",
      "Hermes with @grok is actually good so far"
    ],
    angles: [
      "The candid AI reviewer who shares specific gripes, balanced takes, and model recommendations",
      "The agent tinkerer who posts real metrics, token counts, runtimes, and setup comparisons",
      "The personalizer who names AI employees and builds genuine rapport with them",
      "The framework thinker who turns personal cognition into scalable, productized AI employees"
    ],
    tags: ['ai-employees', 'agents', 'frameworks', 'b2b', 'ai-shipper', 'netlify'],
  },

  {
    id: 'markbowley',
    handle: '@markbowley',
    xHandle: 'markbowley',
    status: 'verified',
    name: 'Mark Bowley',
    emoji: '🚀',
    avatar: "/creators/markbowley/avatar.jpg",
    banner: '/creators/markbowley/banner.jpg',
    followers: 3089,
    followersStr: '3.1K+',
    bio: 'Making the Internet simpler one bit at a time. Building hndmark, usewinnny, sparkstation.live, fullyfed (3K+ WAU), and subnoted.',
    products: [
      { name: 'hndmark', url: 'https://x.com/hndmark', description: 'Product/project handle' },
      { name: 'usewinnny', url: 'https://x.com/usewinnny', description: 'Product/project handle' },
      { name: 'sparkstation.live', url: 'https://sparkstation.live', description: 'Live product' },
      { name: 'fullyfed', url: 'https://fullyfed.crd.co', description: '3K+ WAU product' },
      { name: 'subnoted', url: 'https://subnoted.crd.co', description: 'Product' },
      { name: 'Substack', url: 'https://substack.com/@markbowley', description: 'Newsletter' },
    ],
    pillars: [
      "Simple Micro-Tool Shipping",
      "Frontend Demo & Code Drops",
      "Platform Challenge Participation",
      "Remix & Simplicity Thinking"
    ],
    milestones: [
      { label: 'Followers', value: '3.1K+' },
      { label: 'Projects', value: '30+' },
      { label: 'WAU', value: '3K+' },
    ],
    media: ["/creators/markbowley/media-1.jpg", "/creators/markbowley/media-2.jpg", "/creators/markbowley/media-3.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "markbowley-1",
        "emoji": "🧩",
        "title": "Ship Embeddable No-Backend Tools",
        "description": "Launch tiny, instantly usable tools that require nothing from the user except a couple of links or a visit.",
        "action": "1. Pick a narrow, common need that can be solved with public data sources or pure frontend (e.g. turn Dropbox share links into a gallery). 2. Build a self-contained responsive HTML/CSS/JS solution with features like grids, lightbox, and captions. 3. Deploy to free static hosting such as Cloudflare Pages or Netlify. 4. Tweet the outcome first: benefit + constraints removed (Just add X — no hosting needed). 5. Mention it works as a standalone page or embeddable widget and link the live demo.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "markbowley-2",
        "emoji": "👀",
        "title": "Post Reusable CSS + JS Experiments",
        "description": "Create and openly share small, delightful interactive frontend elements on CodePen so others can grab and reuse them.",
        "action": "1. Build a lightweight visual or interactive widget using only vanilla CSS + JS (e.g. animated googly eyes or hover effects). 2. Polish and publish a clean, forkable version on CodePen. 3. Tweet casually: describe what you built and where you used it. 4. Share the CodePen link and note that people can grab the code. 5. Tag any relevant accounts or platforms mentioned.",
        "frequency": "Weekly"
      },
      {
        "id": "markbowley-3",
        "emoji": "📊",
        "title": "Highlight Real Usage Metrics with Launches",
        "description": "Use credible traction numbers (3K+ WAU etc) to prove that simple tools achieve real adoption when you ship or mention products.",
        "action": "1. Track meaningful metrics on your key micro-products. 2. When announcing a new tool or update, include a relevant usage figure if available. 3. Post clean milestone statements or screenshots tied directly to the ship. 4. Use the numbers to reinforce that keeping things simple drives adoption. 5. Keep bios and product pages updated with the latest credible stats.",
        "frequency": "Monthly"
      },
      {
        "id": "markbowley-4",
        "emoji": "🏆",
        "title": "Submit to Platform Showcases & Themed Drops",
        "description": "Gain distribution and social proof by submitting projects to official galleries and occasionally promoting builder-themed merch.",
        "action": "1. Watch for themed calls (Netlify HotAppSummer etc) and quickly build or adapt a fitting small project. 2. Submit to the official showcase or gallery. 3. Announce on X with 'I shipped [Name] for @[host] #[event]' and link straight to the showcase entry. 4. For merch, set up #vibecoding collections on Teemill and tweet free shipping events with the direct store link. 5. Keep posts short, visual, and benefit-focused.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "Making the Internet simpler one bit at a time",
      "Why do we act like starting from scratch every time is some badge of honour?",
      "I shipped SheetGallery for @Netlify's #HotAppSummer",
      "Display Dropbox images in a responsive grid with lightbox + captions — Just add Dropbox share links — No image hosting or uploads needed",
      "A while back I created this interactive set of googly eyes with CSS + JS"
    ],
    angles: [
      "The maker of dead-simple, link-powered web tools that need zero setup or hosting",
      "Hands-on frontend tinkerer who shares real, reusable interactive code on CodePen",
      "Fast micro-shipper who enters platform challenges for extra reach and credibility",
      "Remix advocate who uses film, music, and game analogies to argue against constant reinvention",
      "Practical builder who blends product launches with lifestyle touches like #vibecoding merch"
    ],
    tags: ['micro-saas', 'newsletter', 'indie-hacker', 'netlify', 'ai-shipper'],
  },

  {
    id: 'hacksultan',
    handle: '@hacksultan',
    xHandle: 'hacksultan',
    status: 'verified',
    name: 'Akintunde Sultan',
    emoji: '🚀',
    avatar: "/creators/hacksultan/avatar.jpg",
    banner: "/creators/hacksultan/banner.jpg",
    followers: 293200,
    followersStr: '293K+',
    bio: 'Building a better learning experience at AltSchool Africa. @altschoolafrica @hacksultan_ea',
    products: [
      { name: 'AltSchool Africa', url: 'https://altschoolafrica.com', description: 'Learning institution' },
    ],
    pillars: [
      "Edtech Institution Building",
      "Representation and the Cost of National Absence",
      "Unfiltered Social Commentary",
      "Activating Hyper-Local Opportunities"
    ],
    milestones: [
      { label: 'Followers', value: '292.8K+' },
      { label: 'Students', value: 'Thousands+' },
    ],
    media: ["/creators/hacksultan/media-1.jpg", "/creators/hacksultan/media-2.jpg", "/creators/hacksultan/media-3.jpg", "/creators/hacksultan/media-4.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "hacksultan-1",
        "emoji": "📚",
        "title": "Champion Better Learning Experiences",
        "description": "Regularly connect your work building AltSchool Africa to the creation of globally competitive Nigerians who can seize international opportunities.",
        "action": "1. Post about building a learning institution with a better experience at @altschoolafrica. 2. Link the quality of education and exposure directly to real outcomes like kids winning gold in Rome. 3. Explain the missed opportunities when representation and preparation are lacking. 4. Tag @altschoolafrica and @hacksultan_ea. 5. Share student or program progress when possible.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "hacksultan-2",
        "emoji": "🌍",
        "title": "Tell Powerful Representation Stories",
        "description": "Leverage timely Nigerian successes to illustrate how deliberate pushes for presence unlock potential that would otherwise be missed.",
        "action": "1. Identify a strong current event example of Nigerian achievement abroad. 2. Start the post with: \"Imagine all the opportunities we’ve missed as a country because we lacked representations.\" 3. Detail the specific story and key individuals who made the push (e.g. Alex Onyia). 4. Close with \"This is why representation matters. Nigeria needs to be present.\" 5. Engage with thoughtful replies.",
        "frequency": "Weekly"
      },
      {
        "id": "hacksultan-3",
        "emoji": "💬",
        "title": "Post Sharp Observational Takes",
        "description": "Share concise, confident insights on human nature, confidence, and social dynamics (including tribalism) that cut through noise.",
        "action": "1. Observe reactions to news or everyday behavior. 2. Write a direct one or two sentence take. Examples: \"In this life, you can get away with almost anything if you speak fluently and with enough confidence. Even when you’re saying rubbish.\" or call out turning successes into tribal wars. 3. Post without softening. 4. Use replies to expand or defend the point.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "hacksultan-4",
        "emoji": "🤝",
        "title": "Drive Participation in Nigerian-Only Opportunities",
        "description": "Announce and amplify contests and programs restricted to Nigerian citizens in Nigeria using energetic, culturally resonant CTAs.",
        "action": "1. Source or run an opportunity (e.g. social media skit contest). 2. State the rules plainly and quoted: \"Social media skit contest.\" \"age 18-45.\" \"Nigerian Citizens in Nigeria only.\" 3. Include any visuals or entry details. 4. End with a strong local CTA: \"Get in joorrr 🤝🤝🤝🤝\". 5. Monitor and interact with entrants.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "In this life, you can get away with almost anything if you speak fluently and with enough confidence. Even when you’re saying rubbish.",
      "Imagine all the opportunities we’ve missed as a country because we lacked representations.",
      "This is why representation matters. Nigeria needs to be present.",
      "Get in joorrr 🤝🤝🤝🤝",
      "Building a learning institution with a better experience at @altschoolafrica"
    ],
    angles: [
      "The institution builder creating the pipeline for Nigeria's next global representatives",
      "The narrative strategist who turns one win into a case study for why presence matters",
      "The no-filter commentator on confidence, eloquence, and divisive social reactions",
      "The activator who turns platform reach into real participation for local Nigerian youth",
      "The credible voice bridging education quality with national pride and progress"
    ],
    tags: ['edtech', 'africa', 'community', 'altschool', 'ai-shipper', 'netlify'],
  },

  {
    id: 'dhruvalgolakiya',
    handle: '@DhruvalGolakiya',
    xHandle: 'DhruvalGolakiya',
    status: 'verified',
    name: 'Dhruval',
    emoji: '🚀',
    avatar: "/creators/dhruvalgolakiya/avatar.jpg",
    banner: "/creators/dhruvalgolakiya/banner.jpg",
    followers: 5766,
    followersStr: '5.8K+',
    bio: 'Running an agency, building products, and sharing the journey. Building tools to help iOS apps grow faster.',
    products: [
      { name: 'iOS Growth Tool', url: 'https://appgrowkit.com', description: 'Helps iOS apps grow faster' },
      { name: 'Agency', url: 'https://ryplix.com', description: 'Services + product studio' },
    ],
    pillars: [
      "iOS growth tool development and fast AI shipping",
      "Journey transparency with progress visuals",
      "Launch wins and platform leverage",
      "Direct experience-based advice"
    ],
    milestones: [
      { label: 'Followers', value: '5.7K+' },
      { label: 'Projects', value: '10+' },
    ],
    media: ["/creators/dhruvalgolakiya/media-1.jpg", "/creators/dhruvalgolakiya/media-2.jpg", "/creators/dhruvalgolakiya/media-3.jpg", "/creators/dhruvalgolakiya/media-4.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "dhruvalgolakiya-1",
        "emoji": "📱",
        "title": "Ship and document iOS growth feature updates",
        "description": "Turn product iterations into content by detailing the work behind high-impact features like AI screenshot generation in AppGrowKit.",
        "action": "After tweaking prompts or testing models for a feature, post the process and result: mention hours spent, specific tools (e.g. fable 5), exact benefit ('best quality level screenshots with just one click'), and attach demo or image. Include appgrowkit.com link.",
        "frequency": "Weekly"
      },
      {
        "id": "dhruvalgolakiya-2",
        "emoji": "📖",
        "title": "Post visual journey progress updates",
        "description": "Use before-and-afters of landing pages and work to show consistent improvement over time.",
        "action": "Take a screenshot of an old landing page or early product version. Post it with a caption like 'my first product landing page from one year ago 😎😎'. Optionally show current version and key lessons.",
        "frequency": "Monthly"
      },
      {
        "id": "dhruvalgolakiya-3",
        "emoji": "🚀",
        "title": "Broadcast launch platform wins with support CTA",
        "description": "Publicly celebrate signups and trials from platforms and rally the audience for upvotes and visibility.",
        "action": "After receiving trials or paid users from a launch: post the exact numbers and attribution ('got 2 free trial and one paid subscription after @scrolllaunch 🫡🫡'). Add the platform link and ask clearly: 'if you haven't up voted yet, go and upvote on scrolllaunch link 👇'.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "dhruvalgolakiya-4",
        "emoji": "💡",
        "title": "Share direct positioning and client advice from experience",
        "description": "Post clear, no-fluff advice drawn from agency work about what actually drives client acquisition and quality work.",
        "action": "Write a post that addresses a common limiting belief (e.g. nationality bias). State the observation, give your counter based on results ('if you are good, client literally don't care...'), and close with a strong principle or question to make readers reflect.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "my first product landing page from one year ago 😎😎",
      "got 2 free trial and one paid subscription after @scrolllaunch 🫡🫡",
      "spent the last 24 hours testing new models and tweaking prompts with fable 5 and finally pushing these changes live!",
      "if you are good, client literally don't care about if you are indian or not",
      "loving this new setup"
    ],
    angles: [
      "One-click AI quality improvements for iOS app visuals and marketing",
      "Evolution storytelling using old work as proof of consistent building",
      "Traction transparency from launch platforms to drive social proof and support",
      "Merit-based client acquisition advice that rejects excuses",
      "Casual tooling and setup shares that build relatability"
    ],
    tags: ['agency', 'ios', 'growth', 'journey', 'ai-shipper', 'netlify'],
  },

  {
    id: 'idohodl',
    handle: '@idohodl',
    xHandle: 'idohodl',
    status: 'verified',
    name: 'Vamshi',
    emoji: '🚀',
    avatar: "/creators/idohodl/avatar.jpg",
    banner: "/creators/idohodl/banner.jpg",
    followers: 1703,
    followersStr: '1.7K+',
    bio: 'The AI ROI Guy. Your company is spending millions on AI. I built the software to prove what it is actually returning.',
    products: [
      { name: 'AI ROI Software', url: 'https://idohodl.com', description: 'Measure actual AI spend ROI' },
    ],
    pillars: [
      "Zero-to-One AI Product Building",
      "Agentic Engineering & Tooling",
      "AI-Assisted Research & Decision Artifacts",
      "Infrastructure Questions & Speculative Ideas"
    ],
    milestones: [
      { label: 'Followers', value: '1.7K+' },
      { label: 'Product', value: '1' },
    ],
    media: ["/creators/idohodl/media-1.jpg", "/creators/idohodl/media-2.jpg", "/creators/idohodl/media-3.jpg", "/creators/idohodl/media-4.jpg", "/creators/idohodl/media-5.jpg"],
    category: 'netlify-shippers',
    theme: { primary: '#22d3ee', secondary: '#8b5cf6', accent: '#ec4899' },
    plays: [
      {
        "id": "idohodl-1",
        "emoji": "📊",
        "title": "Drop Multi-Tool AI Research Artifacts",
        "description": "Use stacks of AI tools to dig into real questions and share clean reports or infographics that demonstrate practical analysis value.",
        "action": "1. Pick a timely topic or question (stock analysis, consumer comparison, industry friction). 2. Combine multiple AI tools for research, synthesis, and visuals. 3. Package tightly. 4. Post with phrasing like 'Total report on [topic]. Generated with a combination of multiple AI tools, not financial advice' or 'Did some digging on common questions so you don't have to. Enjoy the infographic!' plus media and relevant tags.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "idohodl-2",
        "emoji": "🔍",
        "title": "Ask Sharp Foundational Tooling Questions",
        "description": "Pose clean, memorable questions about missing AI platforms and infrastructure to spark conversation and position as a thoughtful builder.",
        "action": "1. Spot a real gap while shipping (no simple template ecosystem, portfolio from hosted projects, etc.). 2. Boil it down to a short question like 'What's the wordpress.org of AI?'. 3. Post the question with minimal context or a screenshot. 4. Reply to comments with your own examples or partial answers from your builds.",
        "frequency": "Weekly"
      },
      {
        "id": "idohodl-3",
        "emoji": "👀",
        "title": "Share Agentic Workflow Observations & Imagine Extensions",
        "description": "Document specific moments with tools (Cursor agents, Figma agents, voice input) and float adjacent product ideas to show how you think.",
        "action": "1. Capture a concrete tool moment or friction (agents window, native design agent, keyboard replacement). 2. Post a short observation + screenshot or clip. 3. Add a speculative hook like 'Imagine prediction markets on Whatsapp!' or 'Would have been amazing if this was a perspective created by an AI tool...'. 4. Name the exact tools for credibility.",
        "frequency": "Weekly"
      },
      {
        "id": "idohodl-4",
        "emoji": "📝",
        "title": "Ship Public WIP Portfolio Updates & Ask for Feedback",
        "description": "Treat your personal site as a living record of zero-to-one work and regularly invite the community to engage with it.",
        "action": "1. Maintain a clean public portfolio (e.g. vvamshi.com) listing current projects with status (In progress / Launched) and short descriptions. 2. When updating or launching a section, post a direct ask like 'Appreciate it if you could drop a quick feedback on my new portfolio site [WIP] [link]' or note a recent unlock like 'Ah! Finally I can manage landing pages and complex apps in one place'. 3. Highlight one project or specific question. 4. Publicly thank and reply to every piece of feedback.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "I help turn “someone should build this” into a working AI product.",
      "AI definitely made us work more!",
      "What's the wordpress.org of AI?",
      "Would have been amazing if this was a perspective created by an AI tool to replicate what happened in the real world from their perspective, except for 0.37 seconds",
      "Imagine prediction markets on Whatsapp!"
    ],
    angles: [
      "Zero-to-one builder who turns vague ideas into shipped AI products across agents, SaaS, fintech, taxtech & enterprise",
      "Applied AI architect obsessed with agentic workflows, native agents, and practical developer tooling",
      "Multi-tool researcher who produces decision-grade reports and visuals using AI stacks",
      "Platform thinker who calls out infrastructure gaps and floats adjacent 'what if' product concepts",
      "Transparent public builder who maintains living portfolios and invites direct feedback on frontier WIPs"
    ],
    tags: ['ai-roi', 'enterprise', 'b2b', 'saas', 'ai-shipper', 'netlify'],
  },  {
    id: 'levelsio',
    handle: '@levelsio',
    xHandle: 'levelsio',
    status: 'verified',
    name: 'Pieter Levels',
    emoji: '🚀',
    avatar: "/creators/levelsio/avatar.jpg",
    banner: "/creators/levelsio/banner.jpg",
    followers: 910500,
    followersStr: '911K',
    bio: '📸 PhotoAI $100K/m\n🛰 Nomad List $44K/m\n🎮 Remote OK $39K/m\n🏡 other projects $35K/m\n👙 + @X $14K/m\n🌍 $10K/m\n💾 $0/m',
    products: [
      { name: "PhotoAI", url: "https://photoai.com", description: "AI headshot & portrait generator" },
      { name: "Nomad List", url: "https://nomadlist.com", description: "Best cities for digital nomads" },
      { name: "Remote OK", url: "https://remoteok.com", description: "Remote jobs board" }
    ],
    pillars: [
      "AI-Powered Prototyping with Claude Code",
      "Remote Nomadic Coding Lifestyle",
      "Personal Site Experiments & Demos",
      "Authentic Tooling & Infra Stories"
    ],
    milestones: [
      { label: "Followers", value: "906K" },
      { label: "Products", value: "12+ launched" },
      { label: "Revenue", value: "$100K+/mo" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/levelsio/media-1.jpg", "/creators/levelsio/media-2.png", "/creators/levelsio/media-3.jpg", "/creators/levelsio/media-4.jpg"],
    category: 'big-players',
    theme: { primary: "#000000", secondary: "#FFFFFF", accent: "#FF9900" },
    plays: [
      {
        "id": "levelsio-1",
        "emoji": "🤯",
        "title": "Post AI coding wins from your VPS setup",
        "description": "Share narrative posts about using Claude Code to build iOS apps and features by running it on your server which then uses SSH and cloud Macs to compile.",
        "action": "1. Build something meaningful with Claude Code on your VPS (e.g. an iOS Swift app or new API).\n2. Ask it to take a screenshot or generate a preview link.\n3. Tweet the story exactly like: '🤯 And it worked! It made a basic iOS app in full Swift then made a screenshot and sent me a link to check it!'\n4. Add details: built on Hetzner VPS, SSH to MacinCloud, Xcode. End with why this setup is great.",
        "frequency": "Weekly"
      },
      {
        "id": "levelsio-2",
        "emoji": "💾",
        "title": "Demo fun experiments on your personal site",
        "description": "Add and immediately tweet about quirky interactive features on your own domain, such as emulated OS environments with drag and drop file support.",
        "action": "1. Create or enhance a fun page on your personal site (e.g. Windows 3.11 emulator).\n2. Implement real interactions like dragging files from desktop into the emulator's C:\\DOCS or C:\\SHARED folders using WebFS.\n3. Tweet: 'Another little thing that nothing but Fable could have helped me make today: You can now drag and drop files from your own computer into Windows 3.11 on [link]'\n4. Explain the folders and why it's cool (shared library feel).",
        "frequency": "Bi-weekly"
      },
      {
        "id": "levelsio-3",
        "emoji": "📱",
        "title": "Share your phone + VPS development lifestyle",
        "description": "Talk about coding and monitoring projects from your iPhone using SSH, and renting cloud Macs for specific builds instead of local machines.",
        "action": "1. Set up Termius (or similar) to SSH into your VPS from iPhone.\n2. Do real work this way and track an AI coding session.\n3. Tweet the origin story: 'So @marckohlbrugge told me to finally make a Nomads iOS app today But I didn't want to do it locally... now it's coding an iOS app via SSH with Xcode on a Mac Mini somewhere in California!'\n4. Close with: 'My work now is about 50-50 on my iPhone or MacBook Pro, both via Termius SSH to VPS! It's lovely!'",
        "frequency": "Weekly"
      },
      {
        "id": "levelsio-4",
        "emoji": "😭",
        "title": "Share honest infrastructure limits",
        "description": "Post about everyday operational issues like hitting quotas on services that power your multiple sites to show authenticity.",
        "action": "1. Note when a key service (email, API, hosting) quota or limit affects your projects.\n2. Post immediately and plainly: 'Hit my @Cloudflare Email Sending quota today 😭 Can't send any emails on any of my sites anymore'\n3. Keep it short and real. Follow up in replies if you find a fix.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "🤯 And it worked!",
      "Hit my @Cloudflare Email Sending quota today 😭",
      "Another little thing that nothing but Fable could have helped me make today:",
      "So @marckohlbrugge told me to finally make a Nomads iOS app today",
      "I didn't touch anything, I just prompt, and I also can't even login to check on it because it runs headless on the Mac Mini in the cloud!"
    ],
    angles: [
      "Building production iOS apps entirely by prompting Claude Code running on a VPS that SSHs into remote Mac Minis",
      "Adding delightful interactions like drag-and-drop file sharing to retro emulators on personal websites using WebFS",
      "Conducting 50/50 development work from an iPhone via SSH clients like Termius to avoid carrying a laptop",
      "Publicly documenting both exciting 'it worked' AI builds and painful real limits like Cloudflare email quotas"
    ],
    tags: [
      "indie-hacker",
      "saas",
      "buildinpublic",
      "verified"
    ],
  },  {
    id: 'tdinh_me',
    handle: '@tdinh_me',
    xHandle: 'tdinh_me',
    status: 'verified',
    name: 'Tony Dinh',
    emoji: '🛠️',
    avatar: "/creators/tdinh_me/avatar.jpg",
    banner: "/creators/tdinh_me/banner.jpg",
    followers: 193500,
    followersStr: '194K',
    bio: 'Creating software I love to use.\n🌎 NEW product\n🧠 AI tool $137K/m\n🧰 toolkit $5K/m',
    products: [
      { name: "BlackMagic.so", url: "https://blackmagic.so", description: "AI-powered product development tool" }
    ],
    pillars: [
      "Build tools you personally want to use",
      "Transparent AI economics and ROI",
      "Planning-first AI development workflows",
      "AI tools that empower non-tech business owners"
    ],
    milestones: [
      { label: "Followers", value: "193K" },
      { label: "Products", value: "Multiple AI tools" },
      { label: "Revenue", value: "$137K/m on main product" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/tdinh_me/media-1.jpg", "/creators/tdinh_me/media-2.jpg", "/creators/tdinh_me/media-3.jpg", "/creators/tdinh_me/media-4.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#0A66C2", secondary: "#FFFFFF", accent: "#00C4B4" },
    plays: [
      {
        "id": "tdinh_me-1",
        "emoji": "📊",
        "title": "Revenue Milestone Transparency",
        "description": "Share exact AI token usage, costs, and MRR gains (plus smaller wins) in a clear format with AMA to build massive credibility and engagement through radical transparency.",
        "action": "1. Track tokens used, subscription-based costs, and MRR deltas monthly.\n2. Post in this exact multi-line style with a dashboard screenshot: \"I used ~25B tokens last month\n\n~$15,000 cost\n\nGained $157 MRR\n\nAMA\"\n3. Reply to comments with clarifications (e.g. \"estimated cost based on the subscription plan\", \"delivered the value of ~6 months what the team of 10 would have done\", \"claude code only\").\n4. Separately post small wins immediately: \"$100 MRR 🫡\".",
        "frequency": "Monthly"
      },
      {
        "id": "tdinh_me-2",
        "emoji": "🚀",
        "title": "Feature-as-Marketing Ship Loop",
        "description": "Turn every meaningful product publish, update, and future vision into high-signal content that markets the product while it ships.",
        "action": "1. When you publish or significantly advance a product (e.g. makeawebsite.app), immediately post a short authentic update.\n2. Include excitement, what it enables for users, and concrete next steps.\n3. Example structure: \"My make website app is published. Next steps are ASO and dancing on TikTok 🕺😩🕺\" or the full vision post.\n4. Always add a link or feedback ask.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "tdinh_me-3",
        "emoji": "🧠",
        "title": "Share AI Planning Best Practices",
        "description": "Teach the audience to front-load big projects with dedicated planning agents (Fable) before heavy implementation (Opus / Claude Code) to avoid massive token waste.",
        "action": "1. Before coding large features, spend one or more full days planning the roadmap inside a planning AI tool.\n2. Post the reminder exactly like this: \"One more day on Fable 5.\n\nReminder to use it to PLAN big tasks in advance so we have months' worth of implementation time for Opus\n\nOtherwise you are WASTING TOKENS!!!\"\n3. Add context from your current projects when relevant.",
        "frequency": "Weekly"
      },
      {
        "id": "tdinh_me-4",
        "emoji": "🌎",
        "title": "Broadcast Non-Tech AI Product Vision",
        "description": "Publicly articulate the complete long-term vision for AI tools that let non-technical business owners run their entire online presence.",
        "action": "1. When the vision for the next phase is clear, post with genuine excitement.\n2. Use this structure: \"Excited to see how this turns out 😁\n\nI want to make it possible for non-tech business owners to run their entire online presence with AI via a simple app.\n\nStarting with helping them make a website, and then other stuff like geo SEO, posting updates on social media pages, managing their Google Maps / Google Business, etc\"\n3. Attach a screenshot and link to the current live product (makeawebsite.app).",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "I used ~25B tokens last month",
      "$100 MRR 🫡",
      "One more day on Fable 5.",
      "Excited to see how this turns out 😁",
      "I want to make it possible for non-tech business owners to run their entire online presence with AI via a simple app."
    ],
    angles: [
      "Radical transparency on exact AI token spend, dollar costs, and MRR produced",
      "Planning extensively with agents before expensive implementation to control costs",
      "Solo AI development delivering the value of large traditional dev teams",
      "Dead-simple AI apps that let non-technical owners handle websites, SEO, social, and Google Business",
      "Public celebration of both huge usage numbers and every small revenue milestone"
    ],
    tags: [
      "indie-hacker",
      "ai-shipper",
      "saas",
      "verified"
    ],
  },  {
    id: 'dannypostma',
    handle: '@dannypostma',
    xHandle: 'dannypostma',
    status: 'verified',
    name: 'Danny Postma',
    emoji: '🤖',
    avatar: "/creators/dannypostma/avatar.jpg",
    banner: "/creators/dannypostma/banner.jpg",
    followers: 176200,
    followersStr: '176K',
    bio: 'Laying low',
    products: [],
    pillars: [
      "Digital minimalism and reclaiming real life",
      "Building personal tools to fix your own problems",
      "Vulnerable, high-signal life storytelling",
      "Curious progress updates on hobbies and side work"
    ],
    milestones: [
      { label: "Followers", value: "176K" },
      { label: "Posts", value: "Unknown" },
      { label: "Product", value: "Multiple AI services" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/dannypostma/media-1.jpg", "/creators/dannypostma/media-2.jpg", "/creators/dannypostma/media-3.jpg", "/creators/dannypostma/media-4.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#1DA1F2", secondary: "#FFFFFF", accent: "#00C4B4" },
    plays: [
      {
        "id": "dannypostma-1",
        "emoji": "📝",
        "title": "Publish a 'Been a while' personal life reflection post",
        "description": "Share honest, detailed updates about stepping back from social media, personal growth, relationships and life priorities to drive massive engagement through vulnerability.",
        "action": "1. Block 45 minutes to write. 2. Open with 'Hey Twitter. Been a while.' or 'Just wanted to share where I've been the last 5 months.' 3. Tell the story chronologically: what triggered the change (personal stuff or doomscrolling), the decision (cold turkey quit), the specific improvements (lost 7kg, got married, better relationships, clearer thinking), and what you miss. 4. Use a bullet list for changes. 5. Close by inviting direct emails or messages. 6. Post and personally reply to engaged comments.",
        "frequency": "Quarterly"
      },
      {
        "id": "dannypostma-2",
        "emoji": "🛠️",
        "title": "Build and showcase a personal minimal X client",
        "description": "Create a tiny custom tool inside your personal OS that lets you post, view stats and interact with replies without seeing the main feed, then share the build.",
        "action": "1. Define the only 3 things you want from X: post tweets, see tweet stats, see replies and interact. 2. Spend 2 hours with an AI coding assistant or simple scripts to build a minimal private interface that does exactly those. 3. Run it on an old machine if you have one. 4. Write a post explaining the problem (doomscrolling + anxiety) and solution: 'I added a mini Twitter tool inside my personal OS.' 5. Show how it works with a quick description or screenshot. 6. Note the build time.",
        "frequency": "Monthly"
      },
      {
        "id": "dannypostma-3",
        "emoji": "🔢",
        "title": "Drop short intriguing progress teases",
        "description": "Use very short posts to share milestones on collections, builds or goals and create curiosity-driven engagement.",
        "action": "1. Choose a personal collection or project you're tracking (e.g. items, side work). 2. When you reach a nice number or breakthrough, post a single line like '20/26 collected. Six more to go, of which 2 are impossibly pricy 😅'. 3. Other examples: 'Manifesting' or 'i think i finally did it'. 4. Keep it under 20 words and add 1-2 emojis. 5. Post and engage lightly with replies if they ask for context.",
        "frequency": "Weekly"
      },
      {
        "id": "dannypostma-4",
        "emoji": "🧪",
        "title": "Share results from attention and habit experiments",
        "description": "Document real experiments with social media, caffeine, fitness and productivity and the concrete improvements to your mood and life.",
        "action": "1. Run a defined experiment (delete X, reduce caffeine to ~60mg/day, workout, etc) for at least 10 days. 2. Note the before state ('Felt very anxious for a while') and root cause ('doom-scrolling and caffeine'). 3. After clear results, post: the change made, the 'Huge difference in mental mood', and the honest trade-off ('Only downside. I do like to share my work and life.'). 4. Add any physical wins like weight loss or better relationships. 5. Post and monitor replies.",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "Hey Twitter. Been a while.",
      "Thanks to everyone who's reached out to check in, I haven't died, promise",
      "Felt very anxious for a while.",
      "i think i finally did it",
      "Only downside. I do like to share my work and life."
    ],
    angles: [
      "Vulnerability about leaving the platform creates stronger connection than constant posting",
      "Solving your own attention problems with custom tools is the ultimate proof of expertise",
      "Real life milestones (marriage, health, clarity) are more compelling than product launches",
      "Short mysterious updates keep followers engaged between deeper posts",
      "You can stay connected to your audience without letting the feed own your mind"
    ],
    tags: [
      "indie-hacker",
      "ai-shipper",
      "verified"
    ],
  },  {
    id: 'arvidkahl',
    handle: '@arvidkahl',
    xHandle: 'arvidkahl',
    status: 'verified',
    name: 'Arvid Kahl',
    emoji: '📚',
    avatar: "/creators/arvidkahl/avatar.jpg",
    banner: "/creators/arvidkahl/banner.jpg",
    followers: 202400,
    followersStr: '202K',
    bio: 'Building https://t.co/od97B0ItgS and https://t.co/6pSdm6nybd in Public. Raising all the boats with kindness. 🎙️ Podcast ✍️ Writing',
    products: [
      { name: "FeedbackPanda (exited)", url: "https://feedbackpanda.com", description: "SaaS for teachers (sold)" }
    ],
    pillars: [
      "Building Podcast Tools in Public",
      "Kindness Amplification and Community Building",
      "Agentic AI and the Changing Act of Coding",
      "Humorous, Pragmatic Real Talk on Dev and AI"
    ],
    milestones: [
      { label: "Followers", value: "202K" },
      { label: "Products", value: "FeedbackPanda (exited)" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Yes (teaching)" }
    ],
    media: ["/creators/arvidkahl/media-1.jpg", "/creators/arvidkahl/media-2.jpg", "/creators/arvidkahl/media-3.jpg", "/creators/arvidkahl/media-4.jpg", "/creators/arvidkahl/media-5.jpg", "/creators/arvidkahl/media-6.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#4F46E5", secondary: "#FFFFFF", accent: "#10B981" },
    plays: [
      {
        "id": "arvidkahl-2",
        "emoji": "🤝",
        "title": "Kindness Amplification",
        "description": "Quote-tweet and engage with other creators' content by adding genuine nuance and celebration, embodying 'raising all the boats with kindness'.",
        "action": "1. Scroll for a solid milestone, insight, or win from another indie hacker or builder. 2. Quote tweet it and add a genuine 2-3 sentence comment that sharpens their point, provides helpful context, or amplifies positively. 3. Never include snark or dunking. 4. Engage further in the replies to continue the generous conversation.",
        "frequency": "Daily"
      },
      {
        "id": "arvidkahl-4",
        "emoji": "🛠️",
        "title": "Build-in-Public Engineering and AI Shifts",
        "description": "Share real technical struggles, discoveries, and perspective shifts (especially around AI agents and modern development) and invite the community into the problem-solving.",
        "action": "1. When facing a genuine technical blocker, surprising discovery, or mindset shift while building (e.g. moving from writing code to orchestrating AI agents), note the specifics. 2. Post a clear description of the situation without over-polishing. 3. Ask an open question such as 'what would you use?' or share your updated approach. 4. Reply thoughtfully to every useful suggestion and continue the thread if needed.",
        "frequency": "Weekly"
      },
      {
        "id": "arvidkahl-6",
        "emoji": "🤖",
        "title": "Publish Reflections on AI Devaluing Code",
        "description": "Write resonant threads exploring how agentic AI systems have changed the intrinsic value and joy of writing code, shifting focus to frameworks and orchestration.",
        "action": "1. Identify a personal experience where AI coding agents or tools made traditional code writing feel less central. 2. Open the thread with a line such as 'This is a surprisingly resonant perspective.' 3. Use analogies like cheat modes in games killing the challenge, then explain the pivot from evaluating 'is this good code' to ensuring 'the surrounding framework for any machine-generated code to run reliably'. 4. Close strongly with something like 'The act of writing code got completely devalued.' or 'What a ridiculous time to be alive.' 5. Post the thread and engage substantively with replies.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "arvidkahl-7",
        "emoji": "😂",
        "title": "Share Witty Dev Mishaps and AI Meta Takes",
        "description": "Post short, specific, humorous observations of weird dev errors and clever timely commentary on AI company news to capture attention and relatability.",
        "action": "1. Capture the exact detail of a funny or absurd situation (weird webhook response, obscure error) or a breaking AI announcement. 2. For mishaps, post a single tweet with the precise fact and amused tone: 'Someone replied to a webhook I sent with a 584 HTTP error status, and I really don't know what to do with that 🤣'. 3. For news, post a sharp question like 'Is there a prediction market on whether Anthropic will do a \"well, actually, Fable will stay on the Max plan\" tomorrow?'. 4. Post fast and jump into the replies to ride the engagement wave.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "Building podscan.fm and podline.fm in Public.",
      "Raising all the boats with kindness.",
      "Someone replied to a webhook I sent with a 584 HTTP error status, and I really don't know what to do with that 🤣",
      "Is there a prediction market on whether Anthropic will do a \"well, actually, Fable will stay on the Max plan\" tomorrow?",
      "This is a surprisingly resonant perspective."
    ],
    angles: [
      "Indie founder transparently building podcast infrastructure tools in public",
      "Philosophical observer of agentic AI fundamentally changing (and devaluing) the act of writing code",
      "Relatable humorist spotlighting the absurd specifics of webhooks, errors, and dev tooling",
      "Quick-witted meta commentator using prediction markets and pointed questions on AI company moves",
      "Pragmatic voice cutting through hype with real numbers and no-BS customer math"
    ],
    tags: [
      "indie-hacker",
      "newsletter",
      "community",
      "verified"
    ],
  },  {
    id: 'yongfook',
    handle: '@yongfook',
    xHandle: 'yongfook',
    status: 'verified',
    name: 'Jon Yongfook',
    emoji: '🐻',
    avatar: "/creators/yongfook/avatar.jpg",
    banner: "/creators/yongfook/cover.png",
    followers: 163900,
    followersStr: '164K',
    bio: '🐻 Bannerbear image generation. Bootstrapping SaaS @ $81K MRR',
    products: [
      { name: "Bannerbear", url: "https://bannerbear.com", description: "Automated image generation" },
      { name: "Browserbear", url: "https://browserbear.com", description: "Web scraping & automation" }
    ],
    pillars: [
      "Minimalist bootstrapping & high-ROI simple tools",
      "Ethical customer-first SaaS practices",
      "Personal transparency and real-life balance",
      "Idea discipline and sustained focus"
    ],
    milestones: [
      { label: "Followers", value: "163K" },
      { label: "Products", value: "Bannerbear + Browserbear" },
      { label: "Revenue", value: "$81K MRR" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/yongfook/media-1.jpg", "/creators/yongfook/media-2.jpg", "/creators/yongfook/media-3.jpg", "/creators/yongfook/media-4.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#FF6B00", secondary: "#FFFFFF", accent: "#00B4D8" },
    plays: [
      {
        "id": "yongfook-1",
        "emoji": "🐻",
        "title": "Ship-More Portfolio Honesty",
        "description": "Be transparent that big outcomes come after shipping many experiments over years, often on very basic hardware like a $1000 Macbook Air that delivered $100k MRR.",
        "action": "1. Make a simple list or image of major projects or attempts over the years. 2. Clearly mark the one winner (your current SaaS at $XXk MRR). 3. Mention the minimal setup or laptop used to build it. 4. Close with a short line like 'So... ship more' or 'Insane ROI on basic tools'. Post and refresh annually.",
        "frequency": "Yearly"
      },
      {
        "id": "yongfook-2",
        "emoji": "📈",
        "title": "Salary and MRR Chart Posts",
        "description": "Share concrete milestone numbers paired with the cheap or simple tool that made it possible, like building a multi-million dollar business on a $1000 laptop after 5 years for insane ROI.",
        "action": "1. Create a basic chart, graphic, or clean text block with your key numbers (e.g. $100k MRR, 5 years, $1000 laptop). 2. Write three short lines: the achievement, the low-cost input, 'Insane ROI.' 3. Add a punchy closer like 'I recommend you buy as many laptops as you can.' 4. Post as a standalone update.",
        "frequency": "Yearly"
      },
      {
        "id": "yongfook-6",
        "emoji": "🛡️",
        "title": "Don't Be a Dick Policy Posts",
        "description": "Turn your respectful business policies into content: free trials without credit cards, no spam or forced newsletters, and one-click cancels to prove you actually operate with a 'don't be a dick' ethos.",
        "action": "1. Choose one specific customer-friendly policy (free trial no CC, opt-in only comms, instant cancel button). 2. Start the post with 'I have strived to build my business with a \"don't be a dick\" ethos.' 3. Explain the policy in plain words and how it works in your product. 4. Include a screenshot of the UI if possible and post.",
        "frequency": "Monthly"
      },
      {
        "id": "yongfook-7",
        "emoji": "🎯",
        "title": "Perfect Idea Filter Posts",
        "description": "When a shiny 'perfect' idea appears, publicly run it through a clear 4-criteria filter and publicly recommit to staying focused on your main work.",
        "action": "1. List the four points the idea meets: spot on product-founder fit, I would use it personally, hard problem to solve (but solvable), too niche for big companies to swoop in. 2. Admit how tempting it is and that it's taking energy to ignore. 3. End the post with '(I will)' stay focused on your current product. 4. Publish it.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "I built a multi million dollar business on a $1000 Macbook Air laptop.",
      "Insane ROI. I recommend you buy as many laptops as you can.",
      "I have strived to build my business with a \"don't be a dick\" ethos.",
      "Stumbled across a pic from 7 years ago (left) on a strict no carb diet. Much happier now, normal diet (right).",
      "Damn I had one of those \"perfect\" ideas today:"
    ],
    angles: [
      "Massive outcomes from minimalist, low-cost setups and tools",
      "Differentiating your SaaS by explicitly rejecting dark patterns and spam",
      "Personal before/after stories that humanize the founder and promote balance",
      "A repeatable 4-point filter to evaluate and publicly reject distracting ideas",
      "Candid real-talk about production costs and API realities for authenticity"
    ],
    tags: [
      "indie-hacker",
      "saas",
      "verified"
    ],
  },  {
    id: 'hnshah',
    handle: '@hnshah',
    xHandle: 'hnshah',
    status: 'verified',
    name: 'Hiten Shah',
    emoji: '💼',
    avatar: "/creators/hnshah/avatar.jpg",
    banner: "/creators/hnshah/banner.jpg",
    followers: 321600,
    followersStr: '322K',
    bio: 'Founder & CEO building SaaS for 20+ yrs. Sharing what endures in business, growth & people. Built Crazy Egg (2005), KISSmetrics (2008) & Nira (2020).',
    products: [
      { name: "Crazy Egg", url: "https://crazyegg.com", description: "Heatmap & analytics tool" },
      { name: "KISSmetrics", url: "https://kissmetrics.com", description: "Analytics platform" },
      { name: "Nira", url: "https://nira.com", description: "Document security" }
    ],
    pillars: [
      "Enduring principles in business, growth & people",
      "AI-native company building with local-first software",
      "Thesis-driven positioning and full execution loops"
    ],
    milestones: [
      { label: "Followers", value: "317K" },
      { label: "Products", value: "Multiple successful SaaS" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/hnshah/media-1.jpg"],
    category: 'big-players',
    theme: { primary: "#1DA1F2", secondary: "#FFFFFF", accent: "#00C4B4" },
    plays: [
      {
        "id": "hnshah-1",
        "emoji": "⏳",
        "title": "Long-Game Principle Posts",
        "description": "Share short, high-signal observations on what endures in business, growth, people, and practical AI adoption in real company workflows.",
        "action": "Write one sharp, standalone sentence or very short paragraph that delivers a practical truth or reframing. Post it directly with no link or pitch. Use the style of: 'This is a very effective method to quickly increase AI adoption in non-technical areas of a business.'",
        "frequency": "Weekly"
      },
      {
        "id": "hnshah-2",
        "emoji": "📖",
        "title": "Full-Loop Launch Narratives",
        "description": "For Product Hunt launches and major releases, publish detailed narrative posts that trace the entire journey from founding belief to a buyable product, showing how research, positioning, demos, and AI acceleration combine with sharpened human taste.",
        "action": "1. Open by noting the pivotal shift: 'Building [Product] from -1 to revenue changed my definition of an AI-native company.' 2. Announce the launch with the Product Hunt link. 3. Explain the core belief (AI moving closer to the work; local AI feels different). 4. Detail the full sequence: thesis became positioning, positioning became a selling website, demos made the behavior obvious, launch materials made the bet legible, and the product became something people can buy. 5. Describe AI's specific contributions (audience research, angles, pages, assets, copy, story testing) and the harder part ('AI made more directions possible. That meant our taste had to get sharper.'). 6. State the lesson: 'AI-native company building is about shortening the distance between learning and shipping.' Briefly map the loop. 7. Describe the product plainly (AI autocomplete that runs locally, offline, across Mac apps, keeps your writing and voice on device). 8. Clearly state your two beliefs. 9. End with direct invitation: 'We’re live on Product Hunt today. I would love for you to take a look and tell us what you think.'",
        "frequency": "Quarterly"
      },
      {
        "id": "hnshah-3",
        "emoji": "🖥️",
        "title": "Overlooked AI Surface Posts",
        "description": "Name the specific, under-appreciated place or timing where AI creates the most value, then position your product as the concrete expression of that insight.",
        "action": "1. Lead with the key observation in natural prose: 'The AI surface most people are sleeping on is the computer they already use all day.' 2. Explain why context and timing matter (open apps, drafts, messages, files, visible intent). 3. Connect it to your decision: 'That is why Sam and I started with the Mac.' 4. Name the product as the direct outcome: 'Typeahead is our first product from that thesis.' Keep the post tight and idea-focused. Add video demo when possible.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "hnshah-4",
        "emoji": "✂️",
        "title": "Clip-and-Commentary Distribution",
        "description": "Post short product videos or relevant clips accompanied by one incisive framing sentence that reveals the deeper principle or product promise.",
        "action": "Create or clip a 30-60 second video showing the product behavior in a real Mac app (e.g. typing and seeing inline suggestion appear). Post the video with exactly one strong sentence of perspective or thesis framing. The line should add a point of view rather than describe the obvious action. Examples include points about staying in flow, owning your software, or keeping your voice.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "This is a very effective method to quickly increase AI adoption in non-technical areas of a business.",
      "The AI surface most people are sleeping on is the computer they already use all day.",
      "AI is going to move closer to the work.",
      "AI-native company building is about shortening the distance between learning and shipping.",
      "Typeahead is our first product from that thesis."
    ],
    angles: [
      "20+ year SaaS founder perspective on principles that endure across cycles and hype",
      "Local, offline, on-device AI that lives inside existing workflows and preserves user voice and ownership",
      "Belief-first product development: start with a clear thesis then make it legible through positioning, websites, demos and copy",
      "AI accelerates options and iteration speed; human taste, judgment and 'what sounds like us' remain the bottleneck and differentiator",
      "Transparent full-loop storytelling that educates the audience while building credibility and collecting feedback"
    ],
    tags: [
      "indie-hacker",
      "saas",
      "verified"
    ],
  },  {
    id: 'damengchen',
    handle: '@damengchen',
    xHandle: 'damengchen',
    status: 'verified',
    name: 'Damon Chen',
    emoji: '💜',
    avatar: "/creators/damengchen/avatar.jpg",
    banner: "/creators/damengchen/cover.png",
    followers: 92900,
    followersStr: '93K',
    bio: '💜 https://t.co/yyLfH8mOar 📚 https://t.co/ZzTStsMvdh 🎤 https://t.co/T70J8MBCS3 👌 https://t.co/khvGOizgE7 📧 https://t.co/Vo4zfOutHL 🤖 https://t.co/k4qbEQtDdI',
    products: [],
    pillars: [
      "Indie hacking & product building",
      "Vibe coding on the go",
      "Travel stories & observations from China and Hong Kong"
    ],
    milestones: [
      { label: "Followers", value: "93K" },
      { label: "Posts", value: "Unknown" },
      { label: "Product", value: "Multiple tools" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/damengchen/media-1.jpg", "/creators/damengchen/media-2.jpg", "/creators/damengchen/media-3.jpg", "/creators/damengchen/media-4.jpg", "/creators/damengchen/media-5.jpg", "/creators/damengchen/media-6.jpg", "/creators/damengchen/media-7.jpg", "/creators/damengchen/media-8.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#8B5CF6", secondary: "#FFFFFF", accent: "#EC4899" },
    plays: [
      {
        "id": "damengchen-1",
        "emoji": "📦",
        "title": "Announce product features with direct links",
        "description": "Post short, high-signal updates when shipping meaningful capabilities, exactly like the MCP server announcement for PDFgen.",
        "action": "1. Complete a real feature, integration, or milestone in one of your products. 2. Write one clear sentence: \"[Product] now has [feature]\" or \"Just submitted [Product] on [platform]\". 3. Add the link on its own line using 👉 https://.... 4. Attach a screenshot or photo if it shows the feature well. 5. Post as a standalone tweet with zero extra commentary.",
        "frequency": "Weekly"
      },
      {
        "id": "damengchen-2",
        "emoji": "🚆",
        "title": "Post vibe coding moments while traveling",
        "description": "Share authentic, low-friction updates of coding during plane delays, train rides, and transit to humanize the work and create highly engaging, relatable posts.",
        "action": "1. Actually open your laptop or code on the plane, train, or during a delay. 2. Note the exact situation in 1-2 sentences. 3. Include the transport or location emoji (🚆, 🇭🇰, ✈️) and a light 😅 if it fits. 4. Post short and direct: \"vibe coding on 🚆\" or \"A short stay in 🇭🇰, plane delayed so I got another 30 minutes to code. How I wish the plane has Starlink installed 😅\". 5. Add a photo of the scene when natural.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "damengchen-3",
        "emoji": "🚄",
        "title": "Write reflective single-tweet travel stories",
        "description": "Craft longer, narrative posts that blend the current journey with personal history, infrastructure changes, and small delightful details, modeled on the sleeper train tweet.",
        "action": "1. On a meaningful trip (sleeper train, cross-city travel), start a note while moving. 2. Open with the present action: \"Taking the sleeper train to Hong Kong right now.\" 3. Add contrast to the past (\"Last time I took a sleeper was back in college...\") and the surreal feeling (\"Still feels a bit surreal that I can leave Shanghai, sleep through the night, and wake up in Hong Kong.\"). 4. Include 1-2 specific vivid details (gadgets, \"glasses rack\", ambient light). 5. Close with light humor and 😅. 6. Attach 3-4 photos of the bunk or view. 7. Post as one tweet.",
        "frequency": "Monthly"
      },
      {
        "id": "damengchen-4",
        "emoji": "🚇",
        "title": "Share hyper-specific micro travel moments",
        "description": "Capture precise, almost literal daily transit situations to feel real and \"Very Hongkong\" — the opposite of polished advice content.",
        "action": "1. Notice a small, tense, or funny commute moment (barely making the doors, backpack incident, last person on). 2. Describe it exactly as it happened using vivid specific language. 3. Add a short cultural tag if it fits: \"Very Hongkong 🇭🇰\". 4. Keep it to 1-3 short lines. 5. Post with minimal or no extra emojis or hashtags.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "vibe coding on 🚆",
      "PDFgen now has an MCP server 👉 https://pdfgen.com/mcp",
      "Taking the sleeper train to Hong Kong right now.",
      "A short stay in 🇭🇰, plane delayed so I got another 30 minutes to code.",
      "Just made it onto the subway as the literal last person physically possible."
    ],
    angles: [
      "The indie hacker who literally codes on planes, trains, and during delays",
      "No-fluff, direct product announcements for practical AI/developer tools",
      "Nostalgic yet amazed storytelling about China's high-speed rail and infrastructure progress",
      "Hyper-specific, lived micro-moments of travel and daily hustle instead of generic advice",
      "Multi-product builder focused on real PDF and AI tooling (PDFgen, PDF.ai)"
    ],
    tags: [
      "indie-hacker",
      "verified"
    ],
  },  {
    id: 'flaviocopes',
    handle: '@flaviocopes',
    xHandle: 'flaviocopes',
    status: 'verified',
    name: 'Flavio Copes',
    emoji: '📘',
    avatar: "/creators/flaviocopes/avatar.jpg",
    banner: "/creators/flaviocopes/banner.jpg",
    followers: 63700,
    followersStr: '64K',
    bio: 'https://t.co/tYSHvoTwKp https://t.co/rrFY2acUpi https://t.co/3bQ2dVbPHs',
    products: [],
    pillars: [
      "Developer education & tutorials",
      "Web framework and tooling insights",
      "Build-in-public vlogs and feature updates",
      "Developer mindset and iteration advice"
    ],
    milestones: [
      { label: "Followers", value: "64K" },
      { label: "Posts", value: "Unknown" },
      { label: "Product", value: "Educational content & courses" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/flaviocopes/media-1.jpg", "/creators/flaviocopes/media-2.jpg", "/creators/flaviocopes/media-3.jpg", "/creators/flaviocopes/media-4.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#3B82F6", secondary: "#FFFFFF", accent: "#10B981" },
    plays: [
      {
        "id": "flaviocopes-1",
        "emoji": "📝",
        "title": "Daily Tutorial Drop",
        "description": "Publish one short, problem-first tutorial tied to a tool developers are actively adopting or a recent framework update.",
        "action": "Write a 600-900 word post with a working code snippet, publish on flaviocopes.com/blog, and share the headline plus one takeaway on X with a link.",
        "frequency": "Daily"
      },
      {
        "id": "flaviocopes-4",
        "emoji": "🛠️",
        "title": "Hands-On Tool Review",
        "description": "Test emerging dev tools and frameworks in public. Document specific features and benefits with direct quotes and observations.",
        "action": "Ship a 'hands-on guide' post (e.g. feature from Astro or agent frameworks), include screenshots or CLI output, quote the exact benefit, and thread 5 numbered steps on X.",
        "frequency": "Weekly"
      },
      {
        "id": "flaviocopes-5",
        "emoji": "🧱",
        "title": "AHA Stack Evangelism",
        "description": "Promote the AHA Stack (Astro, HTMX, Alpine) as a pragmatic alternative to heavy SPA stacks for indie builders by spotlighting real improvements.",
        "action": "Publish one comparison or starter template, tag relevant communities when an update lands (e.g. Astro 7), and link to ahastack.dev from every related tutorial for 30 days.",
        "frequency": "Weekly"
      },
      {
        "id": "flaviocopes-6",
        "emoji": "🎥",
        "title": "Numbered Vlog Feature Updates",
        "description": "Document and hype product development with a recurring numbered vlog series focused on shipping a ton of new features.",
        "action": "Record a short video walking through recently shipped features. Post the video on X with caption 'vlog #N a ton of new features'. Include links to flaviocopes.com or bootcamp.dev and reply to comments with details.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "Astro 7 \"if an agent tries to start a second server, it gets back the existing instance’s details instead of spawning a conflicting process\" 😌",
      "vlog #9 a ton of new features",
      "just start and get in motion and iterate",
      "New Commodore phone? 🤯"
    ],
    angles: [
      "Spotlighting satisfying, specific improvements in web frameworks and dev tools",
      "Serial numbered vlogs that turn feature shipping into a transparent public journey",
      "Ultra-short, high-signal mindset statements that prompt devs to take action now",
      "Genuine excitement bridging modern tooling and retro computing culture",
      "Leveraging X engagement to funnel followers to educational content and bootcamps"
    ],
    tags: [
      "indie-hacker",
      "dev-advocate",
      "verified"
    ],
  },  {
    id: 'thepatwalls',
    handle: '@thepatwalls',
    xHandle: 'thepatwalls',
    status: 'verified',
    name: 'Pat Walls',
    emoji: '🚀',
    avatar: "/creators/thepatwalls/avatar.jpg",
    banner: "/creators/thepatwalls/cover.png",
    followers: 141100,
    followersStr: '141K',
    bio: 'https://t.co/zSf5Z2H78P https://t.co/ryMAyS77qn On a mission to inspire 1B people to build stuff!',
    products: [],
    pillars: [
      "Inspire people to build stuff",
      "AI-powered micro-SaaS and weekend projects",
      "Deep work consistency for side builders",
      "Open source AI and cost-saving tool switches"
    ],
    milestones: [
      { label: "Followers", value: "141K" },
      { label: "Posts", value: "Unknown" },
      { label: "Product", value: "Maker community projects" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/thepatwalls/media-1.jpg", "/creators/thepatwalls/media-2.jpg", "/creators/thepatwalls/media-3.jpg", "/creators/thepatwalls/media-4.jpg", "/creators/thepatwalls/media-5.jpg"],
    category: 'indie-hackers',
    theme: { primary: "#FF5A00", secondary: "#FFFFFF", accent: "#00C4B4" },
    plays: [
      {
        "id": "thepatwalls-1",
        "emoji": "🧠",
        "title": "Share Your Daily Deep Work Routine Story",
        "description": "Post personal, specific stories of doing 2 hours of focused side work every day while holding a full-time job. This resonates because it proves consistency over intensity and gives followers an exact template they can start tomorrow.",
        "action": "1. Choose a real multi-month streak of daily deep work on your own project.\n2. Open with the hook: \"I changed my life by just doing 2 hrs of deep work EVERY DAY for a year.\"\n3. Paint the picture in 3 sentences: wake-up time, coffee shop grind for tiny progress on business, then full-time job.\n4. Keep the whole post short and authentic.\n5. Add a photo of your setup or a simple visual.\n6. Engage replies by asking what their daily block looks like.",
        "frequency": "Monthly"
      },
      {
        "id": "thepatwalls-2",
        "emoji": "🛠️",
        "title": "Publish the AI Micro-Micro SaaS Weekend Blueprint",
        "description": "Create a highly actionable checklist post teaching how to pick one feature from a $1B company and build a tiny version using AI tools (Claude/Grok + Cursor etc). This is proven to drive high engagement, bookmarks, and replies from builders ready to ship.",
        "action": "1. Identify one tiny single-feature idea inspired by a large successful company.\n2. Start the tweet: \"i've got your last 6 months of the year plans right here:\"\n3. List the steps using > blockquotes for visual scannability:\n> block off 4 hours of your weekend\n> pick a $1b company\n> build a micro-micro version of it\n> like one-single feature\n> open claude/chatgpt/grok + cursor/windsurf, etc.\n> type \"i'm a noob. i wanna build something like this. guide me 1 step at time\"\n> copy/paste into cursor\n> follow steps until it works\n4. Close strongly: \"voilà, you just built your first micro-saas\"\n5. Reply to your own post (or quote tweet) with a link to a database of real examples or projects.\n6. Post late in the week so people can execute over the weekend.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "thepatwalls-3",
        "emoji": "💸",
        "title": "Share a Specific Open Source AI Tool Migration",
        "description": "Tell the true story of cancelling a paid subscription and switching to a free, local, open source alternative that is better. Positions you as practical and bullish on the future of accessible tools while delivering high relatability and saves.",
        "action": "1. Select one paid tool (ideally $10-20/mo) you actually replaced with open source/local AI.\n2. Lead the post with: \"I'm bullish on open source AI.\"\n3. Briefly state the old cost and tool name.\n4. Explain the switch: download model, runs locally, and results in \"better, faster, more private, and it's free!\"\n5. End with the open question: \"I wonder what other subscriptions I can get rid of?\"\n6. Include a screenshot of the new tool in use for credibility.\n7. Monitor and reply to comments with more tool suggestions.",
        "frequency": "Monthly"
      },
      {
        "id": "thepatwalls-4",
        "emoji": "🔭",
        "title": "Frame Big Tech News as 'We Are Still So Early'",
        "description": "When major AI or startup news drops (big valuations, acquisitions, model launches), publish a tight roundup list followed by the grounding perspective that the real opportunity is still ahead. Occasionally layer in the 'ignore the haters' proof of impact message.",
        "action": "1. Collect 3-4 actual headline events from the last few weeks.\n2. Format cleanly as:\n> Lovable hit $500M in June.\n> Cursor got acquired for $60B.\n> ...\n3. Follow with: \"All of this happened THIS MONTH!! We are still so early.\"\n4. Use a supporting image (collage or bold graphic).\n5. As a companion or alternate post: \"try caring less about what strangers think about you on the internet one time a reddit mob created an actual petition to ban me and it got hundreds of upvotes nobody remembers it. my products have impacted millions\"\n6. Publish when news is fresh for maximum relevance and discussion.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "i've got your last 6 months of the year plans right here:",
      "I'm bullish on open source AI.",
      "I changed my life by just doing 2 hrs of deep work EVERY DAY for a year.",
      "We are still so early.",
      "try caring less about what strangers think about you on the internet"
    ],
    angles: [
      "Anyone can build their first micro-SaaS this weekend by cloning one feature with AI step-by-step",
      "Open source local AI tools are already superior to paid subscriptions on every metric that matters",
      "Small daily deep work sessions (while employed) are the real path to changing your life",
      "Explosive industry headlines mean the best building opportunities are still in front of us",
      "Online noise and criticism is temporary; shipped products and real user impact are permanent"
    ],
    tags: [
      "indie-hacker",
      "community",
      "buildinpublic",
      "verified"
    ],
  },  {
    id: 'biilmann',
    handle: '@biilmann',
    xHandle: 'biilmann',
    status: 'verified',
    name: 'Matt Billman (Mathias Biilmann)',
    emoji: '🌐',
    avatar: "/creators/biilmann/avatar.jpeg",
    banner: "/creators/biilmann/banner.jpg",
    followers: 12800,
    followersStr: '12.8K',
    bio: 'CEO and Co-founder of Netlify. Builder of things, coiner of terms.',
    products: [
      { name: "Netlify", url: "https://netlify.com", description: "Modern web development & deployment platform" }
    ],
    pillars: [
      "Hands-on Agent Runners prototyping and fun apps",
      "Live events, competitions and tech demos",
      "Developer experience, AX and platform vision"
    ],
    milestones: [
      { label: "Followers", value: "12.8K" },
      { label: "Products", value: "Netlify (co-founder)" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/biilmann/media-1.jpg", "/creators/biilmann/media-2.jpg", "/creators/biilmann/media-3.jpg", "/creators/biilmann/media-4.jpg"],
    category: 'netlify-shippers',
    theme: { primary: "#00C4B4", secondary: "#FFFFFF", accent: "#FF5A00" },
    plays: [
      {
        "id": "biilmann-5",
        "emoji": "🔧",
        "title": "Builder-on-the-Metal Experiment",
        "description": "Share personal builds and quick experiments whipped up with Agent Runners (personality tests, live decks) to stay credible as a hands-on CEO and builder of things.",
        "action": "1. Whip up a small public experiment or fun app (e.g. one-question personality test or presentation deck) using Agent Runners. 2. Deploy instantly to Netlify. 3. Post with a casual excited opener like 'It’s Hot App Summer!' or 'DevWorld tech check this morning' plus screenshot and link. 4. Note that it was built with agent runners. 5. Reply to comments and shares.",
        "frequency": "Weekly"
      },
      {
        "id": "biilmann-2",
        "emoji": "⚡",
        "title": "Shortest-Path Shipping Demo",
        "description": "Show how Netlify (with Agent Runners) minimizes steps from idea or agent input to a live production URL, mirroring the original DX growth engine.",
        "action": "1. Execute or capture a real flow from prompt/idea to deployed site using Agent Runners or Netlify (e.g. during a competition build). 2. Document the steps or time taken. 3. Post the live link, any metrics (sites/day, speed gains), and a short story. 4. Link to relevant Netlify agent or DX pages.",
        "frequency": "Weekly"
      },
      {
        "id": "biilmann-4",
        "emoji": "🎤",
        "title": "Conference & Partner Story",
        "description": "Amplify participation in stage talks, game shows and events that reinforce Netlify as the platform for fast shipping and composable web.",
        "action": "1. Participate in events like Greenfield Games or live tech checks, building with Agent Runners on stage or in competition. 2. Tease going live. 3. After, post a recap thread with 'How did we fare?', 3 takeaways, what was built, screenshots or replay link. 4. Tag co-builders, hosts and @Netlify.",
        "frequency": "Monthly"
      },
      {
        "id": "biilmann-6",
        "emoji": "💡",
        "title": "If Netlify Built Positioning",
        "description": "Create provocative 'If Netlify built X' posts and visuals to position Netlify as the ideal modern platform for popular dev tools and workflows.",
        "action": "1. Identify a popular tool or experience (e.g. GitHub). 2. Create a mock, concept image or visual of the Netlify version. 3. Post the visual with the direct hook 'If Netlify built GitHub'. 4. Add a thread explaining DX/AX/speed benefits and link to Netlify. 5. Engage replies to expand the vision.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "It’s Hot App Summer! Here’s a fun one I just whipped up with agent runners:",
      "DevWorld tech check this morning. Going live in 10 with my first deck built as a web app with Agent Runners.",
      "This is so freaking cool! Go read the post and give those LEDs a shake!",
      "If Netlify built GitHub",
      "I joined @jlengstorf's Greenfield Games show with Dana Lawson and @jherr to compete with 2 other teams, building Notion in 6 hours. ... How did we fare?"
    ],
    angles: [
      "The hands-on CEO who still whips up and ships experiments in public",
      "Agent Runners as the superpower for instant fun apps, decks and competition builds",
      "Live event participation as authentic product demonstration",
      "Provocative 'what if' positioning that reimagines tools through Netlify's lens",
      "Enthusiastic amplification of community and team Netlify builds"
    ],
    tags: [
      "netlify",
      "dev-advocate",
      "saas",
      "verified"
    ],
  },  {
    id: 'nousresearch',
    handle: '@NousResearch',
    xHandle: 'NousResearch',
    status: 'verified',
    name: 'Nous Research',
    emoji: '🧠',
    avatar: "/creators/nousresearch/avatar.jpg",
    banner: "/creators/nousresearch/banner.jpg",
    followers: 229300,
    followersStr: '229K',
    bio: 'A bunch of nerds making progress toward open source AI https://t.co/vrD0aDJeto',
    products: [
      { name: "Hermes models & agents", url: "https://nousresearch.com", description: "Open-source AI models & agents" }
    ],
    pillars: [
      "Hermes Agent Releases & Features",
      "Performance & Efficiency Breakthroughs",
      "Model Integrations & Accessibility",
      "Extensibility & Plugin Integrations"
    ],
    milestones: [
      { label: "Followers", value: "219K" },
      { label: "Products", value: "Hermes AI models" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/nousresearch/media-1.jpg", "/creators/nousresearch/media-2.jpg", "/creators/nousresearch/media-3.png", "/creators/nousresearch/media-4.jpg", "/creators/nousresearch/media-5.jpg", "/creators/nousresearch/media-6.jpg"],
    category: 'big-players',
    theme: { primary: "#6366F1", secondary: "#FFFFFF", accent: "#EC4899" },
    plays: [
      {
        "id": "nousresearch-1",
        "emoji": "🚀",
        "title": "Themed Version Releases",
        "description": "Announce Hermes Agent major versions using memorable codenames paired with complete changelogs to drive engagement and showcase consistent progress.",
        "action": "1. Give the version a thematic codename like 'The Judgement Release'. 2. Open the post with 'Hermes Agent v0.18.0 - The Judgement Release'. 3. Post or thread the full changelog right after. 4. Call out the most impactful changes for users. 5. Include media or video of the new behavior when possible.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "nousresearch-2",
        "emoji": "📊",
        "title": "Benchmark & Leaderboard Update",
        "description": "Publish specific benchmark comparisons showing how Hermes Agent's MoA virtual models and updates outperform or match gated frontier models.",
        "action": "1. Reference the latest benchmark results. 2. Lead with clear superiority numbers (e.g. '8% higher than Opus 4.8 and 11% higher than GPT 5.5'). 3. Explain the MoA preset virtual model approach. 4. Include context on capabilities like reasoning and tool-calling. 5. Invite the community to test and share results.",
        "frequency": "Weekly"
      },
      {
        "id": "nousresearch-3",
        "emoji": "⚡",
        "title": "Quantified Efficiency Wins",
        "description": "Highlight extreme real improvements in speed and cost for Hermes Agent features to prove practical advantages for users running agents daily.",
        "action": "1. Pick a concrete win such as web reading '60x faster and 49x cheaper'. 2. Start the tweet with the exact claim and numbers. 3. Explain the simple mechanism (clean scraping backends, local paging on demand). 4. Tie directly to agent productivity. 5. Add a short video or example if it illustrates the gain.",
        "frequency": "Weekly"
      },
      {
        "id": "nousresearch-4",
        "emoji": "🔌",
        "title": "New Integration & Plugin Announcements",
        "description": "Spotlight new extensibility features like the vault plugin API and multi-provider support to attract power users and developers.",
        "action": "1. Announce the feature clearly: 'New in Hermes Agent: pull secrets from multiple vaults at once.' 2. List the supported providers (Bitwarden and 1Password) and mention the plugin API. 3. Show the practical agent use case. 4. Encourage custom plugins. 5. Reply with setup tips or a short demo.",
        "frequency": "Weekly"
      },
      {
        "id": "nousresearch-5",
        "emoji": "🧠",
        "title": "Research Progress & Feature Threads",
        "description": "Share detailed, replicable updates on agent capabilities and model integrations in a transparent, low-hype style that matches the 'nerds making progress' ethos.",
        "action": "1. Focus on one major improvement or integration (e.g. Hy3 model or web backend). 2. Open with the benefit and specifics (model size, strengths, cost/access). 3. Add context like 'focused on cost-effective agentic use'. 4. Provide direct link or access instructions (Nous Portal). 5. Use a thread or media for deeper details.",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "A bunch of nerds making progress toward open source AI",
      "New in Hermes Agent: pull secrets from multiple vaults at once.",
      "Hermes Agent v0.18.0 - The Judgement Release",
      "Hermes Agent now reads the web up to 60x faster and 49x cheaper.",
      "The strongest models are gated and access is granted only to a select few."
    ],
    angles: [
      "Ship named releases with full changelogs for transparency and personality",
      "Lead with hard numbers on speed, cost, and benchmark gains",
      "Democratize gated frontier performance using open MoA orchestration",
      "Focus on practical developer integrations that solve real agent pain points",
      "Temporarily open powerful new models to drive adoption and feedback"
    ],
    tags: [
      "ai-agents",
      "ai-shipper",
      "verified"
    ],
  },  {
    id: 'teknium',
    handle: '@Teknium',
    xHandle: 'Teknium',
    status: 'verified',
    name: 'Teknium',
    emoji: '🪽',
    avatar: "/creators/teknium/avatar.jpg",
    banner: "/creators/teknium/banner.jpg",
    followers: 105336,
    followersStr: '105K',
    bio: 'Cofounder and Lead Engineer - Hermes Agent @NousResearch, prev @StabilityAI. Github + HuggingFace links in bio.',
    products: [
      { name: "Hermes Agent", url: "https://nousresearch.com", description: "AI agent work at Nous Research" }
    ],
    pillars: [
      "Hermes Agent Feature Updates",
      "Session Data Control & Exports",
      "Integrations & Plugin Ecosystem"
    ],
    milestones: [
      { label: "Followers", value: "105K" },
      { label: "Products", value: "Hermes models/agents" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/teknium/media-1.jpg", "/creators/teknium/media-2.jpg", "/creators/teknium/media-3.jpg", "/creators/teknium/media-4.jpg"],
    category: 'big-players',
    theme: { primary: "#8B5CF6", secondary: "#FFFFFF", accent: "#00C4B4" },
    plays: [
      {
        "id": "teknium-1",
        "emoji": "🚀",
        "title": "Ship Feature Update Threads",
        "description": "Post detailed, benefit-driven updates when shipping new Hermes Agent capabilities for session pruning, archiving, and multi-format exports including direct HF repo uploads.",
        "action": "1. Pick a recently shipped capability (pruning filters or export). 2. Start the post with phrasing like 'Big update to managing your past sessions in Hermes Agent.' or 'Hermes Agent can now export...'. 3. List the specific filters or export options (timeframes, models, users, working directory, conversation source, HTML/Markdown/JSON/HF). 4. Highlight user gains like full control without data loss. 5. Close with the exact command: `hermes update`. 6. Include relevant image or list and engage replies.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "teknium-2",
        "emoji": "🤖",
        "title": "Hermes Agent Capability Demo",
        "description": "Demonstrate concrete usage of new features such as exporting sessions or pruning with filters to illustrate real value for users running agents in production or via integrations.",
        "action": "1. Execute or simulate a session workflow in Hermes Agent. 2. Use pruning filters to clean by model/date/source or export a conversation set. 3. Capture the result (logs, exported file preview, HF upload confirmation). 4. Post a clear demo post or thread showing before/after or the command flow. 5. Mention `hermes update`, link to resources or docs, and note supported sources like cronjob or telegram.",
        "frequency": "Weekly"
      },
      {
        "id": "teknium-3",
        "emoji": "📦",
        "title": "HF/GitHub Release Cadence",
        "description": "Ship frequent Hermes Agent tool improvements and data export features while encouraging fast adoption and HF-based sharing of user-generated session datasets.",
        "action": "1. Announce the latest update that enables exports or pruning. 2. Detail the new formats (HTML, Markdown, JSON) and 'upload entire datasets of your sessions to private @huggingface repos with ease'. 3. List available filters for selecting what to export. 4. Direct users to run `hermes update`. 5. Tag or mention downstream users and reference GitHub or Hugging Face.",
        "frequency": "Weekly"
      },
      {
        "id": "teknium-4",
        "emoji": "🔌",
        "title": "Community Plugin Interface Expansion",
        "description": "Publicly invite suggestions to expand plugin interfaces, enabling more developers to build and publish stable features, fixes, and layers independently of core merges.",
        "action": "1. Open with context (e.g. holiday or milestone note). 2. State the intent: expand plugin interface so developers with waiting PRs 'can implement stable changes that they can share and publish without having to worry about getting their feature etc merged'. 3. Explain plugin possibilities (features, fixes, security layers). 4. Ask directly: 'If you have ideas for an expanded plugin interface that should be implemented, please reply in the thread of this post!' 5. Set expectation for follow-up action in a week or so. 6. Later share implemented ideas and credit contributors.",
        "frequency": "Monthly"
      },
      {
        "id": "teknium-5",
        "emoji": "🛠️",
        "title": "Practitioner Engineering Tips",
        "description": "Share targeted tips and configuration examples for advanced controls like Discord admin-only approvals and precise session pruning to help serious users and server owners.",
        "action": "1. Choose a specific advanced setting (e.g. restricting exec approval buttons to admins on Discord or pruning by working directory). 2. Write a post explaining the option and why it matters ('rather than open access or owner-only'). 3. Link the precise docs URL. 4. Provide the practical step or command. 5. Invite questions or share how it fits different sources (cronjob, telegram).",
        "frequency": "Weekly"
      }
    ],
    hooks: [
      "Will have day zero support in Hermes Agent 🫡",
      "Hermes Agent can now export your agent sessions, or sets of sessions, into a variety of formats and places.",
      "Big update to managing your past sessions in Hermes Agent.",
      "Now Hermes Agent owners who serve it through Discord can require a user be set to an admin to approve commands blocked by the approval system, rather than open access or owner-only.",
      "We want to expand the plugin interface of Hermes Agent so that many developers who have PRs waiting for very long periods can implement stable changes..."
    ],
    angles: [
      "Benefit-first feature announcements centered on user control and concrete CLI commands",
      "Enabling full data ownership through flexible exports and safe pruning tools",
      "Production-grade integrations with role-based controls for team/server use",
      "Lowering barriers for external contributors via stable, publishable plugin interfaces",
      "Transparent iteration that surfaces exact filters, formats, and commands for immediate adoption"
    ],
    tags: [
      "ai-agents",
      "ai-shipper",
      "verified"
    ],
  },  {
    id: 'demishassabis',
    handle: '@demishassabis',
    xHandle: 'demishassabis',
    status: 'verified',
    name: 'Demis Hassabis',
    emoji: '🏆',
    avatar: "/creators/demishassabis/avatar.jpg",
    banner: "/creators/demishassabis/banner.jpg",
    followers: 1300000,
    followersStr: '1.3M',
    bio: 'Nobel Laureate. Co-Founder & CEO @GoogleDeepMind - working on AGI. Solving disease @IsomorphicLabs. Trying to understand the fundamental nature of reality.',
    products: [
      { name: "Google DeepMind", url: "https://deepmind.google", description: "AGI research & AI systems" },
      { name: "Isomorphic Labs", url: "https://isomorphiclabs.com", description: "AI for drug discovery" }
    ],
    pillars: [
      "AI for Scientific Discovery and Medicine",
      "Accessible Frontier Model Releases",
      "Mission-Driven Progress Toward AGI and Solving Disease"
    ],
    milestones: [
      { label: "Followers", value: "1.3M" },
      { label: "Products", value: "DeepMind + Isomorphic Labs" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/demishassabis/media-1.jpg"],
    category: 'big-players',
    theme: { primary: "#4285F4", secondary: "#FFFFFF", accent: "#34A853" },
    plays: [
      {
        "id": "demishassabis-1",
        "emoji": "🧬",
        "title": "Frame Every Advance as Part of the Mission to Improve Human Health",
        "description": "Anchor product and research updates in a personal, consistent belief that health is the #1 use of AI, connecting historical milestones like AlphaFold through current Isomorphic Labs work to the future goal of solving disease.",
        "action": "1. Start with the belief statement: \"I’ve always believed the No.1 application of AI should be to improve human health.\" 2. Trace the origin: \"That work started with AlphaFold, and now at @IsomorphicLabs with the mission to reimagine drug discovery and one day solve all disease!\" 3. Deliver the update (new funding, progress). 4. Use accelerating language: \"We are turbocharging that goal with $2.1B in new funding.\" 5. Tag @IsomorphicLabs and relevant accounts.",
        "frequency": "Monthly"
      },
      {
        "id": "demishassabis-2",
        "emoji": "🎉",
        "title": "Celebrate Download Milestones Alongside New Usable Model Releases",
        "description": "Pair big user adoption numbers with the launch of smaller, more accessible variants, stressing local runnability and open licensing to drive builder excitement.",
        "action": "1. Announce the milestone and simultaneous release in one sentence: \"Celebrating the milestone of a massive 150+ million downloads of Gemma 4 with the release of the new Gemma 4 12B model!\" 2. Highlight the counter-intuitive strength: \"It's incredibly powerful for such a small model\". 3. Specify hardware accessibility: \"it’s tiny enough to run locally on a laptop with just 16GB VRAM\". 4. Mention license and close positively: \"Apache 2.0 license - happy building!\"",
        "frequency": "Bi-weekly"
      },
      {
        "id": "demishassabis-3",
        "emoji": "🔮",
        "title": "Position New Capabilities as Major Leaps and Prompt User Creations",
        "description": "Announce multimodal breakthroughs by describing the input/output magic and explicitly telling followers they can feed in their own content to iterate ideas.",
        "action": "1. Lead with the claim: \"Gemini Omni is a major leap in world understanding & multimodal editing!\" 2. Explain the new power: \"It can take photos, video & audio and build entirely new scenes.\" 3. Paint the trajectory: \"Over time it’ll be able to handle any input & any output - starting w/ video.\" 4. Activate the audience: \"You can even give it your own videos & iterate on your ideas:\" 5. Include supporting visual or video examples.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "demishassabis-4",
        "emoji": "⚡",
        "title": "Use Bullet-Point Benchmarks to Prove Speed, Cost and Task Wins",
        "description": "For incremental model improvements, deliver an enthusiastic one-liner followed by scannable bullets that compare favorably to prior models and highlight real app performance plus trial instructions.",
        "action": "1. Declare: \"Gemini 3.5 Flash is amazing!\" 2. List concrete advantages as bullets: \"- Performs better than 3.1 Pro on coding & agentic tasks\", \"- 4x faster than other frontier models\", \"- 12x faster in @antigravity - 800 tokens/sec!\", \"- Often at less than half the cost\". 3. Tease roadmap: \"And Pro to come…\". 4. Drive action: \"Try it in @antigravity, @GeminiApp & more - enjoy!\"",
        "frequency": "Weekly"
      },
      {
        "id": "demishassabis-5",
        "emoji": "🙏",
        "title": "Thank Long-Term Collaborators and Elevate the Field Impact",
        "description": "After landmark results, post a warm thank-you that credits the partner and positions the work as transformative for the entire scientific community and humanity.",
        "action": "1. Address the collaborator directly and quantify the relationship: \"Thanks John for an extraordinary partnership and wonderful collaboration over the past 9 years!\" 2. State the outcome at scale: \"What we achieved with AlphaFold changed the world\". 3. Broaden the lesson: \"and showed the field what was possible with AI for science and medicine\". 4. End with purpose: \", lighting the way for how AI can benefit humanity.\"",
        "frequency": "Quarterly"
      }
    ],
    hooks: [
      "I’ve always believed the No.1 application of AI should be to improve human health.",
      "What we achieved with AlphaFold changed the world, and showed the field what was possible with AI for science and medicine, lighting the way for how AI can benefit humanity.",
      "Gemini Omni is a major leap in world understanding & multimodal editing!",
      "Trying to understand the fundamental nature of reality.",
      "Celebrating the milestone of a massive 150+ million downloads of Gemma 4"
    ],
    angles: [
      "Nobel Laureate who publicly drives product velocity at Google DeepMind",
      "Consistent narrative arc from AlphaFold to solving all disease via Isomorphic Labs",
      "Emphasizing surprising accessibility (local VRAM, cost, speed) for frontier-class models",
      "Visionary statements always grounded by specific metrics or demonstrated capabilities",
      "Public gratitude that amplifies team and partnership contributions to humanity-level goals"
    ],
    tags: [
      "ai-agents",
      "verified"
    ],
  },  {
    id: 'karpathy',
    handle: '@karpathy',
    xHandle: 'karpathy',
    status: 'verified',
    name: 'Andrej Karpathy',
    emoji: '🤖',
    avatar: "/creators/karpathy/avatar.jpg",
    banner: "/creators/karpathy/banner.jpg",
    followers: 3200000,
    followersStr: '3.2M',
    bio: 'I like training large deep neural nets.',
    products: [],
    pillars: [
      "AI infrastructure engineering & efficiency",
      "Generative AI: fusing code, knowledge and interactivity",
      "LLM product paradigms and team integration",
      "Precise technical commentary on AI progress"
    ],
    milestones: [
      { label: "Followers", value: "3.1M" },
      { label: "Posts", value: "Unknown" },
      { label: "Product", value: "Educational content & research" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/karpathy/media-1.jpg", "/creators/karpathy/media-2.jpg", "/creators/karpathy/media-3.png"],
    category: 'big-players',
    theme: { primary: "#000000", secondary: "#FFFFFF", accent: "#FF0000" },
    plays: [
      {
        "id": "karpathy-1",
        "emoji": "🧵",
        "title": "Long-Form Insight Thread",
        "description": "Explain a surprising model capability leap, engineering detail or paradigm shift from first principles in a numbered thread that mixes precise technical observation with genuine wonder.",
        "action": "1. Pick a recent AI demo, model release or infra post. 2. Draft a 6-12 tweet thread that opens with specific appreciation, calls out 2-3 concrete details (meshes, transforms, low voltage domains, integrations), explains the qualitative leap, and closes with forward-looking speculation. 3. Post the thread, pin it, and engage the best replies for 48 hours.",
        "frequency": "Weekly"
      },
      {
        "id": "karpathy-2",
        "emoji": "💻",
        "title": "Minimal Repo Drop",
        "description": "Release tiny, readable repos that teach core ideas by showing working code and demonstrate the fusion of knowledge with practical implementation.",
        "action": "1. Build or significantly update a minimal, self-contained educational repo. 2. Write a clean README focused on one key insight. 3. Tweet the link with a short post highlighting a surprising implementation detail and 2-3 line clone-and-run instructions. 4. Reply to engaged followers with follow-up tips.",
        "frequency": "Monthly"
      },
      {
        "id": "karpathy-3",
        "emoji": "🔍",
        "title": "Engineering Wizardry Spotting",
        "description": "Highlight the impressive, often counter-intuitive engineering realities behind frontier AI (tokens/watt maxxing, cluster scale memory, voltage domains) using memorable analogies.",
        "action": "1. Find an announcement about LLM training, inference hardware or efficiency. 2. Craft a reply or post that names 1-2 specific feats. 3. Add a strong analogy (e.g. 'engineering at the opposite regime to power transmission lines'). 4. Post with precise, curious tone once per week.",
        "frequency": "Weekly"
      },
      {
        "id": "karpathy-4",
        "emoji": "🔄",
        "title": "Paradigm Framing Breakdown",
        "description": "Articulate when a new AI product or integration represents a fundamental shift in how LLMs join human teams and workflows, distinguishing real 'it actually works' systems from superficial wrappers.",
        "action": "1. Deeply explore a deeply integrated AI coding or collaboration tool. 2. Write a post or detailed reply that labels the old paradigms (website you visit, app you download) vs the new one (persistent, async, org-wide entity with tools and context). 3. Explain the under-the-hood engineering required to make it 'just work'. 4. Describe the resulting change in how people actually work (e.g. 'I work from Slack now').",
        "frequency": "Bi-weekly"
      }
    ],
    hooks: [
      "I like training large deep neural nets.",
      "Agree, it's beautiful, top tier fablemaxxing! :)",
      "incredible, ty for putting this together, i didn't appreciate that models would be able to create these awesome, rich, playable worlds...",
      "Congrats!! I was impressed to learn about some of the engineering wizardry...",
      "The basic idea is easy and v0 is a hackathon project. The product here is a lot closer to *it actually works*...",
      "This is a new paradigm for interacting with Claude that is significantly more \"inline\" with all the other human activity org-wide."
    ],
    angles: [
      "Calling out tiny, specific delightful details that prove genuine model understanding",
      "Using memorable 'opposite regime' style analogies to explain infrastructure realities",
      "Naming clear evolutionary paradigms in LLM interfaces and how teams work with them",
      "Distinguishing superficial demos from deeply engineered, production-grade integrations",
      "Pairing precise technical enthusiasm with forward-looking curiosity about +1 tiers"
    ],
    tags: [
      "ai-shipper",
      "verified"
    ],
  },  {
    id: 'stabilityai',
    handle: '@StabilityAI',
    xHandle: 'StabilityAI',
    status: 'verified',
    name: 'Stability AI',
    emoji: '🎨',
    avatar: "/creators/stabilityai/avatar.png",
    banner: "/creators/stabilityai/banner.jpg",
    followers: 258100,
    followersStr: '258K',
    bio: 'We’ll help you make it like nobody’s business. Multimodal media generation and editing tools to get your idea to production.',
    products: [
      { name: "Stable Diffusion & multimodal tools", url: "https://stability.ai", description: "Open generative AI models for media" }
    ],
    pillars: [
      "Stable Audio & Generative Model Releases",
      "Community Fine-Tunes, Challenges & Integrations",
      "Brand-First Creative Platforms",
      "Storytelling Empowerment & Accessibility"
    ],
    milestones: [
      { label: "Followers", value: "258K" },
      { label: "Products", value: "Stable Diffusion family" },
      { label: "Revenue", value: "Unknown" },
      { label: "Newsletter", value: "Unknown" }
    ],
    media: ["/creators/stabilityai/media-1.jpg", "/creators/stabilityai/media-2.jpg"],
    category: 'big-players',
    theme: { primary: "#00B4D8", secondary: "#FFFFFF", accent: "#FF6B00" },
    plays: [
      {
        "id": "stabilityai-1",
        "emoji": "🚀",
        "title": "Launch New Model Families with Structured Feature Lists",
        "description": "Drive engagement and trial by announcing open-weight models with clear benefits around ownership, capabilities, data licensing, and customization paths, like the Stable Audio 3.0 rollout.",
        "action": "1. Open with a strong hook: 'Meet Stable Audio 3.0, the open-weight model family built for artistic experimentation.' 2. Follow immediately with an invitation: 'This is our open invitation to experiment with generative audio. We believe the best innovations are still waiting to be built.' 3. Use a bulleted list with emojis (📣 🎵 ✅ 🎨) to detail key points: You own your outputs and can commercialize under the Stability AI Community License (up to $1 million in revenue); New capabilities include variable-length generation up to six minutes and full song composition on portable devices, no GPU required; Trained on a fully licensed dataset; Customize the models on your own library with LoRa training support and documentation. 4. Close with 'More on the models 👇' linking to more info or a comparison post. 5. Follow up separately: 'Compare the Stable Audio 3.0 family, four new models designed for different use cases and deployment options.'",
        "frequency": "Quarterly"
      },
      {
        "id": "stabilityai-2",
        "emoji": "🎵",
        "title": "Amplify Community Fine-Tunes and Hackathon Wins",
        "description": "Showcase third-party or community projects that extend the models, such as cultural fine-tunes and plugin builds, to prove real-world value and encourage more participation.",
        "action": "1. Lead with a niche-specific hook: 'Most AI audio models have never heard a maqam.' 2. Credit the team and describe the win: 'Team Motif fine-tuned Stable Audio 3.0 on Arabic maqam, built an Ableton plugin for microtonal style transfer, and won our Stable Audio 3.0 Challenge at Music Hackspace running locally on device.' 3. Drive views: 'Watch Jad Al Masri break it down 👇' and include the video or demo link. 4. Reinforce accessibility: Note it runs locally on device. 5. Boost by engaging with and resharing the original creator content.",
        "frequency": "Monthly"
      },
      {
        "id": "stabilityai-3",
        "emoji": "🏢",
        "title": "Position Brand Studio as the Brand-First Alternative",
        "description": "Educate the audience on why generic AI tools fail brands and introduce the solution that puts brand identity at the center of creative production.",
        "action": "1. Start exactly like: 'Your brand is an afterthought for out-of-the-box AI tools. Of course it is. They weren’t built for you, they were built for everyone.' 2. Build desire: 'You deserve a creative production platform that puts your brand first, exactly how you envisioned.' 3. Announce: 'Introducing Brand Studio by Stability AI, the creative production platform powered by your brand.' 4. Direct the audience: 'Get started here:' and paste the product URL. 5. Use supporting visuals or case examples if available.",
        "frequency": "Bi-weekly"
      },
      {
        "id": "stabilityai-4",
        "emoji": "🌍",
        "title": "Articulate Big Problems and Company Mission via Narrative",
        "description": "Use high-impact storytelling to connect product capabilities to universal creator struggles, featuring leadership to build authority and emotional connection.",
        "action": "1. Open dramatically: 'The Storyteller’s Gap is a black hole that eats every narrative that never sees the light of day. It’s been there since the beginning of time. Until now.' 2. List the barriers: 'Our CEO @premakkaraju explains the three reasons the gap exists: 💰 Money ⏳ Time ⚙️ Technology.' 3. Position the brand: 'At Stability AI, we aren't just building tools. We’re empowering everyone on earth to bridge the gap and tell their story.' 4. Provide social proof and link: 'The \"Black Hole\" is closing. Watch Prem at @TEDAISF here:' followed by the video link. 5. Align with bio by referencing multimodal tools to turn ideas into production.",
        "frequency": "Monthly"
      }
    ],
    hooks: [
      "Most AI audio models have never heard a maqam.",
      "Meet Stable Audio 3.0, the open-weight model family built for artistic experimentation.",
      "Your brand is an afterthought for out-of-the-box AI tools. Of course it is.",
      "The Storyteller’s Gap is a black hole that eats every narrative that never sees the light of day.",
      "We’ll help you make it like nobody’s business."
    ],
    angles: [
      "Open-weight models built for artistic experimentation with clear ownership and commercialization rights.",
      "Local and portable on-device generation that enables full creative production without GPUs.",
      "Brand-powered platforms that put your identity first instead of generic out-of-the-box outputs.",
      "Niche fine-tuning and community challenges that prove adaptability to specific styles and cultures.",
      "Closing the Storyteller’s Gap by solving money, time, and technology barriers for every creator."
    ],
    tags: [
      "ai-shipper",
      "creative",
      "verified"
    ],
  },

];

function generateIdeas(creator, count = 6) {
  if (!creator.hooks.length || !creator.angles.length || !creator.tags.length) {
    return [];
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    format: ['post', 'thread', 'reply', 'quote', 'post', 'thread'][i % 6],
    hook: creator.hooks[i % creator.hooks.length],
    angle: creator.angles[i % creator.angles.length],
    tags: [creator.tags[i % creator.tags.length], creator.tags[(i + 1) % creator.tags.length]],
  }));
}

function formatFollowers(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

async function mergeWithBlob(store, creator) {
  try {
    const scraped = await store.get(creator.xHandle, { type: 'json' });
    if (!scraped || !scraped.ok) return creator;
    const mergedBio = (scraped.bio && scraped.bio.trim().length > 0) ? scraped.bio : creator.bio;
    const mergedFollowers = (scraped.followers && scraped.followers > 0) ? scraped.followers : creator.followers;
    return {
      ...creator,
      bio: mergedBio,
      followers: mergedFollowers,
      followersStr: formatFollowers(mergedFollowers),
      avatar: scraped.avatar || creator.avatar,
      banner: scraped.banner || creator.banner,
      recentTweets: scraped.recentTweets || [],
      scrapedAt: scraped.scrapedAt,
      source: scraped.source || 'bundled',
    };
  } catch {
    return creator;
  }
}

function getActiveCreators(creatorsList) {
  // All creators are now released - time gating removed
  return creatorsList;
}

export default async (req, context) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const url = new URL(req.url);
  const path = url.pathname.replace('/api/', '');
  const store = getStore({ name: 'creator-sync', consistency: 'strong' });

  function json(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
  }

  if (path === 'health') return json({ ok: true, service: 'CreatorPlaybooks', agentApi: true, time: new Date().toISOString() });

  const activeBaseCreators = getActiveCreators(BASE_CREATORS);
  const mergedCreators = await Promise.all(activeBaseCreators.map(c => mergeWithBlob(store, c)));

  if (path === 'creators') {
    return json({
      count: mergedCreators.length,
      creators: mergedCreators.map(c => ({
        id: c.id,
        handle: c.handle,
        name: c.name,
        emoji: c.emoji,
        status: c.status,
        followersStr: c.followersStr,
        bio: c.bio,
        productsCount: c.products.length,
        playsCount: c.plays.length,
      }))
    });
  }

  if (path === 'creator') {
    const id = url.searchParams.get('id') || 'maya';
    const creator = mergedCreators.find(c => c.id === id) || mergedCreators[0];
    const expand = new Set((url.searchParams.get('expand') || '').split(',').map(s => s.trim()).filter(Boolean));
    const expandAll = expand.has('all') || expand.has('playbook');

    const include = (key) => expandAll || expand.has(key);

    const response = {
      profile: {
        id: creator.id,
        handle: creator.handle,
        name: creator.name,
        status: creator.status,
        emoji: creator.emoji,
        followers: creator.followers,
        followersStr: creator.followersStr,
        bio: creator.bio,
        products: creator.products,
        pillars: creator.pillars,
        milestones: creator.milestones,
        media: creator.media,
        recentTweets: creator.recentTweets || [],
        scrapedAt: creator.scrapedAt || null,
        source: creator.source || 'bundled',
        xUrl: `https://x.com/${creator.xHandle}`,
        avatar: creator.avatar,
        banner: creator.banner,
      },
    };

    if (include('category') || include('theme') || expandAll) {
      response.category = creator.category;
      response.theme = creator.theme;
    }

    if (include('tags') || expandAll) {
      response.tags = creator.tags || [];
    }

    if (include('plays') || expandAll) {
      response.playbook = { count: creator.plays.length, plays: creator.plays };
    }

    if (include('hooks') || expandAll) {
      response.hooks = creator.hooks || [];
    }

    if (include('angles') || expandAll) {
      response.angles = creator.angles || [];
    }

    if (include('resources') || expandAll) {
      const base = 'https://creatorplaybooks.netlify.app';
      response.resources = {
        self: `${base}/api/creator?id=${creator.id}`,
        expanded: `${base}/api/creator?id=${creator.id}&expand=all`,
        playbook: `${base}/api/playbook?creator=${creator.id}`,
        ideas: `${base}/api/ideas?creator=${creator.id}&count=6`,
        export: `${base}/api/export?creator=${creator.id}`,
        x: `https://x.com/${creator.xHandle}`,
      };
    }

    return json(response);
  }

  if (path === 'playbook') {
    const creatorId = url.searchParams.get('creator') || 'maya';
    const creator = mergedCreators.find(c => c.id === creatorId) || mergedCreators[0];
    return json({ creator: creator.name, status: creator.status, count: creator.plays.length, plays: creator.plays });
  }

  if (path === 'ideas') {
    const creatorId = url.searchParams.get('creator') || 'maya';
    const creator = mergedCreators.find(c => c.id === creatorId) || mergedCreators[0];
    const count = parseInt(url.searchParams.get('count') || '6', 10);
    return json({ creator: creator.name, count, ideas: generateIdeas(creator, Math.min(20, Math.max(1, count))) });
  }

    if (path === 'maya') {
    const maya = mergedCreators[0];
    return json({
      profile: {
        handle: maya.handle,
        name: maya.name,
        status: maya.status,
        bio: maya.bio,
        followers: maya.followers,
        products: maya.products,
        pillars: maya.pillars,
        milestones: maya.milestones,
        media: maya.media,
        recentTweets: maya.recentTweets || [],
        scrapedAt: maya.scrapedAt || null,
        source: maya.source || 'bundled',
        xUrl: `https://x.com/${maya.xHandle}`,
        avatar: maya.avatar,
        banner: maya.banner,
      },
      links: { x: `https://x.com/${maya.xHandle}` },
    });
  }

  return json({ error: 'Not found', available: ['health', 'creators', 'creator', 'playbook', 'ideas', 'maya'] }, 404);
};