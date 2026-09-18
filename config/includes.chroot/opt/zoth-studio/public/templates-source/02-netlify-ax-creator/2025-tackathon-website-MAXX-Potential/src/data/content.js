export const stations = [
  {
    id: 'vhs',
    title: 'VHS Vault TV Guide',
    sprite: '📼',
    flavor: 'Static, horizontal hold issues, and a stack of taped specials.',
    trivia: 'Which network kicked off the "25 Days of Christmas" marathon in the late 90s?',
    answers: ['abc family', 'fox family', 'freeform'],
    reward: 'Unlocked: Snow Day Broadcast overlay',
    clue: 'The block later rebranded to Freeform.',
    zone: 'North Alley'
  },
  {
    id: 'home-alone',
    title: 'Home Alone Security Desk',
    sprite: '🧤',
    flavor: 'Wet Bandits detected. Macaulay-style booby traps required.',
    trivia: 'What did Kevin swing down the staircase to knock out the burglars?',
    answers: ['paint can', 'paint cans'],
    reward: 'Unlocked: Pop-up booby trap alerts',
    clue: 'It left a major stain and a bigger bruise.',
    zone: 'Lobby'
  },
  {
    id: 'turbo',
    title: 'Turbo Man Toy Kiosk',
    sprite: '🤖',
    flavor: 'Blinking red LEDs and a recorded Arnold one-liner on loop.',
    trivia: 'Name the 1996 holiday movie toy everyone fought for.',
    answers: ['turbo man', 'jingle all the way'],
    reward: 'Unlocked: Turbo glitter boost',
    clue: '"It\'s turbo time!"',
    zone: 'Food Court'
  },
  {
    id: 'tamagotchi',
    title: 'Elf LAN Pet Lab',
    sprite: '🐣',
    flavor: 'Translucent shells, three buttons, and endless beeping.',
    trivia: 'Which virtual pet had kids feeding pixels in 1997?',
    answers: ['tamagotchi'],
    reward: 'Unlocked: Digital snow pet companion',
    clue: 'Came with a keychain and a tiny reset button.',
    zone: 'Arcade'
  },
  {
    id: 'nick-arcade',
    title: 'Nick Arcade Hotline',
    sprite: '📞',
    flavor: 'Rotary phones calling in for slime updates and bonus rounds.',
    trivia: 'Which green goop made winning contestants famous (and messy)?',
    answers: ['slime', 'nickelodeon slime'],
    reward: 'Unlocked: Slime-proof snow boots',
    clue: 'You better duck when the studio audience chants.',
    zone: 'Atrium'
  },
  {
    id: 'arcade-lan',
    title: 'Frosty LAN Party',
    sprite: '🕹️',
    flavor: 'Ethernet cables strung like garland over CRT monitors.',
    trivia: 'Name the classic snowboarding game kids linked up on PlayStation.',
    answers: ['ssx', 'ssx tricky'],
    reward: 'Unlocked: Split-screen peppermint trail',
    clue: 'The announcer yelled “Tricky!” every time you nailed a combo.',
    zone: 'Cyber Deck'
  },
  {
    id: 'y2k',
    title: 'Y2K Countdown Bunker',
    sprite: '⌛',
    flavor: 'Candle-lit basement with printed internet guides and floppy disks.',
    trivia: 'What two-digit fix panicked everyone at midnight 1999?',
    answers: ['y2k', 'millennium bug'],
    reward: 'Unlocked: Millennium-safe sleigh firmware',
    clue: 'Bank clocks and airport boards were supposedly doomed.',
    zone: 'Sublevel'
  },
  {
    id: 'cd-burner',
    title: 'CD Burner Booth',
    sprite: '💿',
    flavor: 'Stacks of blank discs waiting for the ultimate holiday mixtape.',
    trivia: 'Which file-sharing program spread those jingle jams across dial-up?',
    answers: ['napster'],
    reward: 'Unlocked: Lime-green waveform lights',
    clue: 'Its mascot was a cat with headphones.',
    zone: 'Food Court'
  }
]

export const cheatSheet = [
  {
    header: 'Mixtape Memories',
    body: 'Mariah dominated 1994, Hanson chimed in 1997 — add both to your boom box and the elves dance faster.'
  },
  {
    header: 'Mall Rat Wisdom',
    body: 'Spencer Gifts stocked fiber-optic trees and lava lamps; pair them to earn a bonus sparkle meter in the scene.'
  },
  {
    header: 'TV Guide Tips',
    body: 'Circle your specials with neon highlighter: Frosty, Rudolph claymation, and the infamous grandma reindeer incident.'
  },
  {
    header: 'Mall Santa Intel',
    body: 'Say “MACY ELF OVERRIDE” at the trivia kiosk to get a reroll on your clue (whispers from a 1998 mall Santa pager).'
  },
  {
    header: 'Arcade Insider',
    body: 'Input ↑ ↑ ↓ ↓ ← → ← → B A when the snow falls to light up the Nick Arcade hotline sprite for 30 seconds.'
  }
]

