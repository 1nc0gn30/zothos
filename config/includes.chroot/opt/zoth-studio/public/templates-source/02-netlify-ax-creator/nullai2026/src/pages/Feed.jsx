import { useEffect, useState } from 'react'
import { Container, Paper, Stack, TextField, Button, Typography, Divider, Box, Avatar, alpha, useTheme, Skeleton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../app/AuthProvider'
import HubIcon from '@mui/icons-material/Hub'
import { toast } from 'sonner'

const FEED_STORAGE_KEY = 'nullai-feed-posts'

export default function Feed() {
  const theme = useTheme()
  const { profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate network delay for skeleton
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(FEED_STORAGE_KEY)
        if (raw) {
          setPosts(JSON.parse(raw))
        }
      } catch (error) {
        console.error('Failed loading feed:', error)
      } finally {
        setLoading(false)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const persistPosts = (nextPosts) => {
    setPosts(nextPosts)
    localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(nextPosts))
  }

  const handleBroadcast = async () => {
    if (!content.trim() || isBroadcasting) return

    setIsBroadcasting(true)

    const newPost = {
      id: crypto.randomUUID(),
      content: content.trim(),
      dislikes: 0,
      created_at: new Date().toISOString(),
      profiles: {
        operator_signature: profile?.operator_signature || 'LOCAL_OP',
        avatar_url: profile?.avatar_url || '',
      },
    }

    const nextPosts = [newPost, ...posts]
    persistPosts(nextPosts)
    setContent('')
    setIsBroadcasting(false)
    toast.success('SIGNAL BROADCASTED')
  }

  const handleDislike = (postId) => {
    const nextPosts = posts
      .map((post) => (post.id === postId ? { ...post, dislikes: (post.dislikes || 0) + 1 } : post))
      .filter((post) => (post.dislikes || 0) < 10)

    persistPosts(nextPosts)
  }

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 12, md: 16 }, pb: 10 }}>
      <Stack spacing={4}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.2em', fontSize: 12, fontWeight: 900 }}>
              CREATOR OF ZOTH
            </Typography>
            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -0.5 }}>
              Broadcast
            </Typography>
          </Box>
        </Stack>
        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.8), borderRadius: '16px', border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, backdropFilter: 'blur(20px)' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontFamily: 'monospace', color: 'primary.main', fontWeight: 900 }}>
            {`// BROADCAST_INTEL`}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Initialize signal..."
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontFamily: 'monospace', bgcolor: alpha('#000', 0.2) } }}
          />
          <Button variant="contained" onClick={handleBroadcast} disabled={isBroadcasting} startIcon={<HubIcon />} sx={{ fontWeight: 900, px: 4 }}>
            {isBroadcasting ? 'TRANSMITTING...' : 'SEND SIGNAL'}
          </Button>
        </Paper>

        <Stack spacing={2.5}>
          {loading ? (
            Array.from(new Array(3)).map((_, idx) => (
              <Paper key={idx} sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.4) }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box>
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={150} />
                  </Box>
                </Stack>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={120} />
              </Paper>
            ))
          ) : (
            <AnimatePresence>
            {posts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Paper sx={{ p: 3, borderLeft: `4px solid ${theme.palette.primary.main}`, bgcolor: alpha(theme.palette.background.paper, 0.4), position: 'relative', overflow: 'hidden', transition: 'border-color 0.25s ease, transform 0.2s ease', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}>
                  <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: `repeating-linear-gradient(0deg, transparent, transparent 1px, ${theme.palette.success.main} 1px, ${theme.palette.success.main} 2px)`, backgroundSize: '100% 3px' }} />

                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar src={post.profiles?.avatar_url} sx={{ width: 32, height: 32, border: `1px solid ${theme.palette.primary.main}` }}>
                      {post.profiles?.operator_signature?.[0] || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block' }}>
                        {post.profiles?.operator_signature || 'Local Op'}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.5, fontFamily: 'monospace' }}>
                        {new Date(post.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography sx={{ mb: 2, fontSize: '1.05rem', lineHeight: 1.6 }}>{post.content}</Typography>

                  <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button size="small" color="error" variant="outlined" onClick={() => handleDislike(post.id)} sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.7rem' }}>
                      [VOTE_OFF_FEED: {post.dislikes || 0}]
                    </Button>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.3 }}>
                      STATUS: ACTIVE_SIGNAL
                    </Typography>
                  </Stack>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
