import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Box, CircularProgress, IconButton, Stack } from '@mui/material';
import { Play, Square, ExternalLink, Terminal } from 'lucide-react';

const GhostControl = ({ site, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const repoName = site.repo_name || site.repo?.split('/').pop()?.replace('.git', '') || site.repo_path?.split('/').pop();

  useEffect(() => {
    let interval;
    if (site.is_running && showLogs) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/ghost/logs/${repoName}`);
          setLogs(res.data.logs);
        } catch (e) {
          console.error('Log fetch failed');
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [site.is_running, showLogs, repoName]);

  const handleToggle = async () => {
    if (!repoName) return;
    setLoading(true);
    try {
      if (site.is_running) {
        await axios.post(`http://localhost:8000/api/ghost/stop/${repoName}`);
      } else {
        await axios.post(`http://localhost:8000/api/ghost/start/${repoName}`);
      }
      onRefresh();
    } catch (e) {
      alert('Container Action Failed');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 1, pt: 1.5, borderTop: '1px solid rgba(122, 155, 196, 0.2)' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color={site.is_running ? 'error' : 'secondary'}
          size="small"
          onClick={handleToggle}
          disabled={loading || !repoName}
          startIcon={
            loading ? <CircularProgress size={14} color="inherit" /> : site.is_running ? <Square size={14} /> : <Play size={14} />
          }
        >
          {site.is_running ? 'Kill Pod' : 'Spawn Pod'}
        </Button>
        {site.is_running && (
          <IconButton
            size="small"
            sx={{ color: '#59f0b5', border: '1px solid rgba(89,240,181,0.4)' }}
            onClick={() => setShowLogs(!showLogs)}
          >
            <Terminal size={16} />
          </IconButton>
        )}
      </Stack>

      {site.is_running && (
        <Button
          fullWidth
          size="small"
          variant="text"
          color="success"
          startIcon={<ExternalLink size={14} />}
          href={`http://localhost:${site.port}`}
          target="_blank"
          sx={{ mb: 1, fontSize: '0.75rem' }}
        >
          Open Live App (Port {site.port})
        </Button>
      )}

      {showLogs && site.is_running && (
        <Box
          sx={{
            bgcolor: 'rgba(6, 10, 16, 0.8)',
            p: 1,
            maxHeight: 140,
            overflow: 'auto',
            border: '1px solid rgba(122, 155, 196, 0.2)',
            borderRadius: 1
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', whiteSpace: 'pre-wrap', color: '#a3b3c6' }}
          >
            {logs || 'Initializing container logs...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GhostControl;
