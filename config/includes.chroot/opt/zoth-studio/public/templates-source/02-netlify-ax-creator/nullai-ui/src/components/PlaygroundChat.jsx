import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Grid,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  RocketLaunch,
  ExpandMore,
  ExpandLess,
  AutoAwesome,
  Person,
  WifiTethering,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

import { fetchModels, streamChat, fetchTTS } from '../services/api'
import { useAuth } from '../app/AuthProvider'
import ChatToolsBar from './chat/ChatToolsBar'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

const MAX_HISTORY = 12
let currentAudio = null

function playAudioBlob(blob) {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  currentAudio = audio
  audio.onended = () => {
    URL.revokeObjectURL(url)
    currentAudio = null
  }
  audio.play()
}

/* ============================
   Thinking Indicator
============================ */
function ThinkingBubble() {
  const theme = useTheme()
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>
        AI_PROCESSING
      </Typography>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: theme.palette.primary.main,
          }}
        />
      ))}
    </Stack>
  )
}

export default function PlaygroundChat() {
  const { user, tier, profile, accessToken } = useAuth()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const scrollRef = useRef(null)

  const canToggleStream = tier !== 'free'
  const [streamEnabled, setStreamEnabled] = useState(true)

  useEffect(() => {
    if (tier === 'free') setStreamEnabled(true)
    else setStreamEnabled(false)
  }, [tier])

  const STORAGE_KEY = `nullai.chat.${user?.id ?? 'anon'}`

  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [
        { role: 'assistant', content: 'NullAI online.' },
      ]
    } catch {
      return [{ role: 'assistant', content: 'NullAI online.' }]
    }
  })

  /* ============================
     Autoscroll
  ============================ */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  /* ============================
     Persist (clean)
  ============================ */
  useEffect(() => {
    const clean = messages.filter((m) => m.content?.trim())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  }, [messages, STORAGE_KEY])

  /* ============================
     Load models
  ============================ */
  useEffect(() => {
    fetchModels().then((d) => {
      setModels(d?.models ?? [])
      if (d?.models?.length) setSelectedModel(d.models[0].id)
    })
  }, [])

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }

  const handleSpeak = async (text) => {
    if (!text?.trim()) return
    try {
      const blob = await fetchTTS(text, accessToken)
      playAudioBlob(blob)
    } catch (e) {
      console.error('TTS error', e)
    }
  }

  /* ============================
     Send message
  ============================ */
  const handleSend = async () => {
    if (!input.trim() || !selectedModel || loading || !accessToken) return

    const userMsg = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const cleanHistory = messages.filter(
      (m) => m.role === 'user' || (m.role === 'assistant' && m.content?.trim())
    )

    const history = [...cleanHistory, userMsg].slice(-MAX_HISTORY)

    setMessages([...history, { role: 'assistant', content: '', thinking: true }])
    setInput('')
    setLoading(true)

    let accumulated = ''

    await streamChat(
      accessToken,
      { model: selectedModel, messages: history, stream: streamEnabled },
      (chunk) => {
        accumulated += chunk
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            role: 'assistant',
            content: accumulated,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          return copy
        })
      },
      () => setLoading(false),
      (err) => {
        setMessages((prev) => [
          ...prev.filter((m) => !m.thinking),
          { role: 'assistant', content: `ERROR: ${err}` },
        ])
        setLoading(false)
      }
    )
  }

  /* ============================
     UI
  ============================ */
  return (
    <Paper
      elevation={0}
      sx={{
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        background: isDark
          ? `linear-gradient(165deg, ${alpha('#06070B', 0.95)} 0%, ${alpha('#0D1117', 0.9)} 100%)`
          : '#F8FAFC',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      {/* HEADER */}
      <Stack direction="row" spacing={2} px={3} py={2} alignItems="center">
        <RocketLaunch />
        <Typography fontWeight={800}>NULL_AI</Typography>
        <Chip size="small" label={tier.toUpperCase()} />
        <Box flex={1} />
        <IconButton onClick={() => setShowControls((v) => !v)}>
          {showControls ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Stack>

      {/* CONTROLS */}
      <AnimatePresence>
        {showControls && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
            <Box px={3} py={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField select fullWidth size="small" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    {models.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.id}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  {canToggleStream && (
                    <Button onClick={() => setStreamEnabled((v) => !v)}>
                      {streamEnabled ? 'SYNC_LIVE' : 'BUFFERED'}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT */}
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        <Stack spacing={3}>
          {messages.map((m, i) => {
            const isUser = m.role === 'user'
            const isThinking = m.thinking && !m.content

            return (
              <Stack key={i} direction="row" spacing={2} justifyContent={isUser ? 'flex-end' : 'flex-start'}>
                {!isUser && <Avatar>AI</Avatar>}
                <Paper sx={{ p: 2.5, maxWidth: '75%' }}>
                  {isThinking ? (
                    <ThinkingBubble />
                  ) : (
                    <>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{m.content}</Typography>
                      {!isUser && (
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton onClick={() => handleSpeak(m.content)}><VolumeUpIcon fontSize="small" /></IconButton>
                          <IconButton onClick={() => handleCopy(m.content)}><ContentCopyIcon fontSize="small" /></IconButton>
                        </Stack>
                      )}
                    </>
                  )}
                </Paper>
                {isUser && <Avatar src={profile?.avatar_url}><Person /></Avatar>}
              </Stack>
            )
          })}
        </Stack>
      </Box>

      {/* INPUT */}
      <Box p={2}>
        <ChatToolsBar messages={messages} onClear={() => setMessages([{ role: 'assistant', content: 'History purged.' }])} />
        <Stack direction="row" spacing={2} mt={2}>
          <TextField fullWidth multiline value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
          }} />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : <AutoAwesome />}
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}