export const christmasApis = [
  {
    name: 'iTunes Search API',
    url: 'https://itunes.apple.com/search?term=christmas+1990s&media=movie',
    description:
      'No key needed; query 1990s Christmas movies and TV specials by keyword, media type, and country to surface nostalgia recs.'
  },
  {
    name: 'TVMaze Search',
    url: 'https://api.tvmaze.com/search/shows?q=christmas',
    description:
      'Open API that lists episodes and shows — filter titles with airdate 1990-1999 in your app to build a retro viewing guide.'
  },
  {
    name: 'Open Library Covers',
    url: 'https://covers.openlibrary.org/b/isbn/0385325770-M.jpg',
    description:
      'Serve free cover art for 90s holiday storybooks without auth (swap ISBNs). Great for decorating kiosks or trivia cards.'
  },
  {
    name: 'Open Meteo Snow Forecast',
    url: 'https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&hourly=snowfall',
    description:
      'Free weather feed (no signup) to overlay “incoming flurries” text on the plaza when snowfall > 0 around the user city.'
  }
]

export const videoOptions = [
  {
    id: 'home-alone-cartoon',
    title: 'Home Alone Animated (1997)',
    description: 'Pilot clips and commercials stitched together — classic 90s cable vibes.',
    embedUrl: 'https://www.youtube.com/embed/6K3V-4Pz0ps'
  },
  {
    id: 'muppets',
    title: 'Muppet Family Christmas (retro TV rip)',
    description: 'Full broadcast with vintage ads to keep the CRT glow authentic.',
    embedUrl: 'https://www.youtube.com/embed/oeo-4Wm0d0M'
  },
  {
    id: 'nicktoons',
    title: 'Nicktoons 1996 Christmas Block',
    description: 'A mash-up of Hey Arnold, Rugrats, and Rocko holiday segments.',
    embedUrl: 'https://www.youtube.com/embed/6V6-hwxKF1Q'
  },
  {
    id: 'peewee',
    title: "Pee-wee's Playhouse Christmas Special",
    description: 'So many guest stars — the set design is peak tacky perfection.',
    embedUrl: 'https://www.youtube.com/embed/1M3x6K36Wkc'
  },
  {
    id: 'garfield',
    title: 'Garfield Christmas (90s TV quality)',
    description: 'Striped sweater comfort with VHS fuzz for extra nostalgia.',
    embedUrl: 'https://www.youtube.com/embed/jg2Y8b-kNOg'
  }
]

export const ecardTemplates = [
  {
    id: 'laser-grid',
    name: 'Laser Grid Snow',
    accent: '#ff3a8a',
    background:
      'linear-gradient(135deg, rgba(255, 58, 138, 0.18), rgba(0, 255, 200, 0.22)), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)',
    border: '3px double rgba(255, 232, 115, 0.8)'
  },
  {
    id: 'gingham',
    name: 'Gingham Gift Wrap',
    accent: '#ffe873',
    background:
      'repeating-linear-gradient(0deg, rgba(255, 232, 115, 0.3) 0 10px, rgba(0,0,0,0.18) 10px 20px), repeating-linear-gradient(90deg, rgba(255, 71, 87, 0.18) 0 10px, transparent 10px 20px)',
    border: '3px solid rgba(158, 255, 232, 0.9)'
  },
  {
    id: 'frosted',
    name: 'Frosted CRT Glow',
    accent: '#9effe8',
    background: 'radial-gradient(circle at 30% 30%, rgba(158,255,232,0.24), rgba(10,16,28,0.9))',
    border: '3px dashed rgba(255, 47, 210, 0.8)'
  }
]

export const TRACKER_API = 'https://api.noradsanta.org/track'

export const TRACKER_FALLBACK = {
  city: 'Workshop Airspace (cached)',
  lat: '90.000',
  lon: '135.000',
  speed: 'warp-sleigh',
  eta: 'Loaded after CORS snowstorm'
}

export const defaultProfile = {
  alias: '',
  bio: '',
  favoriteGift: '',
  flair: '🎄'
}

export const parseSantaPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return null
  const lat =
    payload.lat ?? payload.latitude ?? payload.coords?.lat ?? payload.position?.lat ?? payload.location?.lat ?? null
  const lon =
    payload.lon ??
    payload.lng ??
    payload.longitude ??
    payload.coords?.lng ??
    payload.coords?.lon ??
    payload.position?.lng ??
    payload.position?.lon ??
    payload.location?.lon ??
    null
  const city =
    payload.city ??
    payload.location ??
    payload.region ??
    payload.place ??
    payload.nearest_city ??
    payload.country ??
    payload.next_stop ??
    null
  const speed = payload.speed ?? payload.velocity ?? payload.kph ?? payload.mph ?? payload.speed_kph ?? null
  const eta = payload.eta ?? payload.countdown ?? payload.next_stop_eta ?? payload.next_stop_countdown ?? null
  return { lat, lon, city, speed, eta, raw: payload }
}
