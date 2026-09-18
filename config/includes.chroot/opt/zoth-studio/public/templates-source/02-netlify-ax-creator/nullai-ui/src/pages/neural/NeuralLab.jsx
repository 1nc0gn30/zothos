import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Slider,
  Button,
  TextField,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NeuronCanvas from './NeuronCanvas';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TuneIcon from '@mui/icons-material/Tune';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import TvIcon from '@mui/icons-material/Tv';
import GridViewIcon from '@mui/icons-material/GridView';

// Simulated benchmark data
const BENCHMARK_MODELS = [
  { id: 'hermes-3-8b', name: 'Hermes 3 (Llama 3 8B Q4_K_M)', type: 'Local Edge', ttft: 28, throughput: 54.2, perplexity: 5.12, vram: 4.82, score: 96 },
  { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder 7B', type: 'Local Code Core', ttft: 34, throughput: 49.8, perplexity: 5.48, vram: 4.20, score: 92 },
  { id: 'deepseek-r1-distill', name: 'DeepSeek R1 Distill (8B)', type: 'Reasoning Core', ttft: 45, throughput: 41.5, perplexity: 4.89, vram: 5.10, score: 98 },
  { id: 'gpt-4o-cloud', name: 'GPT-4o (Cloud API Gateway)', type: 'Cloud Gateway', ttft: 180, throughput: 82.0, perplexity: 4.65, vram: 0.0, score: 95 },
];

const PRESET_PROMPTS = [
  { label: 'Rust Lock-Free Ring Buffer', prompt: 'Write an ultra-fast zero-allocation lock-free ring buffer in Rust with AtomicPtr and cache-line padding.' },
  { label: 'Neuromorphic Agent Architecture', prompt: 'Speculate on the architectural blueprint of 2030 neuromorphic edge agents operating without backpropagation.' },
  { label: 'CVE Exploit Root Cause', prompt: 'Explain the exact memory alignment vulnerability and signal race condition in OpenSSH CVE-2024-6387 (RegreSSHion).' },
  { label: 'Wasm SIMD Matrix Multiply', prompt: 'Implement a vectorized 4x4 matrix multiplication kernel using WebAssembly SIMD intrinsics.' }
];

export default function NeuralLab() {
  const theme = useTheme();
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [activeHead, setActiveHead] = useState(0);
  const [contextWindow, setContextWindow] = useState(8192);
  const [freqPenalty, setFreqPenalty] = useState(0.0);
  
  // Toggles
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Comparator States
  const [promptText, setPromptText] = useState(PRESET_PROMPTS[0].prompt);
  const [isComparing, setIsComparing] = useState(false);
  const [outputLowTemp, setOutputLowTemp] = useState('');
  const [outputHighTemp, setOutputHighTemp] = useState('');

  // Benchmark States
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState(BENCHMARK_MODELS);
  const [benchmarkProgress, setBenchmarkProgress] = useState(100);

  // Audio synthesizer
  const playTone = (freq = 600, duration = 0.05) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.01);
    } catch {}
  };

  const handleRunComparator = async () => {
    if (isComparing || !promptText.trim()) return;
    setIsComparing(true);
    setOutputLowTemp('');
    setOutputHighTemp('');
    playTone(520, 0.1);

    const lowTempSample = `// [DETERMINISTIC INFERENCE - TEMP: 0.10 // TOP_P: 0.85]
use std::sync::atomic::{AtomicUsize, Ordering};
use std::cell::UnsafeCell;

#[repr(align(64))]
pub struct LockFreeRingBuffer<T, const CAP: usize> {
    head: AtomicUsize,
    _pad1: [u8; 56],
    tail: AtomicUsize,
    _pad2: [u8; 56],
    buffer: [UnsafeCell<Option<T>>; CAP],
}

impl<T, const CAP: usize> LockFreeRingBuffer<T, CAP> {
    pub const fn new() -> Self {
        assert!(CAP.is_power_of_two(), "Capacity must be power of 2");
        Self {
            head: AtomicUsize::new(0),
            _pad1: [0; 56],
            tail: AtomicUsize::new(0),
            _pad2: [0; 56],
            buffer: [const { UnsafeCell::new(None) }; CAP],
        }
    }
}
// Zero heap allocations. Predictable cache-line residency. Execution time: 24ms.`;

    const highTempSample = `// [CREATIVE / SPECULATIVE INFERENCE - TEMP: 1.20 // TOP_P: 0.95]
// Neuromorphic Parallel Quantum Stream Model:
// In a non-deterministic distributed ring, memory is perceived as a continuous fluid wave.
// Rather than fixed atomic pointers, we inject temporal state matrices with stochastic phase alignment:

pub struct QuantumPulseRing<T> {
    superposition_index: AtomicUsize,
    entropy_gradient: f64,
    wave_collapser: Box<dyn Fn() -> T + Send + Sync>,
}

// Speculative execution paths fork on low-confidence token probabilities.
// Latency: 38ms | Perplexity: 7.82 | Novel Synthesis Index: 94.2%`;

    // Stream out words with realistic pacing
    const wordsLow = lowTempSample.split(' ');
    const wordsHigh = highTempSample.split(' ');

    const maxLen = Math.max(wordsLow.length, wordsHigh.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < wordsLow.length) {
        setOutputLowTemp((prev) => (prev ? prev + ' ' : '') + wordsLow[i]);
      }
      if (i < wordsHigh.length) {
        setOutputHighTemp((prev) => (prev ? prev + ' ' : '') + wordsHigh[i]);
      }
      if (i % 8 === 0) playTone(700 + Math.random() * 200, 0.02);
      await new Promise((r) => setTimeout(r, 22));
    }

    setIsComparing(false);
    playTone(880, 0.15);
  };

  const handleRunBenchmark = async () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setBenchmarkProgress(0);
    playTone(440, 0.1);

    for (let p = 0; p <= 100; p += 10) {
      setBenchmarkProgress(p);
      playTone(500 + p * 4, 0.03);
      await new Promise((r) => setTimeout(r, 120));
    }

    setBenchmarkResults([
      { id: 'hermes-3-8b', name: 'Hermes 3 (Llama 3 8B Q4_K_M)', type: 'Local Edge', ttft: 26 + Math.floor(Math.random() * 5), throughput: Number((52 + Math.random() * 6).toFixed(1)), perplexity: 5.08, vram: 4.82, score: 97 },
      { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder 7B', type: 'Local Code Core', ttft: 32 + Math.floor(Math.random() * 4), throughput: Number((48 + Math.random() * 5).toFixed(1)), perplexity: 5.42, vram: 4.20, score: 93 },
      { id: 'deepseek-r1-distill', name: 'DeepSeek R1 Distill (8B)', type: 'Reasoning Core', ttft: 42 + Math.floor(Math.random() * 6), throughput: Number((40 + Math.random() * 4).toFixed(1)), perplexity: 4.85, vram: 5.10, score: 99 },
      { id: 'gpt-4o-cloud', name: 'GPT-4o (Cloud API Gateway)', type: 'Cloud Gateway', ttft: 175 + Math.floor(Math.random() * 25), throughput: Number((80 + Math.random() * 10).toFixed(1)), perplexity: 4.62, vram: 0.0, score: 95 },
    ]);

    setIsBenchmarking(false);
    playTone(1046, 0.2);
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        bgcolor: '#040711',
        color: '#f0f3ff',
        pt: { xs: 8, md: 10 },
        pb: 8,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background Matrix Rain */}
      {matrixEnabled && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.08,
            background: 'radial-gradient(circle at 50% 50%, #00f0ff 0%, transparent 80%)',
          }}
        />
      )}

      {/* CRT Scanline Overlay */}
      {crtEnabled && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%)',
            backgroundSize: '100% 4px',
          }}
        />
      )}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
        {/* Header Bar */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ p: 1, bgcolor: 'rgba(31, 182, 255, 0.1)', border: '1px solid #1fb6ff', borderRadius: 2 }}>
                <MemoryIcon sx={{ color: '#1fb6ff' }} />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: '#1fb6ff', letterSpacing: 3, fontWeight: 800 }}>
                  NEURAL WEIGHTS & INFERENCE LAB
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -0.5, color: '#ffffff' }}>
                  Cognitive Layer Studio
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant={crtEnabled ? 'contained' : 'outlined'}
              onClick={() => setCrtEnabled(!crtEnabled)}
              startIcon={<TvIcon />}
              sx={{ fontFamily: 'monospace', fontSize: '0.75rem', borderColor: '#1fb6ff' }}
            >
              CRT: {crtEnabled ? 'ON' : 'OFF'}
            </Button>
            <Button
              size="small"
              variant={matrixEnabled ? 'contained' : 'outlined'}
              onClick={() => setMatrixEnabled(!matrixEnabled)}
              startIcon={<GridViewIcon />}
              sx={{ fontFamily: 'monospace', fontSize: '0.75rem', borderColor: '#1fb6ff' }}
            >
              HEX: {matrixEnabled ? 'ON' : 'OFF'}
            </Button>
            <IconButton onClick={() => setAudioEnabled(!audioEnabled)} sx={{ color: '#1fb6ff' }}>
              {audioEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {/* SECTION 1: INTERACTIVE NEURON ACTIVATION CANVAS & PARAMETERS */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                bgcolor: 'rgba(11, 18, 32, 0.85)',
                border: '1px solid rgba(31, 182, 255, 0.25)',
                borderRadius: 3,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'monospace', color: '#1fb6ff' }}>
                  ▶ NEURON ACTIVATION & ATTENTION MATRIX
                </Typography>
                <Chip label={`ACTIVE HEAD: ${activeHead}`} size="small" sx={{ bgcolor: 'rgba(31, 182, 255, 0.15)', color: '#1fb6ff', fontFamily: 'monospace' }} />
              </Stack>

              <NeuronCanvas
                temperature={temperature}
                topP={topP}
                activeHead={activeHead}
                isProcessing={isComparing || isBenchmarking}
                themeColor="#1fb6ff"
              />

              {/* Parameter Sliders */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                    TEMPERATURE: <strong>{temperature.toFixed(2)}</strong>
                  </Typography>
                  <Slider
                    value={temperature}
                    min={0.0}
                    max={2.0}
                    step={0.05}
                    onChange={(_, v) => setTemperature(v)}
                    sx={{ color: '#1fb6ff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                    TOP_P NUCLEUS: <strong>{topP.toFixed(2)}</strong>
                  </Typography>
                  <Slider
                    value={topP}
                    min={0.05}
                    max={1.0}
                    step={0.05}
                    onChange={(_, v) => setTopP(v)}
                    sx={{ color: '#00ff88' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                    ATTENTION HEAD: <strong>HEAD {activeHead}</strong>
                  </Typography>
                  <Slider
                    value={activeHead}
                    min={0}
                    max={7}
                    step={1}
                    onChange={(_, v) => setActiveHead(v)}
                    sx={{ color: '#ffaa00' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECTION 2: PROMPT COMPLETION LATENCY BENCHMARKER */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'rgba(11, 18, 32, 0.85)',
                border: '1px solid rgba(31, 182, 255, 0.25)',
                borderRadius: 3,
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'monospace', color: '#00ff88' }}>
                  ⚡ INFERENCE BENCHMARKER
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleRunBenchmark}
                  disabled={isBenchmarking}
                  startIcon={<SpeedIcon />}
                  sx={{ bgcolor: '#00ff88', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#00cc66' } }}
                >
                  {isBenchmarking ? 'BENCHMARKING...' : 'RUN BENCHMARK'}
                </Button>
              </Stack>

              {isBenchmarking && <LinearProgress variant="determinate" value={benchmarkProgress} sx={{ mb: 2, height: 4, borderRadius: 2 }} />}

              <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                {benchmarkResults.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(5, 7, 13, 0.7)',
                      border: '1px solid rgba(148, 163, 184, 0.15)',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', fontSize: '0.8rem' }}>
                        {m.name}
                      </Typography>
                      <Chip label={`${m.score} PTS`} size="small" sx={{ bgcolor: 'rgba(0, 255, 136, 0.15)', color: '#00ff88', fontWeight: 800, fontSize: '0.65rem' }} />
                    </Stack>

                    <Grid container spacing={1} sx={{ mt: 1, fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      <Grid item xs={6}>TTFT: <strong style={{ color: '#1fb6ff' }}>{m.ttft} ms</strong></Grid>
                      <Grid item xs={6}>SPEED: <strong style={{ color: '#00ff88' }}>{m.throughput} T/s</strong></Grid>
                      <Grid item xs={6}>LOSS: <strong style={{ color: '#ffaa00' }}>{m.perplexity}</strong></Grid>
                      <Grid item xs={6}>VRAM: <strong style={{ color: '#ff4fcf' }}>{m.vram ? `${m.vram} GB` : 'API'}</strong></Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* SECTION 3: TEMPERATURE & TOP_P PARAMETER RESPONSE COMPARATOR */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                bgcolor: 'rgba(11, 18, 32, 0.85)',
                border: '1px solid rgba(31, 182, 255, 0.25)',
                borderRadius: 3,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'monospace', color: '#ff4fcf' }}>
                  ⚖ DUAL-PARAMETER RESPONSE COMPARATOR (LOW TEMP VS HIGH TEMP)
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {PRESET_PROMPTS.map((p, i) => (
                    <Chip
                      key={i}
                      label={p.label}
                      size="small"
                      clickable
                      onClick={() => setPromptText(p.prompt)}
                      sx={{ bgcolor: 'rgba(255, 79, 207, 0.1)', color: '#ff4fcf', border: '1px solid rgba(255, 79, 207, 0.3)', fontSize: '0.7rem' }}
                    />
                  ))}
                </Stack>
              </Stack>

              {/* Prompt Input */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter evaluation prompt..."
                  sx={{
                    bgcolor: 'rgba(5, 7, 13, 0.8)',
                    borderRadius: 2,
                    '& .MuiInputBase-input': { color: '#ffffff', fontFamily: 'monospace', fontSize: '0.85rem' },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleRunComparator}
                  disabled={isComparing}
                  startIcon={<CompareArrowsIcon />}
                  sx={{
                    px: 3,
                    bgcolor: '#ff4fcf',
                    color: '#000',
                    fontWeight: 800,
                    minWidth: 160,
                    '&:hover': { bgcolor: '#e03eb0' },
                  }}
                >
                  {isComparing ? 'COMPARING...' : 'COMPARE IN REALTIME'}
                </Button>
              </Stack>

              {/* Split-Pane Output */}
              <Grid container spacing={2}>
                {/* Left Pane: Deterministic Low Temp */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(5, 7, 13, 0.9)',
                      border: '1px solid rgba(31, 182, 255, 0.3)',
                      borderRadius: 2,
                      minHeight: 220,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#1fb6ff', fontWeight: 800, fontFamily: 'monospace' }}>
                        DETERMINISTIC // TEMP: 0.10 (GREEDY SAMPLING)
                      </Typography>
                      <Chip label="CODE & REASONING" size="small" sx={{ bgcolor: 'rgba(31, 182, 255, 0.15)', color: '#1fb6ff', fontSize: '0.65rem' }} />
                    </Stack>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        color: '#67e8f9',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.5,
                      }}
                    >
                      {outputLowTemp || 'Awaiting comparison dispatch...'}
                    </Box>
                  </Paper>
                </Grid>

                {/* Right Pane: Speculative High Temp */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(5, 7, 13, 0.9)',
                      border: '1px solid rgba(255, 79, 207, 0.3)',
                      borderRadius: 2,
                      minHeight: 220,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#ff4fcf', fontWeight: 800, fontFamily: 'monospace' }}>
                        SPECULATIVE // TEMP: 1.20 (STOCHASTIC NUCLEUS)
                      </Typography>
                      <Chip label="CREATIVE SYNTHESIS" size="small" sx={{ bgcolor: 'rgba(255, 79, 207, 0.15)', color: '#ff4fcf', fontSize: '0.65rem' }} />
                    </Stack>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        color: '#f472b6',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.5,
                      }}
                    >
                      {outputHighTemp || 'Awaiting comparison dispatch...'}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
