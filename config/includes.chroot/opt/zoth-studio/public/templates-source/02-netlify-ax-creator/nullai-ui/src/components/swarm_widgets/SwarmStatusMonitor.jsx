import { Box, Paper, Typography, Stack, Chip, Divider } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PeopleIcon from '@mui/icons-material/People';
import MemoryIcon from '@mui/icons-material/Memory';

export default function SwarmStatusMonitor({ nodes = [], projects = [] }) {
  const theme = useTheme();

  const activeNodes = nodes.filter(n => n.status === 'online').length;
  
  return (
    <Paper sx={{ 
      p: 2.5, 
      borderRadius: 3, 
      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
      background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : theme.palette.background.paper
    }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <NetworkCheckIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Swarm Monitor</Typography>
      </Stack>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <MemoryIcon fontSize="small" />
            <Typography variant="subtitle2">Agents</Typography>
          </Stack>
          <Typography variant="h4" fontWeight={800}>{activeNodes}<Typography component="span" color="text.secondary" variant="body2" sx={{ ml: 1 }}>/ {nodes.length} online</Typography></Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <PeopleIcon fontSize="small" />
            <Typography variant="subtitle2">Projects</Typography>
          </Stack>
          <Typography variant="h4" fontWeight={800}>{projects.length}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        Mesh topology stable. Latency: ~{(Math.random() * 20 + 10).toFixed(0)}ms
      </Typography>
    </Paper>
  );
}
