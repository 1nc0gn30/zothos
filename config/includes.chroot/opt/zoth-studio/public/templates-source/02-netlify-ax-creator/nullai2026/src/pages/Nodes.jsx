import { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  IconButton,
  Chip,
  Avatar,
  AvatarGroup,
  TextField,
  Alert,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import CloseIcon from '@mui/icons-material/Close'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import HubIcon from '@mui/icons-material/Hub'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import { toast } from 'sonner'

delete L.Icon.Default.prototype._getIconUrl

const createNodeIcon = (theme, isLocked) =>
  L.divIcon({
    className: '',
    html: `
      <div class="node-wrap ${theme.palette.mode}">
        <div class="node-core ${isLocked ? 'locked' : ''}"></div>
      </div>
      <style>
        .node-wrap { position: relative; width: 14px; height: 14px; }
        .node-core {
          position:absolute; inset:0; border-radius:50%;
          background:${isLocked ? '#00f0ff' : theme.palette.primary.main};
          box-shadow: 0 0 ${isLocked ? '15px #00f0ff' : '10px ' + theme.palette.primary.main};
          animation: pulse 2s infinite ease-in-out;
        }
        .node-core.locked {
          border: 2px solid #fff;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0.2; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

const DEFAULT_NODES = [
  { id: 1, name: 'Virginia Beach', pos: [36.8529, -75.978], sector: 'US-EAST-01', peers: ['GhostByte', 'Neo', 'Cypher', 'Aura'] },
  { id: 2, name: 'London', pos: [51.5072, -0.1276], sector: 'UK-LON-01', peers: ['Vortex', 'Apex'] },
  { id: 3, name: 'Tokyo', pos: [35.6895, 139.6917], sector: 'JP-TOK-01', peers: ['Shinobi', 'Kira', 'Zero'] },
  { id: 4, name: 'Frankfurt', pos: [50.1109, 8.6821], sector: 'DE-FRA-01', peers: ['Klaus', 'Nexus'] },
  { id: 5, name: 'Singapore', pos: [1.3521, 103.8198], sector: 'SG-CORE-01', peers: ['Merlion', 'Byte'] },
  { id: 6, name: 'Sydney', pos: [-33.8688, 151.2093], sector: 'AU-SYD-01', peers: ['Operative-AU'] },
  { id: 7, name: 'São Paulo', pos: [-23.5505, -46.6333], sector: 'BR-SAO-01', peers: ['RioNet'] },
  { id: 8, name: 'Dubai', pos: [25.2048, 55.2708], sector: 'AE-DXB-01', peers: ['Sultan-AI'] },
  { id: 9, name: 'Paris', pos: [48.8566, 2.3522], sector: 'FR-PAR-01', peers: ['Lumiere', 'Volt'] },
  { id: 10, name: 'New York', pos: [40.7128, -74.0060], sector: 'US-NYC-01', peers: ['ManhattanCore', 'Gotham'] },
  { id: 11, name: 'Los Angeles', pos: [34.0522, -118.2437], sector: 'US-LAX-01', peers: ['HollywoodAI'] },
  { id: 12, name: 'Mumbai', pos: [19.0760, 72.8777], sector: 'IN-BOM-01', peers: ['ChaiAgent'] },
  { id: 13, name: 'Berlin', pos: [52.5200, 13.4050], sector: 'DE-BER-01', peers: ['TechnoNode'] },
  { id: 14, name: 'Toronto', pos: [43.6532, -79.3832], sector: 'CA-TOR-01', peers: ['MapleByte'] },
  { id: 15, name: 'Seoul', pos: [37.5665, 126.9780], sector: 'KR-SEL-01', peers: ['GangnamAI'] },
]

export default function Nodes() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [selectedNode, setSelectedNode] = useState(null)
  const [lockedNode, setLockedNode] = useState(() => {
    return JSON.parse(localStorage.getItem('nullai_locked_node')) || DEFAULT_NODES[0]
  })
  const [operatorHandle, setOperatorHandle] = useState(() => {
    return localStorage.getItem('nullai_operator_handle') || 'Operator-757'
  })
  const [isConnecting, setIsConnecting] = useState(false)

  const handleLockIn = (node) => {
    setLockedNode(node)
    localStorage.setItem('nullai_locked_node', JSON.stringify(node))
    toast.success(`Locked into Node: ${node.name} (${node.sector})`, {
      description: 'Your Neural Bridge identity is now broadcasting in this sector.'
    })
  }

  const handleConnectPeer = (peerName) => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      toast.success(`Connected to Peer: ${peerName}`, {
        description: `Neural handshake established on sector ${selectedNode.sector}`
      })
    }, 1000)
  }

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative', bgcolor: '#000' }}>
      
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={3}
        maxZoom={18}
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <TileLayer
          url={isDark 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
          noWrap={true}
          bounds={[[-85, -180], [85, 180]]}
        />

        {DEFAULT_NODES.map((node) => {
          const isLocked = lockedNode?.id === node.id
          return (
            <Marker
              key={node.id}
              position={node.pos}
              icon={createNodeIcon(theme, isLocked)}
              eventHandlers={{ click: () => setSelectedNode(node) }}
            />
          )
        })}
      </MapContainer>

      {/* NODE UPLINK PANEL */}
      {selectedNode && (
        <Paper
          sx={{
            position: 'absolute',
            top: { xs: 'auto', md: 100 },
            bottom: { xs: 20, md: 'auto' },
            right: { xs: 20, md: 40 },
            width: { xs: 'calc(100% - 40px)', md: 420 },
            p: 3.5,
            zIndex: 1000,
            borderRadius: 2,
            bgcolor: 'rgba(10, 10, 18, 0.92)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${lockedNode?.id === selectedNode.id ? '#00f0ff' : theme.palette.primary.main}`,
            boxShadow: `0 0 25px ${alpha(lockedNode?.id === selectedNode.id ? '#00f0ff' : theme.palette.primary.main, 0.4)}`
          }}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={`// SECTOR_${selectedNode.sector}`}
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: 'rgba(0, 240, 255, 0.12)',
                    color: '#00f0ff',
                    border: '1px solid rgba(0, 240, 255, 0.3)'
                  }}
                />
                {lockedNode?.id === selectedNode.id && (
                  <Chip
                    size="small"
                    icon={<LockIcon style={{ color: '#00f0ff', fontSize: 12 }} />}
                    label="CURRENTLY LOCKED"
                    sx={{ fontSize: '0.65rem', bgcolor: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}
                  />
                )}
              </Stack>
              <IconButton size="small" onClick={() => setSelectedNode(null)} sx={{ color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Box>
              <Typography variant="h5" fontWeight={900} sx={{ color: 'text.primary' }}>{selectedNode.name}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5, opacity: 0.7 }}>
                <GpsFixedIcon fontSize="inherit" style={{ color: '#00f0ff' }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  LAT: {selectedNode.pos[0]} // LON: {selectedNode.pos[1]}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: 'rgba(0, 240, 255, 0.2)' }} />

            {/* PEER MESH SECTION */}
            <Box>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block', mb: 1 }}>
                ACTIVE OPERATORS IN THIS SECTOR ({selectedNode.peers.length}):
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                {selectedNode.peers.map((peer, i) => (
                  <Chip
                    key={i}
                    avatar={<Avatar sx={{ bgcolor: '#00f0ff', color: '#000', fontWeight: 700 }}>{peer[0]}</Avatar>}
                    label={peer}
                    onClick={() => handleConnectPeer(peer)}
                    clickable
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: 'text.primary',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': { bgcolor: 'rgba(0, 240, 255, 0.15)', borderColor: '#00f0ff' }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
              Locking into {selectedNode.name} routes your neural commands through this regional Netlify Blob mesh node.
            </Typography>

            <Stack spacing={1.5}>
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<LockIcon />}
                onClick={() => handleLockIn(selectedNode)}
                disabled={lockedNode?.id === selectedNode.id}
                sx={{
                  bgcolor: '#00f0ff',
                  color: '#000',
                  fontWeight: 900,
                  '&:hover': { bgcolor: '#00d0df' }
                }}
              >
                {lockedNode?.id === selectedNode.id ? 'LOCKED INTO THIS NODE' : 'LOCK INTO THIS NODE'}
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<HubIcon />}
                onClick={() => toast.info(`Filtering feed stream for ${selectedNode.name}...`)}
                sx={{ borderColor: 'rgba(0, 240, 255, 0.4)', color: '#00f0ff', fontWeight: 900 }}
              >
                FILTER SECTOR FEED
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* TOP HUD INFO */}
      <Box sx={{ position: 'absolute', top: 90, left: 30, zIndex: 1000, pointerEvents: 'auto' }}>
        <Paper
          sx={{
            p: 2,
            bgcolor: 'rgba(10, 10, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: 2
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.8 }}>
            <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 28, height: 28 }} />
            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 3, color: '#00f0ff', textShadow: '0 0 10px cyan' }}>
              NULL_AI // NODE_MAP
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.8, display: 'block' }}>
            CREATOR OF ZOTH // {DEFAULT_NODES.length} MESH UPLINKS // LOCKED: <span style={{ color: '#00f0ff', fontWeight: 700 }}>{lockedNode.name}</span>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}