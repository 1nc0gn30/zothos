import { useEffect, useMemo, useRef, useState } from 'react'
import './Hero.css'

const tickerLines = [
  '✨ Cozy snow layers engaged • plaza lights slowed to a gentle glow',
  '🎄 Pixel trees swaying • warm cocoa printer online',
  '🛷 Sleigh silhouettes blinking across the skyline',
  '🔔 Bell tones softened • arcade speakers humming with lo-fi cheer'
]

const pixelScenes = [
  {
    name: 'Gingerbread Grid Plaza',
    description: 'Cookie rooflines, neon frosting, and gift wrap smoke drifting upward.',
    gradient:
      "linear-gradient(180deg, rgba(26, 12, 10, 0.9) 0%, rgba(37, 18, 12, 0.85) 35%, rgba(48, 26, 22, 0.92) 60%, #0f1c34 100%), url('https://images.unsplash.com/photo-1544216263-3426a06f8b20?auto=format&fit=crop&w=1400&q=80')",
    tiles:
      'linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255, 232, 115, 0.1) 1px, transparent 1px)',
    accent: '#ffcf9f',
    stickers: [
      "url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=600&q=80')",
      "url('https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=700&q=80')"
    ]
  },
  {
    name: 'Candy Cane Broadcast',
    description: 'Peppermint satellites beaming carols to every CRT in the mall.',
    gradient:
      "linear-gradient(180deg, rgba(28, 6, 24, 0.95) 0%, rgba(45, 14, 35, 0.85) 40%, rgba(61, 18, 47, 0.85) 70%, #1b0e28 100%), url('https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1400&q=80')",
    tiles:
      'linear-gradient(90deg, rgba(255,231,115,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(255,115,199,0.14) 1px, transparent 1px)',
    accent: '#ffd2f2',
    stickers: [
      "url('https://images.unsplash.com/photo-1482173074468-5fd3c0c8e8c8?auto=format&fit=crop&w=700&q=80')",
      "url('https://images.unsplash.com/photo-1518309726374-4e84d95cdc37?auto=format&fit=crop&w=500&q=80')"
    ]
  },
  {
    name: 'Arctic Hologram Stage',
    description: 'Aurora LEDs, ice projectors, and tacky toy soldiers marching in sync.',
    gradient:
      "linear-gradient(180deg, rgba(12, 29, 31, 0.92) 0%, rgba(12, 43, 53, 0.9) 35%, rgba(10, 26, 38, 0.9) 100%), url('https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1400&q=80')",
    tiles:
      'linear-gradient(90deg, rgba(0,255,200,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(111,183,255,0.14) 1px, transparent 1px)',
    accent: '#9effe8',
    stickers: [
      "url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=700&q=80')",
      "url('https://images.unsplash.com/photo-1508179522353-11ba468c4a1f?auto=format&fit=crop&w=600&q=80')"
    ]
  }
]

const filterOptions = [
  { id: 'snow', label: 'Three.js snow', detail: 'Layered flakes with depth' },
  { id: 'glow', label: 'Warm glow', detail: 'Soft bloom around the scene' },
  { id: 'pixels', label: 'Pixel mask', detail: '8-bit edges & scan grid' }
]

const fortunes = [
  'Your wishlist gets fast-tracked — Santa hacked the pager.',
  'A neon reindeer will photobomb your next selfie.',
  'Mall pretzel coupons manifest when you shout “HO HO HACK”.',
  'You gain +5 charisma for every string light plugged in tonight.',
  'CRT Plaza disco ball grants one bonus trivia hint — use it wisely.'
]

const terminalLines = [
  'Connecting to NorthPoleNet…',
  'Loading Christmas Spirit v2.1…',
  'Decrypting Santa’s Naughty List…',
  'Rendering 256-color snowflakes…',
  'Booting Holiday.exe…'
]

let threePromise
const loadThree = () => {
  if (!threePromise) {
    threePromise = import('https://cdn.skypack.dev/three@0.161.0')
  }
  return threePromise
}

