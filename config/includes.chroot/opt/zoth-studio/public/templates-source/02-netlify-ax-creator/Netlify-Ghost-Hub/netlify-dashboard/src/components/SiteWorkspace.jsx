import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import EmailStudio from './EmailStudio';

export default function SiteWorkspace({ site, apiBase, onBack, onRefresh }) {
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetsError, setAssetsError] = useState('');
  const [siteMeta, setSiteMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState('');
  const [codexBusy, setCodexBusy] = useState(false);
  const [codexError, setCodexError] = useState('');
  const [codexMessage, setCodexMessage] = useState('');
  const [codexOpen, setCodexOpen] = useState(false);
  const [codexProfiles, setCodexProfiles] = useState(['frontend']);

  const profileOptions = [
    { id: 'frontend', label: 'Frontend Dev' },
    { id: 'backend', label: 'Backend Dev' },
    { id: 'seo_marketing', label: 'SEO Marketing Genius' },
    { id: 'architect', label: 'Architect' }
  ];

  const canOpenCodex = useMemo(() => {
    return Boolean(site.is_cloned && site.repo_path);
  }, [site]);

  useEffect(() => {
    let active = true;
    const loadAssets = async () => {
      if (!site?.id || !site?.is_cloned) {
        setAssets([]);
        setAssetsError('');
        return;
      }
      setAssetsLoading(true);
      setAssetsError('');
      try {
        const res = await axios.get(`${apiBase}/api/sites/${site.id}/assets`);
        if (!active) return;
        setAssets(res.data?.media_assets || []);
      } catch (e) {
        if (!active) return;
        setAssets([]);
        setAssetsError(e?.response?.data?.detail || 'Failed to load media assets for this site.');
      } finally {
        if (active) setAssetsLoading(false);
      }
    };

    loadAssets();
    return () => {
      active = false;
    };
  }, [apiBase, site?.id, site?.is_cloned]);

  const loadLiveMetadata = async (forceRefresh = false) => {
    if (!site?.id) {
      setSiteMeta(null);
      return;
    }
    setMetaLoading(true);
    setMetaError('');
    try {
      const res = await axios.get(`${apiBase}/api/sites/${site.id}/metadata`, {
        params: { force_refresh: forceRefresh }
      });
      setSiteMeta(res.data || null);
    } catch (e) {
      setSiteMeta(null);
      setMetaError(e?.response?.data?.detail || 'Failed to fetch live site metadata.');
    } finally {
      setMetaLoading(false);
    }
  };

  useEffect(() => {
    loadLiveMetadata(false);
  }, [apiBase, site?.id]);

  const handleOpenCodex = async () => {
    if (!canOpenCodex || codexBusy) return;
    setCodexBusy(true);
    setCodexError('');
    setCodexMessage('');
    try {
      const profilesToLaunch = codexProfiles.slice(0, 4);
      const res = await axios.post(`${apiBase}/api/codex/open`, {
        repo_path: site.repo_path,
        profiles: profilesToLaunch
      });
      setCodexMessage(res?.data?.message || 'Codex launched.');
      setCodexOpen(false);
    } catch (e) {
      setCodexError(e?.response?.data?.detail || 'Failed to launch codex terminal.');
    } finally {
      setCodexBusy(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Back To Sites
        </Button>
        <Button variant="contained" onClick={() => setCodexOpen(true)} disabled={!canOpenCodex || codexBusy}>
          {codexBusy ? 'Launching Codex...' : 'Codex Tool GUI'}
        </Button>
        <Button variant="outlined" onClick={onRefresh}>
          Refresh Site Status
        </Button>
        <Button variant="outlined" onClick={() => loadLiveMetadata(true)} disabled={metaLoading}>
          {metaLoading ? 'Refreshing Metadata...' : 'Refresh Live Metadata'}
        </Button>
      </Stack>
      {codexError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {codexError}
        </Alert>
      )}
      {codexMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {codexMessage}
        </Alert>
      )}
      {!canOpenCodex && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Codex Tool GUI is enabled when this site has a local git repo path available.
        </Alert>
      )}

      <Dialog open={codexOpen} onClose={() => setCodexOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Codex Tool GUI</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Launch up to 4 Codex instances in this repo root, each with a role focus.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.25 }}>
            <strong>Root:</strong> {site.repo_path || 'N/A'}
          </Typography>
          <Stack spacing={0.3}>
            {profileOptions.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={codexProfiles.includes(option.id)}
                    onChange={(event) => {
                      setCodexProfiles((prev) => {
                        if (event.target.checked) {
                          if (prev.includes(option.id) || prev.length >= 4) return prev;
                          return [...prev, option.id];
                        }
                        return prev.filter((item) => item !== option.id);
                      });
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Selected: {codexProfiles.length}/4
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodexOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleOpenCodex} disabled={!canOpenCodex || codexBusy || codexProfiles.length === 0}>
            Launch Selected
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1 }}>
            <Avatar
              src={siteMeta?.favicon_url || site.favicon_url || ''}
              alt={`${site.name} favicon`}
              sx={{ width: 32, height: 32, bgcolor: 'rgba(111, 247, 255, 0.15)', border: '1px solid rgba(111, 247, 255, 0.35)' }}
            >
              {site.name?.slice(0, 1) || '?'}
            </Avatar>
            <Typography variant="h5">{site.name}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Site ID: {site.id}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Chip label={site.has_github_repo ? 'GitHub Linked' : 'No GitHub Repo Available'} />
            <Chip
              label={
                site.clone_status === 'cloned'
                  ? 'Repo Cloned'
                  : site.clone_status === 'no_github_repo_available'
                    ? 'No Clone Source'
                    : 'Repo Not Cloned'
              }
            />
            <Chip label={site.is_running ? `Running on port ${site.port || 'unknown'}` : 'Container Not Running'} />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Site URL:</strong> {site.ssl_url || site.url || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Deploy URL:</strong> {site.deploy_url || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Admin URL:</strong> {site.admin_url || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>GitHub Repo:</strong> {site.repo || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Local Root Folder:</strong> {site.repo_path || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Favicon:</strong> {siteMeta?.favicon_url || site.favicon_url || 'N/A'}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Live Site Metadata
          </Typography>
          {metaLoading && <Typography variant="body2">Loading metadata...</Typography>}
          {!metaLoading && metaError && <Alert severity="warning">{metaError}</Alert>}
          {!metaLoading && !metaError && siteMeta && (
            <Stack spacing={0.75}>
              <Typography variant="body2">
                <strong>Domain:</strong> {siteMeta.domain || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>HTTP Status:</strong> {siteMeta.status_code || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Title:</strong> {siteMeta.title || siteMeta.og_title || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {siteMeta.description || siteMeta.og_description || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Canonical URL:</strong> {siteMeta.canonical_url || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Theme Color:</strong> {siteMeta.theme_color || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Open Graph Image:</strong> {siteMeta.og_image || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Favicon URL:</strong> {siteMeta.favicon_url || 'N/A'}
              </Typography>
              {siteMeta.og_image && (
                <Box
                  component="img"
                  src={siteMeta.og_image}
                  alt={`${site.name} og`}
                  sx={{ width: '100%', maxWidth: 480, maxHeight: 220, objectFit: 'cover', borderRadius: 1, mt: 0.75 }}
                />
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Email Studio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure SMTP, manage this site's recipient list, and send custom designed emails directly from dashboard.
          </Typography>
          <EmailStudio apiBase={apiBase} site={site} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Site Media Assets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Previewing images, video, and audio files discovered in the local clone.
          </Typography>
          {assetsLoading && <Typography variant="body2">Loading assets...</Typography>}
          {!assetsLoading && assetsError && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {assetsError}
            </Alert>
          )}
          {!assetsLoading && !assetsError && assets.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No media assets found in this repo.
            </Typography>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 1.25 }}>
            {assets.map((asset) => (
              <Card key={`${asset.rel_path}-${asset.ext}`} variant="outlined" sx={{ p: 1.25 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, wordBreak: 'break-all' }}>
                  {asset.rel_path}
                </Typography>
                {asset.type === 'image' ? (
                  <Box
                    component="img"
                    src={`${apiBase}${asset.url}`}
                    alt={asset.name}
                    sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 1, bgcolor: 'rgba(255,255,255,0.03)' }}
                  />
                ) : asset.type === 'video' ? (
                  <Box component="video" controls src={`${apiBase}${asset.url}`} sx={{ width: '100%', borderRadius: 1, maxHeight: 180 }} />
                ) : (
                  <Box component="audio" controls src={`${apiBase}${asset.url}`} sx={{ width: '100%' }} />
                )}
                <Button size="small" variant="text" href={`${apiBase}${asset.url}`} target="_blank" sx={{ mt: 0.5 }}>
                  Open File
                </Button>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
