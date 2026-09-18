import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

// YouTube iframe API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const PLAYLIST_ID = 'PLKpbujdOpFCjfUbvb0nrrtZGIGKdsnG90';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!apiReady || !containerRef.current) return;

    playerRef.current = new window.YT.Player('youtube-audio-player', {
      playerVars: {
        listType: 'playlist',
        list: PLAYLIST_ID,
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        playsinline: 1,
        origin: typeof window !== 'undefined' ? window.location.origin : '',
        enablejsapi: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(50);
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [apiReady]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !apiReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  }, [isPlaying, apiReady]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current || !apiReady) return;
    if (isMuted) {
      playerRef.current.unMute?.();
      setIsMuted(false);
    } else {
      playerRef.current.mute?.();
      setIsMuted(true);
    }
  }, [isMuted, apiReady]);

  return (
    <>
      {/* Hidden YouTube player — keep mounted, don't use display:none */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div id="youtube-audio-player" />
      </div>

      {/* Visible audio toggle */}
      <button
        onClick={togglePlay}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-300 px-3 py-2 rounded-full text-xs font-bold hover:bg-zinc-800 hover:text-white transition-all shadow-lg"
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        <Music className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{isPlaying ? 'Playing' : 'Music'}</span>
      </button>

      {/* Mute toggle (only when playing) */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="fixed bottom-4 right-[90px] z-50 flex items-center justify-center w-8 h-8 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-300 rounded-full text-xs hover:bg-zinc-800 hover:text-white transition-all shadow-lg sm:right-[110px]"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      )}
    </>
  );
};

export default AudioPlayer;
