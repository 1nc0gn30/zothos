import { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
  Avatar
} from '@mui/material';
import GhostControl from './GhostControl';

const API_BASE = 'http://localhost:8000';

export default function SiteCard({ site, onRefresh, onOpenWorkspace }) {
  const [cloning, setCloning] = useState(false);
  const hasLocalRepo = Boolean(site.is_cloned && site.repo_path);

  const handleClone = async () => {
    if (!site.repo || !site.has_github_repo) return;
    setCloning(true);
    try {
      await axios.post(`${API_BASE}/api/clone`, null, { params: { repo_url: site.repo } });
      await onRefresh();
    } catch (e) {
      alert('Clone failed');
    } finally {
      setCloning(false);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(112, 235, 255, 0.28)',
        background:
          'linear-gradient(165deg, rgba(16, 30, 52, 0.92) 0%, rgba(10, 16, 29, 0.98) 58%, rgba(7, 13, 24, 1) 100%)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(166, 245, 255, 0.18)'
      }}
    >
      <CardContent sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1.1, height: '100%' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar
            src={site.favicon_url || ''}
            alt={`${site.name} favicon`}
            sx={{ width: 28, height: 28, bgcolor: 'rgba(111, 247, 255, 0.15)', border: '1px solid rgba(111, 247, 255, 0.35)' }}
          >
            {site.name?.slice(0, 1) || '?'}
          </Avatar>
          <Typography variant="h6">{site.name}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {site.id}
        </Typography>
        {(site.live_meta?.title || site.live_meta?.description) && (
          <Box sx={{ mb: 1.2 }}>
            {site.live_meta?.title && (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {site.live_meta.title}
              </Typography>
            )}
            {site.live_meta?.description && (
              <Typography variant="caption" color="text.secondary">
                {site.live_meta.description}
              </Typography>
            )}
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip label={site.has_github_repo ? 'GitHub Linked' : 'No GitHub Repo Available'} size="small" />
          <Chip
            label={
              site.clone_status === 'cloned'
                ? 'Repo Cloned'
                : site.clone_status === 'no_github_repo_available'
                  ? 'No Clone Source'
                  : 'Repo Not Cloned'
            }
            size="small"
          />
          <Chip label={site.is_running ? `Running on ${site.port || 'unknown port'}` : 'Not Running'} size="small" />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={() => onOpenWorkspace(site.id)}>
            Open Site Page
          </Button>
          {site.url && (
            <Button size="small" variant="outlined" href={site.ssl_url || site.url} target="_blank">
              Visit
            </Button>
          )}
          {site.has_github_repo && site.repo && (
            <Button size="small" variant="outlined" href={site.repo} target="_blank">
              GitHub
            </Button>
          )}
        </Stack>

        {site.can_clone && (
          <Box sx={{ mt: 1 }}>
            <Button size="small" variant="contained" onClick={handleClone} disabled={cloning}>
              {cloning ? 'Cloning...' : 'Clone Repo'}
            </Button>
          </Box>
        )}

        <Card variant="outlined" sx={{ p: 1.1, bgcolor: 'rgba(110, 194, 255, 0.04)' }}>
          <Typography variant="caption" color="text.secondary">
            Live Snapshot
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            <strong>Domain:</strong> {site.live_meta?.domain || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {site.live_meta?.status_code || 'unknown'}
          </Typography>
          <Typography variant="body2">
            <strong>Contacts:</strong> {site.contacts?.length || 0}
          </Typography>
        </Card>

        {hasLocalRepo && <GhostControl site={site} onRefresh={onRefresh} />}

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Primary URL
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {site.ssl_url || site.url || site.deploy_url || 'N/A'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
