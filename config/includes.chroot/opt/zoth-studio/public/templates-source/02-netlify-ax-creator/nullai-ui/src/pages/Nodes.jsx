import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  IconButton,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import CloseIcon from '@mui/icons-material/Close'

/* ===========================
   LEAFLET ICON FIX
=========================== */
delete L.Icon.Default.prototype._getIconUrl

/* ===========================
   NODE ICON (DARK/LIGHT + GLITCH)
=========================== */
const createNodeIcon = (active, theme) =>
  L.divIcon({
    className: '',
    html: `
      <div class="node-wrap ${active ? 'active' : ''} ${theme.palette.mode}">
        <div class="node-core"></div>
        <div class="node-glitch"></div>
      </div>

      <style>
        .node-wrap {
          position: relative;
          width: 28px;
          height: 28px;
        }

        .node-core {
          position:absolute;
          inset:7px;
          border-radius:50%;
          background:#0f172a;
          box-shadow:0 0 6px rgba(0,0,0,.45);
        }

        .dark .node-core {
          background:${theme.palette.primary.main};
          box-shadow:
            0 0 16px ${theme.palette.primary.main},
            0 0 40px ${theme.palette.primary.main};
        }

        .light .node-core {
          background:#1e293b;
          box-shadow:
            0 0 12px rgba(30,41,59,.55),
            0 0 28px rgba(30,41,59,.35);
        }

        .node-wrap.active .node-core {
          animation: corePulse 2.2s infinite ease-in-out;
        }

        .node-glitch {
          position:absolute;
          inset:-6px;
          border-radius:50%;
          border:1px solid rgba(34,211,238,.45);
          opacity:.4;
          animation: glitchRing 3s infinite steps(2,end);
          mix-blend-mode: screen;
        }

        @keyframes corePulse {
          0% { transform:scale(1); opacity:.9 }
          50% { transform:scale(1.35); opacity:.55 }
          100% { transform:scale(1); opacity:.9 }
        }

        @keyframes glitchRing {
          0% { clip-path: inset(0 0 0 0) }
          15% { clip-path: inset(10% 0 65% 0) }
          30% { clip-path: inset(55% 0 20% 0) }
          45% { clip-path: inset(30% 0 45% 0) }
          100% { clip-path: inset(0 0 0 0) }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

/* ===========================
   NODE DATA
=========================== */
const NODES = [
  {
    id: 'va-us-01',
    name: 'Virginia Beach',
    country: 'United States',
    position: [36.8529, -75.978],
    active: true,
    fact: 'Primary East Coast operator hub.',
    stats: {
      usersOnline: 42,
      cpuLoad: '37%',
      ramUsage: '18.2 GB',
      tier: 'Dedicated',
      open: true,
    },
  },
  { id: 'lon-uk-01', name: 'London', country: 'United Kingdom', position: [51.5072, -0.1276], active: false },
  { id: 'tok-jp-01', name: 'Tokyo', country: 'Japan', position: [35.6895, 139.6917], active: false },
  { id: 'fra-de-01', name: 'Frankfurt', country: 'Germany', position: [50.1109, 8.6821], active: false },
]

/* ===========================
   MAIN COMPONENT
=========================== */
export default function Nodes() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const mapRef = useRef(null)

  const [selectedNode, setSelectedNode] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <Box sx={{ height: '100dvh', position: 'relative', overflow: 'hidden' }}>
      {/* ===== SPACE BACKGROUND ===== */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(34,211,238,.22), transparent 42%),
            radial-gradient(circle at 80% 70%, rgba(99,102,241,.22), transparent 46%),
            radial-gradient(circle at 50% 50%, #02030a, #000)
          `,
          animation: 'nebula 80s linear infinite',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(transparent 94%, rgba(255,255,255,.05)), radial-gradient(rgba(255,255,255,.14) 1px, transparent 1px)',
            backgroundSize: '100% 4px, 3px 3px',
            opacity: 0.18,
            animation: 'stars 140s linear infinite',
          },
          '@keyframes nebula': {
            from: { backgroundPosition: '0% 0%' },
            to: { backgroundPosition: '200% 200%' },
          },
          '@keyframes stars': {
            from: { transform: 'translateY(0)' },
            to: { transform: 'translateY(-260px)' },
          },
        }}
      />

      {/* ===== MAP ===== */}
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={6}
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1}
        zoomControl={false}
        attributionControl={false}
        whenCreated={(map) => (mapRef.current = map)}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
      >
        <TileLayer
          url={
            isDark
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          noWrap
        />

        {NODES.map((node) => (
          <Marker
            key={node.id}
            position={node.position}
            icon={createNodeIcon(node.active, theme)}
            eventHandlers={{
              click: () => {
                setSelectedNode(node)
                setPanelOpen(true)
              },
            }}
          />
        ))}
      </MapContainer>

      {/* ===== LIQUID WATERMARK ===== */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          zIndex: 500,
          fontSize: { xs: 20, md: 34 },
          fontWeight: 900,
          letterSpacing: '0.14em',
          opacity: 0.24,
          background:
            'linear-gradient(90deg,#22d3ee,#818cf8,#22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(.4px) drop-shadow(0 0 22px rgba(34,211,238,.45))',
          animation: 'liquid 5.5s ease-in-out infinite',
          pointerEvents: 'none',
          '@keyframes liquid': {
            '0%,100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
        }}
      >
        GLOBAL COMPUTE NODES
      </Typography>

      {/* ===== NODE PANEL (DATAMOSH GLITCH) ===== */}
      {selectedNode && panelOpen && (
        <Paper
          sx={{
            position: 'absolute',
            right: 24,
            bottom: 24,
            width: 360,
            p: 3,
            zIndex: 1500,
            borderRadius: 3,
            backdropFilter: 'blur(24px)',
            background: alpha(theme.palette.background.paper, 0.88),
            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            boxShadow:
              '0 0 0 1px rgba(34,211,238,.2), 0 50px 140px rgba(0,0,0,.9)',
            animation: 'datamoshIn .45s steps(2,end)',
            '@keyframes datamoshIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(40px) scale(.92)',
                filter: 'blur(10px) contrast(1.4)',
                clipPath: 'inset(20% 0 60% 0)',
              },
              '40%': {
                opacity: .6,
                clipPath: 'inset(60% 0 20% 0)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                filter: 'none',
                clipPath: 'inset(0)',
              },
            },
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={900}>{selectedNode.name}</Typography>
              <IconButton
                size="small"
                onClick={() => setPanelOpen(false)}
                sx={{
                  transition: '.2s',
                  '&:hover': { transform: 'rotate(90deg) scale(1.1)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {selectedNode.country}
            </Typography>

            <Chip
              size="small"
              label={selectedNode.active ? 'Active' : 'Provisioning'}
              color={selectedNode.active ? 'primary' : 'default'}
              sx={{ width: 'fit-content' }}
            />

            {selectedNode.active ? (
              <>
                <Typography variant="body2">{selectedNode.fact}</Typography>
                <Divider />
                <Stack spacing={0.5}>
                  <Typography variant="body2">Users online: {selectedNode.stats.usersOnline}</Typography>
                  <Typography variant="body2">CPU load: {selectedNode.stats.cpuLoad}</Typography>
                  <Typography variant="body2">RAM usage: {selectedNode.stats.ramUsage}</Typography>
                  <Typography variant="body2">Tier: {selectedNode.stats.tier}</Typography>
                </Stack>
                <Button variant="contained" sx={{ mt: 1 }}>
                  Join node
                </Button>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                This region is coming online soon.
              </Typography>
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  )
}
