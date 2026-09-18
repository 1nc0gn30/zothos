import { Box, Paper, Typography, Stack, LinearProgress, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';

export default function AgentTelemetryWidget({ agent }) {
  const theme = useTheme();
  
  if (!agent) {
    return (
      <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
        <Typography color="text.secondary">No agent selected for telemetry.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 2.5, 
      borderRadius: 3, 
      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
      background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : theme.palette.background.paper
    }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <SpeedIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Telemetry: {agent.display_name}</Typography>
        <Chip size="small" color={agent.status === 'online' ? 'success' : 'default'} label={agent.status} sx={{ ml: 'auto' }} />
      </Stack>
      
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="text.secondary">CPU Usage</Typography>
            <Typography variant="body2" fontWeight={600}>{(Math.random() * 40 + 10).toFixed(1)}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={Math.random() * 40 + 10} sx={{ height: 6, borderRadius: 3 }} />
        </Box>
        <Box>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="text.secondary">Memory Usage</Typography>
            <Typography variant="body2" fontWeight={600}>{(Math.random() * 60 + 20).toFixed(1)}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={Math.random() * 60 + 20} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <MemoryIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Capabilities: {(agent.capabilities || []).join(', ')}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
