import { Box, Paper, Typography, Stack } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import TerminalIcon from '@mui/icons-material/Terminal';

export default function ExecutionLogs({ logs = [] }) {
  const theme = useTheme();

  return (
    <Paper sx={{ 
      p: 2.5, 
      borderRadius: 3, 
      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
      background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 250
    }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <TerminalIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Interactive Execution Logs</Typography>
      </Stack>
      
      <Box sx={{ 
        flex: 1, 
        bgcolor: '#0a0a0a', 
        borderRadius: 2, 
        p: 2, 
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        border: '1px solid #333'
      }}>
        {logs.length === 0 ? (
          <Typography sx={{ color: '#666', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            &gt; Waiting for execution events...
          </Typography>
        ) : (
          <Stack spacing={1}>
            {logs.map((log) => (
              <Box key={log.id} sx={{ color: log.type === 'error' ? '#ef4444' : log.type === 'warn' ? '#eab308' : '#22c55e' }}>
                <span style={{ color: '#888' }}>[{new Date(log.ts).toLocaleTimeString()}]</span> {log.text}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
