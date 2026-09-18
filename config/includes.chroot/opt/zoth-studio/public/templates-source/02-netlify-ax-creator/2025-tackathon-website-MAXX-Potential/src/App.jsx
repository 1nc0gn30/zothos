import { useCallback, useMemo, useState, useEffect } from 'react'
import './App.css'
import Hero from './components/Hero'
import SceneSection from './components/SceneSection'
import ApiIdeas from './components/ApiIdeas'
import VideoLounge from './components/VideoLounge'
import EcardLab from './components/EcardLab'
import UnlocksSection from './components/UnlocksSection'
import UtilitiesSection from './components/UtilitiesSection'
import CheatsSection from './components/CheatsSection'
import Footer from './components/Footer'
import {
  TRACKER_API,
  TRACKER_FALLBACK,
  cheatSheet,
  christmasApis,
  defaultProfile,
  ecardTemplates,
  parseSantaPayload,
  stations,
  videoOptions
} from './data/content'

function App() {
  const [activeId, setActiveId] = useState(stations[0].id)
  const [answerInput, setAnswerInput] = useState('')
  const [unlocks, setUnlocks] = useState({})
  const [systemMessage, setSystemMessage] = useState(
    'Choose a station, drop a 90s Christmas fact, and light the plaza.'
  )
  const [trackerState, setTrackerState] = useState('loading')
  const [santaSnapshot, setSantaSnapshot] = useState(null)
  const [lastTrackerUpdate, setLastTrackerUpdate] = useState(null)
  const [trackerError, setTrackerError] = useState('')
  const [wishlistName, setWishlistName] = useState('')
  const [wishlistGift, setWishlistGift] = useState('')
  const [wishOutput, setWishOutput] = useState(null)
  const [secretChallenge, setSecretChallenge] = useState('Hunt for CRT snowglobes hidden behind neon tiles.')
  const [selectedVideoId, setSelectedVideoId] = useState(videoOptions[0].id)
  const [ecardTemplateId, setEcardTemplateId] = useState(ecardTemplates[0].id)
  const [ecardMessage, setEcardMessage] = useState('Meet me at the plaza food court for neon cocoa!')
  const [ecardTo, setEcardTo] = useState('Snow Friend')
  const [ecardFrom, setEcardFrom] = useState('Mall Rat 97')
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') return defaultProfile
    const stored = window.localStorage.getItem('crt-profile')
    try {
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile
    } catch (error) {
      return defaultProfile
    }
  })

  const activeStation = useMemo(
    () => stations.find((station) => station.id === activeId) || stations[0],
    [activeId]
  )

  const progress = useMemo(() => Math.round((Object.keys(unlocks).length / stations.length) * 100), [unlocks])

  const refreshSanta = useCallback(async () => {
    setTrackerState((prev) => (prev === 'ready' ? 'refreshing' : 'loading'))
    setTrackerError('')
    try {
      const response = await fetch(TRACKER_API, { headers: { accept: 'application/json' } })
      if (!response.ok) throw new Error('Bad response')
      const payload = await response.json().catch(() => null)
      const parsed = parseSantaPayload(payload)
      if (!parsed) throw new Error('No location data')
      setSantaSnapshot(parsed)
      setLastTrackerUpdate(new Date())
      setTrackerState('ready')
    } catch (error) {
      setTrackerState('error')
      setSantaSnapshot((prev) => prev ?? TRACKER_FALLBACK)
      setTrackerError(
        'Live radar is blocked by the browser (CORS snowstorm). Showing cached sleigh vibes until the feed thaws.'
      )
    }
  }, [])

  useEffect(() => {
    refreshSanta()
    const id = setInterval(refreshSanta, 60_000)
    return () => clearInterval(id)
  }, [refreshSanta])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('crt-profile', JSON.stringify(profile))
  }, [profile])

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleaned = answerInput.trim().toLowerCase()
    if (!cleaned) {
      setSystemMessage('Type an answer first — the elves refuse blank VHS labels.')
      return
    }

    const isCorrect = activeStation.answers.some((option) => cleaned.includes(option))

    if (isCorrect) {
      setUnlocks((prev) => {
        if (prev[activeStation.id]) return prev
        return {
          ...prev,
          [activeStation.id]: {
            title: activeStation.title,
            reward: activeStation.reward,
            time: new Date().toLocaleTimeString()
          }
        }
      })
      setAnswerInput('')
      setSystemMessage(`Correct! ${activeStation.reward}. New lights flicker in the plaza.`)
    } else {
      setSystemMessage('Close, but the elf DJ buzzed you. Peek at the clue and try again!')
    }
  }

  const handlePrintWish = (event) => {
    event.preventDefault()
    if (!wishlistName.trim() || !wishlistGift.trim()) {
      setWishOutput('Add your name and dream gift to print a ticket!')
      return
    }
    const glitter = ['✨ Neon snow', '🎄 Fiber-optic sparkle', '🌟 CRT glow', '💿 Hologram gleam'][
      Math.floor(Math.random() * 4)
    ]
    const timecode = new Date().toLocaleTimeString()
    setWishOutput(
      `${wishlistName.trim()} requested ${wishlistGift.trim()} • ${glitter} • queued at ${timecode} — tape this to the plaza kiosk!`
    )
  }

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const selectedVideo = videoOptions.find((video) => video.id === selectedVideoId) ?? videoOptions[0]
  const selectedTemplate = ecardTemplates.find((template) => template.id === ecardTemplateId) ?? ecardTemplates[0]

  const generateEcardMarkup = () => {
    return `<!doctype html><html><head><meta charset="utf-8"><title>CRT Plaza E-Card</title><style>
      body { margin:0; font-family:'Press Start 2P', monospace; background:#0a0f1c; color:#fef9f2; display:flex; align-items:center; justify-content:center; }
      .card { width: 640px; min-height: 420px; padding: 32px; box-sizing:border-box; display:grid; gap:16px;
        background: ${selectedTemplate.background}; border:${selectedTemplate.border}; box-shadow:0 18px 60px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(255,255,255,0.08);
      }
      .title { font-size:24px; color:${selectedTemplate.accent}; text-shadow:0 0 12px rgba(255,255,255,0.4); margin:0; }
      .to { font-size:16px; margin:0; }
      .message { font-size:18px; line-height:1.6; margin:0; }
      .from { font-size:16px; margin:0; text-align:right; }
    </style></head><body><div class="card"><p class="title">CRT Plaza Greetings</p><p class="to">To: ${ecardTo}</p><p class="message">${ecardMessage}</p><p class="from">— ${ecardFrom}</p></div></body></html>`
  }

  const handleDownloadEcard = () => {
    const blob = new Blob([generateEcardMarkup()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'crt-plaza-ecard.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePrintEcard = () => {
    const popup = window.open('', '_blank', 'width=720,height=900')
    if (!popup) return
    popup.document.write(generateEcardMarkup())
    popup.document.close()
    popup.focus()
    popup.print()
  }

  return (
    <div className="page">
      <div className="bg-tile" aria-hidden />
      <div className="scanline" aria-hidden />

      <Hero
        progress={progress}
        unlockCount={Object.keys(unlocks).length}
        totalStations={stations.length}
        systemMessage={systemMessage}
      />

      <SceneSection
        stations={stations}
        activeId={activeId}
        setActiveId={setActiveId}
        activeStation={activeStation}
        answerInput={answerInput}
        setAnswerInput={setAnswerInput}
        handleSubmit={handleSubmit}
        unlocks={unlocks}
        systemMessage={systemMessage}
        trackerState={trackerState}
        trackerError={trackerError}
        santaSnapshot={santaSnapshot}
        lastTrackerUpdate={lastTrackerUpdate}
        refreshSanta={refreshSanta}
      />

      <ApiIdeas christmasApis={christmasApis} />

      <VideoLounge
        videoOptions={videoOptions}
        selectedVideoId={selectedVideoId}
        setSelectedVideoId={setSelectedVideoId}
        selectedVideo={selectedVideo}
      />

      <EcardLab
        ecardTemplates={ecardTemplates}
        ecardTemplateId={ecardTemplateId}
        setEcardTemplateId={setEcardTemplateId}
        ecardTo={ecardTo}
        setEcardTo={setEcardTo}
        ecardMessage={ecardMessage}
        setEcardMessage={setEcardMessage}
        ecardFrom={ecardFrom}
        setEcardFrom={setEcardFrom}
        selectedTemplate={selectedTemplate}
        handleDownloadEcard={handleDownloadEcard}
        handlePrintEcard={handlePrintEcard}
      />

      <UnlocksSection stations={stations} unlocks={unlocks} />

      <UtilitiesSection
        profile={profile}
        handleProfileChange={handleProfileChange}
        wishlistName={wishlistName}
        setWishlistName={setWishlistName}
        wishlistGift={wishlistGift}
        setWishlistGift={setWishlistGift}
        handlePrintWish={handlePrintWish}
        wishOutput={wishOutput}
        secretChallenge={secretChallenge}
        setSecretChallenge={setSecretChallenge}
      />

      <CheatsSection cheatSheet={cheatSheet} />

      <Footer />
    </div>
  )
}

export default App
