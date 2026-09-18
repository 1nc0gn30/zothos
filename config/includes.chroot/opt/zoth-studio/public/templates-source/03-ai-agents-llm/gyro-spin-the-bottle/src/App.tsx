import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCw, Wine, Volume2, Sparkles, Smartphone } from 'lucide-react';
import { Header } from './components/Header';
import { PartyRoom } from './components/PartyRoom';
import { ThreeBottleCanvas } from './components/ThreeBottleCanvas';
import { FAQSection } from './components/FAQSection';
import { soundFx } from './utils/audio';
import { generatePartyPrompt, PromptCategory } from './utils/prompts';

const SPIN_DURATION_MS = 4200;
const DEFAULT_PLAYERS = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Quinn'];

function normalizeDegrees(deg: number): number {
  const norm = deg % 360;
  return norm < 0 ? norm + 360 : norm;
}

function getSectorIndex(rotation: number, totalSectors: number): number {
  const tipAngle = normalizeDegrees(rotation - 90);
  const slice = 360 / totalSectors;
  const index = Math.floor(normalizeDegrees(tipAngle + slice / 2) / slice);
  return index % totalSectors;
}

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedSector, setHighlightedSector] = useState<number | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [motionDenied, setMotionDenied] = useState(false);

  // Advanced features state
  const [gameMode, setGameMode] = useState<'classic' | 'party'>('classic');
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('truth');
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getMuted());
  const [use3D, setUse3D] = useState<boolean>(true);
  const [showFAQ, setShowFAQ] = useState<boolean>(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('Welcome to Gyro Spin Bottle.');

  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const stopTimeoutRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const shakeSupported = useMemo(
    () => typeof window !== 'undefined' && 'DeviceMotionEvent' in window,
    []
  );

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  // Clean up timeouts and animation frame on unmount
  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current !== null) window.clearTimeout(stopTimeoutRef.current);
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const totalSectors = gameMode === 'party' ? players.length : 8;

  // Spin execution engine
  const spinBottle = useCallback(() => {
    if (isSpinningRef.current) return;

    soundFx.playSpinStart();
    const extraTurns = 7 + Math.floor(Math.random() * 6);
    const targetWithinCircle = Math.random() * 360;
    const startRot = rotationRef.current;
    const targetRotation = startRot + extraTurns * 360 + targetWithinCircle;

    setIsSpinning(true);
    setHighlightedSector(null);
    setActivePrompt(null);
    setRotation(targetRotation);
    rotationRef.current = targetRotation;

    setLiveAnnouncement('The bottle is spinning rapidly...');

    if (stopTimeoutRef.current !== null) window.clearTimeout(stopTimeoutRef.current);
    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);

    // Audio tick simulation loop during physics spin
    const startTime = performance.now();
    let lastSector = getSectorIndex(startRot, totalSectors);

    const tickLoop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / SPIN_DURATION_MS);
      // Cubic ease out curve matching CSS rotation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRot + (targetRotation - startRot) * easeOut;

      const currentSec = getSectorIndex(currentRot, totalSectors);
      if (currentSec !== lastSector) {
        soundFx.playTick(1 - progress);
        lastSector = currentSec;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tickLoop);
      }
    };
    animFrameRef.current = requestAnimationFrame(tickLoop);

    // Landing resolution
    stopTimeoutRef.current = window.setTimeout(async () => {
      setIsSpinning(false);
      const landedSector = getSectorIndex(targetRotation, totalSectors);
      setHighlightedSector(landedSector);
      soundFx.playLanding();

      if (gameMode === 'party' && players[landedSector]) {
        const chosenPlayer = players[landedSector];
        setIsGeneratingPrompt(true);
        setLiveAnnouncement(`Bottle landed on ${chosenPlayer}! Generating challenge...`);
        const prompt = await generatePartyPrompt(selectedCategory, chosenPlayer);
        setActivePrompt(prompt);
        setIsGeneratingPrompt(false);
        setLiveAnnouncement(`Bottle landed on ${chosenPlayer}! Challenge: ${prompt}`);
      } else {
        const label = `Sector ${landedSector + 1}`;
        setLiveAnnouncement(`The bottle landed on ${label}.`);
      }
    }, SPIN_DURATION_MS);
  }, [gameMode, players, selectedCategory, totalSectors]);

  // Request Gyroscope permissions
  const requestMotionPermission = useCallback(async () => {
    if (!shakeSupported) return;
    const motionEvent = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    try {
      if (typeof motionEvent.requestPermission === 'function') {
        const result = await motionEvent.requestPermission();
        const granted = result === 'granted';
        setMotionEnabled(granted);
        setMotionDenied(!granted);
        soundFx.playClick();
        return;
      }
      setMotionEnabled(true);
      setMotionDenied(false);
      soundFx.playClick();
    } catch {
      setMotionEnabled(false);
      setMotionDenied(true);
    }
  }, [shakeSupported]);

  // Device Motion Shake Sensor
  useEffect(() => {
    if (!motionEnabled) return;

    let lastMagnitude = 0;
    let lastShakeAt = 0;
    const threshold = 14;
    const cooldownMs = 1200;

    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity ?? event.acceleration;
      if (!acc) return;
      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const delta = Math.abs(magnitude - lastMagnitude);
      lastMagnitude = magnitude;
      const now = Date.now();

      if (delta > threshold && now - lastShakeAt > cooldownMs && !isSpinningRef.current) {
        lastShakeAt = now;
        spinBottle();
      }
    };

    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [motionEnabled, spinBottle]);

  // Keyboard Hotkey Accessibility Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys when typing in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyS') {
        e.preventDefault();
        spinBottle();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        const muted = soundFx.toggleMute();
        setIsMuted(muted);
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        setGameMode((prev) => (prev === 'classic' ? 'party' : 'classic'));
        soundFx.playClick();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        setRotation(0);
        setHighlightedSector(null);
        setActivePrompt(null);
        soundFx.playClick();
      } else if (e.code === 'Digit3' || e.code === 'KeyB') {
        e.preventDefault();
        setUse3D((prev) => !prev);
        soundFx.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spinBottle]);

  // Player roster handlers
  const handleAddPlayer = (name: string) => {
    setPlayers((prev) => [...prev, name]);
    soundFx.playClick();
  };

  const handleRemovePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
    soundFx.playClick();
  };

  const handleRegeneratePrompt = async () => {
    if (highlightedSector === null || !players[highlightedSector]) return;
    const chosenPlayer = players[highlightedSector];
    setIsGeneratingPrompt(true);
    soundFx.playClick();
    const prompt = await generatePartyPrompt(selectedCategory, chosenPlayer);
    setActivePrompt(prompt);
    setIsGeneratingPrompt(false);
  };

  return (
    <>
      {/* Skip Navigation Link for Keyboard / Screen Readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ARIA Live Region for Status & Outcomes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="app-container">
        <Header
          isSpinning={isSpinning}
          gameMode={gameMode}
          onToggleGameMode={(mode) => {
            setGameMode(mode);
            soundFx.playClick();
          }}
          isMuted={isMuted}
          onToggleMute={() => {
            const muted = soundFx.toggleMute();
            setIsMuted(muted);
          }}
          use3D={use3D}
          onToggle3D={() => {
            setUse3D(!use3D);
            soundFx.playClick();
          }}
          onOpenFAQ={() => {
            setShowFAQ(true);
            soundFx.playClick();
          }}
        />

        <main id="main-content" tabIndex={-1} className="spin-main-layout" role="main">
          {/* Spin Arena Section */}
          <section className="arena-wrapper" aria-label="3D Spin Arena" role="region">
            <div className="arena">
              {/* Sector Glow Zones */}
              <div className="glow-ring" aria-hidden="true">
                {Array.from({ length: totalSectors }, (_, index) => {
                  const angle = index * (360 / totalSectors);
                  const isHighlighted = highlightedSector === index;
                  const label = gameMode === 'party' ? players[index] : `P${index + 1}`;

                  return (
                    <div
                      key={`zone-${index}`}
                      className={`glow-zone ${isHighlighted ? 'active' : ''}`}
                      style={{
                        transform: `rotate(${angle}deg) translateY(-17.2rem)`,
                      }}
                    >
                      <span
                        className="zone-label"
                        style={{ transform: `rotate(${-angle}deg)` }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottle Rendering Stage: 3D WebGL vs 2D SVG */}
              <div className="bottle-stage">
                {use3D ? (
                  <ThreeBottleCanvas
                    rotationDeg={rotation}
                    isSpinning={isSpinning}
                    onFlickSpin={spinBottle}
                  />
                ) : (
                  <div
                    className="bottle-icon-wrap"
                    style={{ transform: `translate(-50%, -50%) rotate(${rotation - 90}deg)` }}
                    onClick={spinBottle}
                    role="button"
                    tabIndex={0}
                    aria-label="Bottle - Click to spin"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') spinBottle();
                    }}
                  >
                    <Wine className="bottle-icon" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Party Room Controls if in Party Mode */}
          {gameMode === 'party' && (
            <PartyRoom
              players={players}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                soundFx.playClick();
              }}
              activePrompt={activePrompt}
              selectedPlayerName={
                highlightedSector !== null && players[highlightedSector]
                  ? players[highlightedSector]
                  : null
              }
              isGeneratingPrompt={isGeneratingPrompt}
              onRegeneratePrompt={handleRegeneratePrompt}
              onCompleteChallenge={() => {
                setActivePrompt(null);
                soundFx.playClick();
              }}
            />
          )}

          {/* Main Controls Section */}
          <section className="controls" aria-label="Game controls" role="region">
            <button
              type="button"
              className="spin-button"
              onClick={spinBottle}
              disabled={isSpinning}
              aria-label={isSpinning ? 'Bottle is spinning...' : 'Spin Bottle'}
            >
              <RotateCw className={isSpinning ? 'btn-icon spinning' : 'btn-icon'} />
              <span>{isSpinning ? 'Spinning...' : 'Spin Bottle'}</span>
            </button>

            {shakeSupported && !motionEnabled && (
              <button
                type="button"
                className="shake-button"
                onClick={requestMotionPermission}
              >
                <Smartphone className="inline-icon" /> Enable Shake To Spin
              </button>
            )}

            {motionEnabled && (
              <p className="motion-hint">
                <Smartphone className="inline-icon glow" /> Gyroscope Active: Shake phone to spin!
              </p>
            )}

            {motionDenied && (
              <p className="motion-hint error">Motion permission denied. Use Spin button or Spacebar.</p>
            )}

            {/* Keyboard Hotkey Badge List */}
            <div className="hotkey-bar" aria-label="Keyboard Shortcuts">
              <span className="hotkey-item"><kbd>Space</kbd> / <kbd>S</kbd> Spin</span>
              <span className="hotkey-item"><kbd>M</kbd> Mute</span>
              <span className="hotkey-item"><kbd>P</kbd> Party Mode</span>
              <span className="hotkey-item"><kbd>R</kbd> Reset</span>
            </div>
          </section>
        </main>

        {/* FAQ Modal */}
        {showFAQ && <FAQSection onClose={() => setShowFAQ(false)} />}
      </div>
    </>
  );
}