const Hero = ({ progress, unlockCount, totalStations, systemMessage }) => {
  const [tickerIndex, setTickerIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [filters, setFilters] = useState({ snow: true, glow: true, pixels: true })
  const [fortune, setFortune] = useState('Press a glowing button to dial the Santa hotline and pull a tacky fortune.')
  const [terminalIndex, setTerminalIndex] = useState(0)
  const [terminalText, setTerminalText] = useState('> dialing mall modem…')
  const [terminalHistory, setTerminalHistory] = useState(['> scene warmed up • snow swirl ON', '> trivia link cables attached'])
  const [globeInView, setGlobeInView] = useState(false)

  const snowMountRef = useRef(null)
  const globeMountRef = useRef(null)
  const globeCardRef = useRef(null)
  const shakeSnowRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setTickerIndex((prev) => (prev + 1) % tickerLines.length), 3800)
    return () => clearInterval(id)
  }, [])

  const tickerMessage = useMemo(() => tickerLines[tickerIndex], [tickerIndex])
  const currentScene = useMemo(() => pixelScenes[sceneIndex % pixelScenes.length], [sceneIndex])
  const activeFilters = useMemo(() => filterOptions.filter((option) => filters[option.id]), [filters])

  useEffect(() => {
    const line = terminalLines[terminalIndex % terminalLines.length]
    let charIndex = 0
    setTerminalText('> ')

    const typer = setInterval(() => {
      charIndex += 1
      setTerminalText((prev) => `${prev}${line.charAt(charIndex - 1)}`)
      if (charIndex >= line.length) {
        clearInterval(typer)
      }
    }, 55)

    const hold = setTimeout(() => {
      setTerminalHistory((prev) => [`> ${line}`, ...prev].slice(0, 6))
      setTerminalIndex((prev) => (prev + 1) % terminalLines.length)
    }, line.length * 55 + 900)

    return () => {
      clearInterval(typer)
      clearTimeout(hold)
    }
  }, [terminalIndex])

  useEffect(() => {
    if (!filters.snow) return undefined

    let cleanup
    let mounted = true

    loadThree()
      .then((THREE) => {
        if (!mounted || !snowMountRef.current) return
        const container = snowMountRef.current
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 50)
        camera.position.set(0, 0, 4)

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio || 1)
        container.appendChild(renderer.domElement)

        const flakeCount = 360
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(flakeCount * 3)
        const speeds = new Float32Array(flakeCount)

        for (let i = 0; i < flakeCount; i += 1) {
          positions[i * 3] = (Math.random() - 0.5) * 6
          positions[i * 3 + 1] = Math.random() * 6
          positions[i * 3 + 2] = (Math.random() - 0.5) * 6
          speeds[i] = 0.01 + Math.random() * 0.02
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const material = new THREE.PointsMaterial({
          color: currentScene.accent,
          size: 0.05,
          transparent: true,
          opacity: 0.85,
          depthWrite: false
        })

        const points = new THREE.Points(geometry, material)
        scene.add(points)

        const resize = () => {
          if (!container) return
          const { clientWidth, clientHeight } = container
          camera.aspect = clientWidth / clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(clientWidth, clientHeight)
        }

        let frameId

        const animate = () => {
          const pos = geometry.getAttribute('position')
          for (let i = 0; i < flakeCount; i += 1) {
            let y = pos.getY(i) - speeds[i]
            if (y < -2) y = 3
            pos.setY(i, y)
          }
          pos.needsUpdate = true
          renderer.render(scene, camera)
          frameId = requestAnimationFrame(animate)
        }

        animate()
        window.addEventListener('resize', resize)

        cleanup = () => {
          window.removeEventListener('resize', resize)
          if (frameId) cancelAnimationFrame(frameId)
          renderer.dispose()
          geometry.dispose()
          material.dispose()
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement)
          }
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
      if (cleanup) cleanup()
    }
  }, [filters.snow, currentScene])

  useEffect(() => {
    let observer
    if (globeCardRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setGlobeInView(entry.isIntersecting))
        },
        { threshold: 0.35 }
      )
      observer.observe(globeCardRef.current)
    }

    return () => observer?.disconnect()
  }, [])

  useEffect(() => {
    let cleanup
    let mounted = true

    loadThree()
      .then((THREE) => {
        if (!mounted || !globeMountRef.current) return
        const container = globeMountRef.current
        const scene = new THREE.Scene()
        scene.background = null

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 20)
        camera.position.set(0, 0.9, 2.7)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio || 1)
        container.appendChild(renderer.domElement)

        scene.add(new THREE.AmbientLight(0xffffff, 0.9))

        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 1, 0.3, 32),
          new THREE.MeshStandardMaterial({ color: '#1b1f32', metalness: 0.45, roughness: 0.45 })
        )
        base.position.y = -0.95
        scene.add(base)

        const glass = new THREE.Mesh(
          new THREE.SphereGeometry(1, 32, 32),
          new THREE.MeshPhysicalMaterial({
            color: '#b3e7ff',
            roughness: 0.05,
            transparent: true,
            opacity: 0.15,
            transmission: 0.7,
            thickness: 0.35
          })
        )
        scene.add(glass)

        const platform = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.6, 0.08, 20),
          new THREE.MeshStandardMaterial({ color: '#ffe873', emissive: '#b17b1c', emissiveIntensity: 0.15 })
        )
        platform.position.y = -0.6
        scene.add(platform)

        const tree = new THREE.Mesh(
          new THREE.ConeGeometry(0.32, 0.7, 16),
          new THREE.MeshStandardMaterial({ color: '#2de8a3', emissive: '#205d46', emissiveIntensity: 0.35 })
        )
        tree.position.y = -0.2
        scene.add(tree)

        const flakeCount = 260
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(flakeCount * 3)
        const velocities = new Float32Array(flakeCount)

        for (let i = 0; i < flakeCount; i += 1) {
          positions[i * 3] = (Math.random() - 0.5) * 1.6
          positions[i * 3 + 1] = Math.random() * 1.4 - 0.1
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.6
          velocities[i] = Math.random() * 0.01
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const material = new THREE.PointsMaterial({
          color: '#ffffff',
          size: 0.05,
          transparent: true,
          opacity: 0.92,
          depthWrite: false
        })
        const flakes = new THREE.Points(geometry, material)
        scene.add(flakes)

        const shakeSnow = (strength = 1.6) => {
          for (let i = 0; i < flakeCount; i += 1) {
            velocities[i] = strength * (0.15 + Math.random() * 0.4)
          }
        }

        shakeSnowRef.current = shakeSnow

        const resize = () => {
          const { clientWidth, clientHeight } = container
          camera.aspect = clientWidth / clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(clientWidth, clientHeight)
        }

        let frameId

        const animate = () => {
          const pos = geometry.getAttribute('position')
          for (let i = 0; i < flakeCount; i += 1) {
            let y = pos.getY(i) - velocities[i]
            velocities[i] = Math.max(velocities[i] - 0.012, 0.005)
            if (y < -0.8) {
              y = 0.9
              velocities[i] = 0.02
            }
            pos.setY(i, y)
          }
          pos.needsUpdate = true
          renderer.render(scene, camera)
          frameId = requestAnimationFrame(animate)
        }

        animate()
        window.addEventListener('resize', resize)

        cleanup = () => {
          window.removeEventListener('resize', resize)
          if (frameId) cancelAnimationFrame(frameId)
          renderer.dispose()
          geometry.dispose()
          material.dispose()
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement)
          }
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
      if (cleanup) cleanup()
    }
  }, [])

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.code === 'Space' && globeInView) {
        event.preventDefault()
        shakeSnowRef.current?.(1.8)
      }
    }

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity
      if (!accel || !globeInView) return
      const total = Math.abs(accel.x || 0) + Math.abs(accel.y || 0) + Math.abs(accel.z || 0)
      if (total > 45) {
        shakeSnowRef.current?.(2.4)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('devicemotion', handleMotion)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [globeInView])

  const handleCycleScene = (direction) => {
    setSceneIndex((prev) => (prev + direction + pixelScenes.length) % pixelScenes.length)
    setFortune('Scene changed — the plaza swapped to a calmer snow view!')
  }

  const toggleFilter = (id) => {
    setFilters((prev) => {
      const nextValue = !prev[id]
      const next = { ...prev, [id]: nextValue }
      setFortune(`Filter “${filterOptions.find((option) => option.id === id)?.label ?? id}” ${nextValue ? 'activated' : 'muted'}.`)
      return next
    })
  }

  const handlePullFortune = () => {
    const next = fortunes[Math.floor(Math.random() * fortunes.length)]
    setFortune(next)
  }

  return (
    <header className={`hero${filters.glow ? ' hero--glow' : ''}${filters.pixels ? ' hero--pixel' : ''}`}>
      <div className="hero__scene-column">
        <div className="hero__badge">Gentle winter lobby • Vibes dialed down</div>
        <div className="hero__scene-frame" style={{ '--scene-accent': currentScene.accent }}>
          <div
            className={`hero__scene${filters.glow ? ' hero__scene--glow' : ''}${filters.pixels ? ' hero__scene--pixel' : ''}${filters.snow ? ' hero__scene--snow' : ' hero__scene--calm'}`}
            style={{ backgroundImage: currentScene.gradient, '--tile-layer': currentScene.tiles }}
          >
            <div className="hero__scene-overlay" aria-hidden />
            <div className="hero__scene-horizon" aria-hidden />
            <div className="hero__scene-collage" aria-hidden>
              <div className="collage__panel" style={{ backgroundImage: currentScene.stickers[0] }} />
              <div className="collage__panel collage__panel--alt" style={{ backgroundImage: currentScene.stickers[1] }} />
              <div className="collage__garland" />
            </div>
            <div className="hero__scene-title">
              <p className="eyebrow">Pixel scenery</p>
              <h2>{currentScene.name}</h2>
              <p className="scene__lede">{currentScene.description}</p>
            </div>
            <div className="hero__scene-tiles" aria-hidden />
            {filters.snow && <div className="hero__snow-layer" ref={snowMountRef} aria-hidden />}
          </div>
          <div className="hero__scene-controls">
            <button className="btn btn-secondary" type="button" onClick={() => handleCycleScene(-1)}>
              ◀ Previous
            </button>
            <button className="btn btn-primary" type="button" onClick={() => handleCycleScene(1)}>
              Next scene ▶
            </button>
          </div>
        </div>

        <div className="hero__globe-card" ref={globeCardRef}>
          <div className="hero__globe-header">
            <div>
              <p className="eyebrow">Snowglobe filter</p>
              <h3>Shakeable snow globe</h3>
              <p className="globe__lede">Uses Three.js — shake your phone or hit space while visible.</p>
            </div>
            <button className="btn btn-ghost" type="button" onClick={() => shakeSnowRef.current?.(1.9)}>
              Shake now
            </button>
          </div>
          <div className="hero__globe" ref={globeMountRef} aria-label="Interactive snow globe" />
          <p className="globe__hint">Snow settles if you stop shaking. Spacebar and mobile motion both work.</p>
        </div>
      </div>

      <div className="hero__content">
        <div className="hero__banner">
          <div className="hero__banner-lights" aria-hidden />
          <div>
            <p className="eyebrow">Holiday Systems Online</p>
            <h2 className="banner__headline">Tacky North Pole Control Deck</h2>
            <p className="banner__lede">
              CRT tinsel, glitchy wreaths, and a mall-wide broadcast ribbon sit above the plaza. Swap filters to see the banner
              react in real time.
            </p>
          </div>
          <div className="banner__badge">Festive uptime 99.97%</div>
        </div>
        <p className="eyebrow">MAXX Potential presents</p>
        <h1>
          North Pole 199X
          <span className="crt-glow"> Calmer CRT Plaza</span>
        </h1>
        <p className="lede">
          The hero has been cooled down: fewer wild filters, more curated pixel scenery. Swap scenes, toggle the mellow
          filters, and watch a Three.js snow globe react to shakes.
        </p>

        <div className="hero__filters">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-chip${filters[filter.id] ? ' filter-chip--active' : ''}`}
              onClick={() => toggleFilter(filter.id)}
              aria-pressed={filters[filter.id]}
            >
              <span>{filter.label}</span>
              <small>{filter.detail}</small>
            </button>
          ))}
        </div>

        <div className="hero__chips">
          <div className="chip">🧦 Stocking count: +{unlockCount}</div>
          <div className="chip">✨ Active filters: {activeFilters.length}</div>
          <div className="chip">🌨️ Scene: {currentScene.name}</div>
        </div>

        <div className="hero__filter-readout">
          <span className="filter-readout__label">Live stack:</span>
          <span className="filter-readout__value">
            {activeFilters.length > 0
              ? activeFilters.map((option) => option.label).join(' • ')
              : 'Filters muted — pure VHS view'}
          </span>
        </div>

        <div className="hero__cta">
          <a className="btn btn-primary" href="#scene">
            Enter the main scene
          </a>
          <a className="btn btn-ghost" href="#cheat-codes">
            View cheat sheet
          </a>
        </div>

        <div className="hero__ticker" role="status" aria-live="polite">
          <div className="ticker__glow" aria-hidden />
          <div className="ticker__content">
            <span className="ticker__label">Calm broadcast</span>
            <div className="ticker__window">
              <div className="ticker__marquee">
                <span className="ticker__message">{tickerMessage}</span>
                <span className="ticker__message ticker__message--ghost">{tickerMessage}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="progress">
          <div className="progress__bar" style={{ width: `${progress}%` }} />
          <div className="progress__label">{unlockCount} / {totalStations} unlocks</div>
        </div>

        <div className="hero__action-grid">
          <div className="action-card">
            <p className="action-card__title">Santa hotline fortune</p>
            <p className="action-card__body">{fortune}</p>
            <div className="hero__controls">
              <button className="btn btn-primary" type="button" onClick={handlePullFortune}>
                Pull tacky fortune
              </button>
            </div>
          </div>
          <div className="action-card action-card--holo">
            <p className="action-card__title">CRT plaza meters</p>
            <div className="meter-row">
              <span className="meter__label">Neon</span>
              <span className="meter__bar">
                <span className="meter__fill" style={{ width: '72%' }} />
              </span>
              <span className="meter__value">72%</span>
            </div>
            <div className="meter-row">
              <span className="meter__label">Snow</span>
              <span className="meter__bar">
                <span className="meter__fill meter__fill--alt" style={{ width: '92%' }} />
              </span>
              <span className="meter__value">92%</span>
            </div>
            <div className="meter-row">
              <span className="meter__label">Glow</span>
              <span className="meter__bar">
                <span className="meter__fill" style={{ width: '88%' }} />
              </span>
              <span className="meter__value">88%</span>
            </div>
          </div>
        </div>

        <div className="hero__panel">
          <div className="panel__title">CRT Status Monitor</div>
          <div className="panel__body">
            <div className="terminal terminal--glow">{terminalText}</div>
            {terminalHistory.map((line, index) => (
              <p key={index} className="terminal terminal--history">
                {line}
              </p>
            ))}
            <p className="terminal">&gt; unlock threshold: {progress}%</p>
            <p className="terminal">&gt; message: {systemMessage}</p>
            <p className="terminal">&gt; scene mode: {currentScene.name}</p>
            <p className="terminal">&gt; fortune queue: {fortune}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
