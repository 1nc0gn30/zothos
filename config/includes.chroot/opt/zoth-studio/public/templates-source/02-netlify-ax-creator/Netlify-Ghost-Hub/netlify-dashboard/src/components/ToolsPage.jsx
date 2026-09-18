import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Typography,
  Stack,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import TransformIcon from '@mui/icons-material/Transform';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import TerminalIcon from '@mui/icons-material/Terminal';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        p: 2,
        overflowY: 'auto'
      }}
    >
      {children}
    </Box>
  );
}

export default function ToolsPage({ apiBase, onRepoCreated }) {
  const [tabValue, setTabValue] = useState(0);
  const [toolsStatus, setToolsStatus] = useState(null);
  const [loading, setLoading] = useState({ yt: false, ff: false, repo: false });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [ytSection, setYtSection] = useState('run');
  const [ffSection, setFfSection] = useState('basic');
  const [ffAdvancedPage, setFfAdvancedPage] = useState(0);
  const [repoSection, setRepoSection] = useState('form');

  const [ytForm, setYtForm] = useState({ url: '' });
  const [ytResult, setYtResult] = useState('');
  const [videoPreview, setVideoPreview] = useState(null);

  const [ffForm, setFfForm] = useState({
    input_path: '',
    output_name: '',
    output_format: 'mp4',
    video_codec: 'libx264',
    audio_codec: 'aac',
    audio_bitrate: '192k',
    preset: 'medium',
    crf: '23',
    start_time: '',
    duration: '',
    scale: '',
    fps: '',
    overwrite: true
  });
  const [ffResult, setFfResult] = useState('');

  const [repoForm, setRepoForm] = useState({
    site_name: '',
    template: 'vite-vanilla-js',
    site_title: '',
    author: '',
    description: '',
  });
  const [repoResult, setRepoResult] = useState('');
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [ffInbox, setFfInbox] = useState({ input_dir: '', output_dir: '', files: [] });
  const ffUploadInputRef = useRef(null);
  const [nativeForm, setNativeForm] = useState({
    whoisTarget: '',
    dnsDomain: '',
    pingTarget: '',
    pingCount: '4',
    pingInterval: '0.3',
    pingTimeout: '3',
    pingExtraArgs: '',
    traceTarget: '',
    traceMaxHops: '20',
    traceWait: '3',
    traceQueries: '1',
    traceUseIcmp: false,
    traceExtraArgs: '',
    ipScope: 'addr',
    ipInterface: '',
    ipExtraArgs: '',
    ssMode: 'listening',
    ssProtocol: 'all',
    ssExtended: false,
    ssExtraArgs: ''
  });
  const [nativeResult, setNativeResult] = useState({
    whois: '',
    dns: '',
    ping: '',
    traceroute: '',
    ip: '',
    ss: ''
  });
  const [nativeLoading, setNativeLoading] = useState({
    whois: false,
    dns: false,
    ping: false,
    traceroute: false,
    ip: false,
    ss: false
  });

  const loadStatus = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/tools/status`);
      setToolsStatus(res.data);
    } catch (e) {
      setToolsStatus(null);
    }
  };

  useEffect(() => {
    loadStatus();
    loadMediaLibrary();
    loadFfInbox();
  }, [apiBase]);

  const loadMediaLibrary = async () => {
    setMediaLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/tools/downloads/media`);
      setMediaLibrary(res.data?.media || []);
    } catch (e) {
      setMediaLibrary([]);
    } finally {
      setMediaLoading(false);
    }
  };

  const loadFfInbox = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/tools/ffmpeg/inbox`);
      setFfInbox({
        input_dir: res.data?.input_dir || '',
        output_dir: res.data?.output_dir || '',
        files: res.data?.files || []
      });
    } catch (e) {
      setFfInbox({ input_dir: '', output_dir: '', files: [] });
    }
  };

  const showNotify = (message) => setSnackbar({ open: true, message });

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showNotify('Copied to clipboard');
  };

  const handleRun = async (tool, callback) => {
    setLoading((prev) => ({ ...prev, [tool]: true }));
    await callback();
    setLoading((prev) => ({ ...prev, [tool]: false }));
  };

  const runYt = () =>
    handleRun('yt', async () => {
      setVideoPreview(null);
      setYtResult('Running terminal command...');
      try {
        const res = await axios.post(`${apiBase}/api/tools/yt-dlp`, ytForm);
        setVideoPreview({
          title: res.data.title,
          folder: res.data.folder,
          videoUrl: `${apiBase}${res.data.video_url}`,
          thumbUrl: `${apiBase}${res.data.thumb_url}`
        });
        setYtResult(`Success\nFolder: ${res.data.folder}`);
        setYtSection('preview');
        loadMediaLibrary();
      } catch (e) {
        setYtResult(`Error: ${e.response?.data?.detail || e.message}`);
        setYtSection('output');
      }
    });

  const runFfmpeg = () =>
    handleRun('ff', async () => {
      setFfResult('Running ffmpeg...');
      try {
        const res = await axios.post(`${apiBase}/api/tools/ffmpeg/convert`, ffForm);
        setFfResult(`Success\nInput file: ${res.data.input_file}\nOutput file: ${res.data.output_file}`);
      } catch (e) {
        setFfResult(`Error: ${e.response?.data?.detail || e.message}`);
      }
      setFfSection('output');
      loadMediaLibrary();
      loadFfInbox();
    });

  const uploadFfInput = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setFfResult('Uploading file...');
    try {
      const res = await axios.post(`${apiBase}/api/tools/uploads`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFfForm((prev) => ({ ...prev, input_path: res.data.input_path }));
      setFfResult(`File imported to ffmpeg inbox\nInput file path: ${res.data.input_path}`);
      loadMediaLibrary();
      loadFfInbox();
    } catch (e) {
      setFfResult(`Upload Error: ${e.response?.data?.detail || e.message}`);
    } finally {
      event.target.value = '';
    }
  };

  const createSite = () =>
    handleRun('repo', async () => {
      setRepoResult('Creating site scaffold...');
      try {
        const res = await axios.post(`${apiBase}/api/tools/site/create`, repoForm);
        setRepoResult(
          `Success\nSite ID: ${res.data.site_id}\nSite path: ${res.data.site_path}\nTemplate: ${res.data.template}\nRoot folder: ${res.data.root_folder}\nGit: ${res.data.git}`
        );
        onRepoCreated?.();
      } catch (e) {
        setRepoResult(`Error: ${e.response?.data?.detail || e.message}`);
      }
      setRepoSection('output');
    });

  const runWhois = async () => {
    setNativeLoading((prev) => ({ ...prev, whois: true }));
    try {
      const res = await axios.post(`${apiBase}/api/tools/native/whois`, { target: nativeForm.whoisTarget });
      setNativeResult((prev) => ({ ...prev, whois: res.data?.output || '' }));
    } catch (e) {
      setNativeResult((prev) => ({ ...prev, whois: `Error: ${e.response?.data?.detail || e.message}` }));
    } finally {
      setNativeLoading((prev) => ({ ...prev, whois: false }));
    }
  };

  const runDns = async () => {
    setNativeLoading((prev) => ({ ...prev, dns: true }));
    try {
      const res = await axios.post(`${apiBase}/api/tools/native/dns`, { domain: nativeForm.dnsDomain });
      if (res.data?.resolver === 'dig') {
        const records = res.data?.records || {};
        const output = Object.keys(records)
          .map((key) => `${key}\n${(records[key] || []).join('\n') || '(none)'}`)
          .join('\n\n');
        setNativeResult((prev) => ({ ...prev, dns: output }));
      } else {
        setNativeResult((prev) => ({ ...prev, dns: res.data?.raw_output || '' }));
      }
    } catch (e) {
      setNativeResult((prev) => ({ ...prev, dns: `Error: ${e.response?.data?.detail || e.message}` }));
    } finally {
      setNativeLoading((prev) => ({ ...prev, dns: false }));
    }
  };

  const runPing = async () => {
    setNativeLoading((prev) => ({ ...prev, ping: true }));
    try {
      const res = await axios.post(`${apiBase}/api/tools/native/ping`, {
        target: nativeForm.pingTarget,
        count: nativeForm.pingCount,
        interval_sec: nativeForm.pingInterval,
        timeout_sec: nativeForm.pingTimeout,
        extra_args: nativeForm.pingExtraArgs
      });
      setNativeResult((prev) => ({ ...prev, ping: res.data?.output || '' }));
    } catch (e) {
      setNativeResult((prev) => ({ ...prev, ping: `Error: ${e.response?.data?.detail || e.message}` }));
    } finally {
      setNativeLoading((prev) => ({ ...prev, ping: false }));
    }
  };

  const runTraceroute = async () => {
    setNativeLoading((prev) => ({ ...prev, traceroute: true }));
    try {
      const res = await axios.post(`${apiBase}/api/tools/native/traceroute`, {
        target: nativeForm.traceTarget,
        max_hops: nativeForm.traceMaxHops,
        wait_sec: nativeForm.traceWait,
        queries: nativeForm.traceQueries,
        use_icmp: nativeForm.traceUseIcmp,
        extra_args: nativeForm.traceExtraArgs
      });
      setNativeResult((prev) => ({ ...prev, traceroute: res.data?.output || '' }));
    } catch (e) {
      setNativeResult((prev) => ({ ...prev, traceroute: `Error: ${e.response?.data?.detail || e.message}` }));
    } finally {
      setNativeLoading((prev) => ({ ...prev, traceroute: false }));
    }
  };

  const runIp = async () => {
    setNativeLoading((prev) => ({ ...prev, ip: true }));
    try {
      const res = await axios.post(`${apiBase}/api/tools/native/ip`, {
        scope: nativeForm.ipScope,
        interface: nativeForm.ipInterface,
        extra_args: nativeForm.ipExtraArgs
      });
      setNativeResult((prev) => ({ ...prev, ip: res.data?.output || '' }));
    } catch (e) {
      setNativeResult((prev) => ({ ...prev, ip: `Error: ${e.response?.data?.detail || e.message}` }));
    } finally {
      setNativeLoading((prev) => ({ ...prev, ip: false }));
    }
  };

  const runSs = async () => {
    setNativeLoading((prev) => ({ ...prev, ss: true }));
    try {
      const res = await axios.post(`${apiBase}/api/tools/native/ss`, {
        mode: nativeForm.ssMode,
        protocol: nativeForm.ssProtocol,
        extended: nativeForm.ssExtended,
        extra_args: nativeForm.ssExtraArgs
      });
      setNativeResult((prev) => ({ ...prev, ss: res.data?.output || '' }));
    } catch (e) {
      setNativeResult((prev) => ({ ...prev, ss: `Error: ${e.response?.data?.detail || e.message}` }));
    } finally {
      setNativeLoading((prev) => ({ ...prev, ss: false }));
    }
  };

  const statusItems = toolsStatus
    ? [
        { label: `yt-dlp: ${toolsStatus.yt_dlp ? 'available' : 'missing'}`, ok: toolsStatus.yt_dlp },
        { label: `ffmpeg: ${toolsStatus.ffmpeg ? 'available' : 'missing'}`, ok: toolsStatus.ffmpeg },
        { label: `gh: ${toolsStatus.gh ? 'available' : 'missing'}`, ok: toolsStatus.gh },
        { label: `whois: ${toolsStatus.whois ? 'available' : 'missing'}`, ok: toolsStatus.whois },
        { label: `dns: ${toolsStatus.dig || toolsStatus.nslookup ? 'available' : 'missing'}`, ok: toolsStatus.dig || toolsStatus.nslookup },
        { label: `ping: ${toolsStatus.ping ? 'available' : 'missing'}`, ok: toolsStatus.ping },
        { label: `trace: ${toolsStatus.traceroute ? 'available' : 'missing'}`, ok: toolsStatus.traceroute },
        { label: `ip: ${toolsStatus.ip ? 'available' : 'missing'}`, ok: toolsStatus.ip },
        { label: `ss: ${toolsStatus.ss ? 'available' : 'missing'}`, ok: toolsStatus.ss }
      ]
    : [];

  return (
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mr: 1 }}>
          System Tools
        </Typography>
        {statusItems.map((item) => (
          <Chip key={item.label} size="small" label={item.label} color={item.ok ? 'success' : 'default'} />
        ))}
      </Stack>

      <Alert severity="info" sx={{ mb: 1.5 }}>
        Screen-fit mode enabled: switch sections with tabs and segmented controls.
      </Alert>

      <Paper
        sx={{
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(event, value) => setTabValue(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DownloadIcon />} label="yt-dlp Download" />
          <Tab icon={<TransformIcon />} label="ffmpeg Convert" />
          <Tab icon={<CreateNewFolderIcon />} label="Create Site" />
          <Tab icon={<TravelExploreIcon />} label="Native Linux" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
            <ToggleButtonGroup
              value={ytSection}
              exclusive
              onChange={(event, nextValue) => nextValue && setYtSection(nextValue)}
              size="small"
            >
              <ToggleButton value="run">Run</ToggleButton>
              <ToggleButton value="preview">Preview</ToggleButton>
              <ToggleButton value="output">Output</ToggleButton>
            </ToggleButtonGroup>

            {ytSection === 'run' && (
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                  <TextField
                    label="Media URL"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={ytForm.url}
                    onChange={(event) => setYtForm({ ...ytForm, url: event.target.value })}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TerminalIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={runYt}
                    disabled={loading.yt || !ytForm.url}
                    startIcon={loading.yt ? <CircularProgress size={18} /> : <DownloadIcon />}
                    sx={{ minWidth: { xs: '100%', md: 220 } }}
                  >
                    {loading.yt ? 'Processing...' : 'Execute Download'}
                  </Button>
                </Stack>
              </Stack>
            )}

            {ytSection === 'preview' && (
              <Card variant="outlined" sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">Media Preview + Downloads Library</Typography>
                    <Button size="small" startIcon={<RefreshIcon />} onClick={loadMediaLibrary} disabled={mediaLoading}>
                      Refresh
                    </Button>
                  </Stack>
                </Box>
                <Box sx={{ p: 2, maxHeight: 580, overflowY: 'auto' }}>
                  {videoPreview ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Latest Download
                      </Typography>
                      {videoPreview.videoUrl ? (
                        <video controls poster={videoPreview.thumbUrl} style={{ width: '100%', maxHeight: 300, backgroundColor: '#000' }}>
                          <source src={videoPreview.videoUrl} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        videoPreview.thumbUrl && (
                          <img src={videoPreview.thumbUrl} alt="Thumbnail" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
                        )
                      )}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {videoPreview.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        {videoPreview.folder}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Run download first to populate latest preview.
                    </Typography>
                  )}
                  <Divider sx={{ mb: 1.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    All media in downloads folder ({mediaLibrary.length})
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                    {mediaLibrary.map((item) => (
                      <Grid item xs={12} md={6} key={item.rel_path}>
                        <Card variant="outlined" sx={{ p: 1 }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 0.7, wordBreak: 'break-all' }}>
                            {item.rel_path}
                          </Typography>
                          {item.type === 'video' ? (
                            <video controls style={{ width: '100%', maxHeight: 170, backgroundColor: '#000' }}>
                              <source src={`${apiBase}${item.url}`} />
                            </video>
                          ) : item.type === 'audio' ? (
                            <audio controls style={{ width: '100%' }}>
                              <source src={`${apiBase}${item.url}`} />
                            </audio>
                          ) : (
                            <img
                              src={`${apiBase}${item.url}`}
                              alt={item.name}
                              style={{ width: '100%', maxHeight: 170, objectFit: 'cover', borderRadius: 8 }}
                            />
                          )}
                        </Card>
                      </Grid>
                    ))}
                    {!mediaLoading && mediaLibrary.length === 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No downloadable media found yet.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Card>
            )}

            {ytSection === 'output' && (
              <TextField
                label="Console Output"
                value={ytResult}
                multiline
                minRows={8}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy Output">
                        <IconButton onClick={() => copyToClipboard(ytResult)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
            <ToggleButtonGroup
              value={ffSection}
              exclusive
              onChange={(event, nextValue) => nextValue && setFfSection(nextValue)}
              size="small"
            >
              <ToggleButton value="basic">Basic</ToggleButton>
              <ToggleButton value="advanced">Advanced</ToggleButton>
              <ToggleButton value="output">Output</ToggleButton>
            </ToggleButtonGroup>

            {ffSection === 'basic' && (
              <Stack spacing={1.5}>
                <Alert severity="info">
                  ffmpeg now accepts input files only from the workspace inbox folder.
                  <br />
                  {ffInbox.input_dir || 'Loading inbox path...'}
                </Alert>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => ffUploadInputRef.current?.click()}
                  >
                    Import File To Inbox
                  </Button>
                  <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadFfInbox}>
                    Refresh Inbox Files
                  </Button>
                  <input
                    ref={ffUploadInputRef}
                    type="file"
                    onChange={uploadFfInput}
                    style={{ display: 'none' }}
                  />
                </Stack>
                <TextField
                  select
                  label="Input File (From Inbox)"
                  value={ffForm.input_path}
                  onChange={(event) => setFfForm({ ...ffForm, input_path: event.target.value })}
                  fullWidth
                  size="small"
                  helperText={ffInbox.files.length ? `${ffInbox.files.length} files available in inbox` : 'No files in inbox yet'}
                >
                  {ffInbox.files.map((item) => (
                    <MenuItem key={item.path} value={item.path}>
                      {item.relative_path}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Selected Input Path"
                  value={ffForm.input_path}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Output Name"
                      value={ffForm.output_name}
                      onChange={(event) => setFfForm({ ...ffForm, output_name: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Output Format"
                      value={ffForm.output_format}
                      onChange={(event) => setFfForm({ ...ffForm, output_format: event.target.value })}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="mp4">mp4</MenuItem>
                      <MenuItem value="webm">webm</MenuItem>
                      <MenuItem value="mp3">mp3</MenuItem>
                      <MenuItem value="wav">wav</MenuItem>
                      <MenuItem value="gif">gif</MenuItem>
                      <MenuItem value="jpg">jpg</MenuItem>
                      <MenuItem value="png">png</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={ffForm.overwrite}
                      onChange={(event) => setFfForm({ ...ffForm, overwrite: event.target.checked })}
                    />
                  }
                  label="Overwrite output file"
                />
                <Button
                  variant="contained"
                  onClick={runFfmpeg}
                  disabled={loading.ff || !ffForm.input_path}
                  startIcon={loading.ff ? <CircularProgress size={18} /> : <TransformIcon />}
                >
                  {loading.ff ? 'Converting...' : 'Run ffmpeg'}
                </Button>
              </Stack>
            )}

            {ffSection === 'advanced' && (
              <Stack spacing={1.5}>
                <Divider>
                  <Typography variant="caption">Advanced Encoding</Typography>
                </Divider>
                <Grid container spacing={1.5}>
                  {ffAdvancedPage === 0 && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          label="Video Codec"
                          value={ffForm.video_codec}
                          onChange={(event) => setFfForm({ ...ffForm, video_codec: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Audio Codec"
                          value={ffForm.audio_codec}
                          onChange={(event) => setFfForm({ ...ffForm, audio_codec: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Audio Bitrate"
                          value={ffForm.audio_bitrate}
                          onChange={(event) => setFfForm({ ...ffForm, audio_bitrate: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Preset"
                          value={ffForm.preset}
                          onChange={(event) => setFfForm({ ...ffForm, preset: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="CRF"
                          value={ffForm.crf}
                          onChange={(event) => setFfForm({ ...ffForm, crf: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                    </>
                  )}
                  {ffAdvancedPage === 1 && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          label="Scale"
                          value={ffForm.scale}
                          onChange={(event) => setFfForm({ ...ffForm, scale: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Start Time"
                          value={ffForm.start_time}
                          onChange={(event) => setFfForm({ ...ffForm, start_time: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Duration"
                          value={ffForm.duration}
                          onChange={(event) => setFfForm({ ...ffForm, duration: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="FPS"
                          value={ffForm.fps}
                          onChange={(event) => setFfForm({ ...ffForm, fps: event.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => setFfAdvancedPage(0)} disabled={ffAdvancedPage === 0}>
                    Page 1
                  </Button>
                  <Button size="small" onClick={() => setFfAdvancedPage(1)} disabled={ffAdvancedPage === 1}>
                    Page 2
                  </Button>
                </Stack>
                <Button
                  variant="contained"
                  onClick={runFfmpeg}
                  disabled={loading.ff || !ffForm.input_path}
                  startIcon={loading.ff ? <CircularProgress size={18} /> : <TransformIcon />}
                >
                  {loading.ff ? 'Converting...' : 'Run ffmpeg'}
                </Button>
              </Stack>
            )}

            {ffSection === 'output' && (
              <TextField
                label="ffmpeg Output"
                value={ffResult}
                multiline
                minRows={8}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy Output">
                        <IconButton onClick={() => copyToClipboard(ffResult)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Stack spacing={2}>
            <ToggleButtonGroup
              value={repoSection}
              exclusive
              onChange={(event, nextValue) => nextValue && setRepoSection(nextValue)}
              size="small"
            >
              <ToggleButton value="form">Form</ToggleButton>
              <ToggleButton value="output">Output</ToggleButton>
            </ToggleButtonGroup>

            {repoSection === 'form' && (
              <Stack spacing={1.5}>
                <TextField
                  select
                  label="Site Template"
                  value={repoForm.template}
                  onChange={(event) => setRepoForm({ ...repoForm, template: event.target.value })}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="vite-vanilla-js">Vite Vanilla JS</MenuItem>
                  <MenuItem value="astro-js">Astro JS</MenuItem>
                  <MenuItem value="vite-react-jsx">Vite React JSX</MenuItem>
                  <MenuItem value="vite-react-tsx">Vite React TSX</MenuItem>
                </TextField>
                <TextField
                  label="Site Folder Name"
                  value={repoForm.site_name}
                  onChange={(event) => setRepoForm({ ...repoForm, site_name: event.target.value })}
                  fullWidth
                  size="small"
                  helperText="Created under sentinel_clones/idk new sites folder"
                />
                <TextField
                  label="Site Title"
                  value={repoForm.site_title}
                  onChange={(event) => setRepoForm({ ...repoForm, site_title: event.target.value })}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Author"
                  value={repoForm.author}
                  onChange={(event) => setRepoForm({ ...repoForm, author: event.target.value })}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={repoForm.description}
                  onChange={(event) => setRepoForm({ ...repoForm, description: event.target.value })}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={createSite}
                  disabled={loading.repo || !repoForm.site_name}
                  startIcon={loading.repo ? <CircularProgress size={18} /> : <CreateNewFolderIcon />}
                >
                  {loading.repo ? 'Creating...' : 'Create New Site'}
                </Button>
              </Stack>
            )}

            {repoSection === 'output' && (
              <TextField
                label="Site Creation Output"
                value={repoResult}
                multiline
                minRows={8}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy Output">
                        <IconButton onClick={() => copyToClipboard(repoResult)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Stack spacing={2}>
            <Card variant="outlined">
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2">WHOIS Lookup</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
                  <TextField
                    label="Domain or IP"
                    placeholder="example.com"
                    value={nativeForm.whoisTarget}
                    onChange={(event) => setNativeForm({ ...nativeForm, whoisTarget: event.target.value })}
                    fullWidth
                    size="small"
                  />
                  <Button variant="contained" onClick={runWhois} disabled={nativeLoading.whois || !nativeForm.whoisTarget}>
                    {nativeLoading.whois ? 'Running...' : 'Run WHOIS'}
                  </Button>
                </Stack>
                <TextField
                  label="WHOIS Output"
                  value={nativeResult.whois}
                  multiline
                  minRows={8}
                  fullWidth
                  sx={{ mt: 1.2 }}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Card>

            <Card variant="outlined">
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2">DNS Lookup</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
                  <TextField
                    label="Domain"
                    placeholder="example.com"
                    value={nativeForm.dnsDomain}
                    onChange={(event) => setNativeForm({ ...nativeForm, dnsDomain: event.target.value })}
                    fullWidth
                    size="small"
                  />
                  <Button variant="contained" onClick={runDns} disabled={nativeLoading.dns || !nativeForm.dnsDomain}>
                    {nativeLoading.dns ? 'Running...' : 'Run DNS Lookup'}
                  </Button>
                </Stack>
                <TextField
                  label="DNS Output"
                  value={nativeResult.dns}
                  multiline
                  minRows={8}
                  fullWidth
                  sx={{ mt: 1.2 }}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Card>

            <Card variant="outlined">
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2">Ping</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Grid container spacing={1.2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Target"
                      placeholder="1.1.1.1"
                      value={nativeForm.pingTarget}
                      onChange={(event) => setNativeForm({ ...nativeForm, pingTarget: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Count"
                      value={nativeForm.pingCount}
                      onChange={(event) => setNativeForm({ ...nativeForm, pingCount: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Interval"
                      value={nativeForm.pingInterval}
                      onChange={(event) => setNativeForm({ ...nativeForm, pingInterval: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Timeout"
                      value={nativeForm.pingTimeout}
                      onChange={(event) => setNativeForm({ ...nativeForm, pingTimeout: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Extra Args (Optional)"
                      placeholder="-4"
                      value={nativeForm.pingExtraArgs}
                      onChange={(event) => setNativeForm({ ...nativeForm, pingExtraArgs: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button variant="contained" onClick={runPing} disabled={nativeLoading.ping || !nativeForm.pingTarget} fullWidth>
                      {nativeLoading.ping ? 'Running...' : 'Run Ping'}
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  label="Ping Output"
                  value={nativeResult.ping}
                  multiline
                  minRows={8}
                  fullWidth
                  sx={{ mt: 1.2 }}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Card>

            <Card variant="outlined">
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2">Traceroute</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Grid container spacing={1.2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Target"
                      placeholder="example.com"
                      value={nativeForm.traceTarget}
                      onChange={(event) => setNativeForm({ ...nativeForm, traceTarget: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Max Hops"
                      value={nativeForm.traceMaxHops}
                      onChange={(event) => setNativeForm({ ...nativeForm, traceMaxHops: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Wait"
                      value={nativeForm.traceWait}
                      onChange={(event) => setNativeForm({ ...nativeForm, traceWait: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Queries"
                      value={nativeForm.traceQueries}
                      onChange={(event) => setNativeForm({ ...nativeForm, traceQueries: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={nativeForm.traceUseIcmp}
                          onChange={(event) => setNativeForm({ ...nativeForm, traceUseIcmp: event.target.checked })}
                        />
                      }
                      label="ICMP"
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Extra Args (Optional)"
                      placeholder="-n"
                      value={nativeForm.traceExtraArgs}
                      onChange={(event) => setNativeForm({ ...nativeForm, traceExtraArgs: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      onClick={runTraceroute}
                      disabled={nativeLoading.traceroute || !nativeForm.traceTarget}
                      fullWidth
                    >
                      {nativeLoading.traceroute ? 'Running...' : 'Run Traceroute'}
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  label="Traceroute Output"
                  value={nativeResult.traceroute}
                  multiline
                  minRows={8}
                  fullWidth
                  sx={{ mt: 1.2 }}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Card>

            <Card variant="outlined">
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2">IP Inspect</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Grid container spacing={1.2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Scope"
                      value={nativeForm.ipScope}
                      onChange={(event) => setNativeForm({ ...nativeForm, ipScope: event.target.value })}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="addr">addr</MenuItem>
                      <MenuItem value="route">route</MenuItem>
                      <MenuItem value="link">link</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Interface (Optional)"
                      placeholder="eth0"
                      value={nativeForm.ipInterface}
                      onChange={(event) => setNativeForm({ ...nativeForm, ipInterface: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Extra Args (Optional)"
                      placeholder="scope global"
                      value={nativeForm.ipExtraArgs}
                      onChange={(event) => setNativeForm({ ...nativeForm, ipExtraArgs: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button variant="contained" onClick={runIp} disabled={nativeLoading.ip} fullWidth>
                      {nativeLoading.ip ? 'Running...' : 'Run IP'}
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  label="IP Output"
                  value={nativeResult.ip}
                  multiline
                  minRows={8}
                  fullWidth
                  sx={{ mt: 1.2 }}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Card>

            <Card variant="outlined">
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2">Socket Summary (ss)</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Grid container spacing={1.2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Mode"
                      value={nativeForm.ssMode}
                      onChange={(event) => setNativeForm({ ...nativeForm, ssMode: event.target.value })}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="listening">listening</MenuItem>
                      <MenuItem value="all">all</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Protocol"
                      value={nativeForm.ssProtocol}
                      onChange={(event) => setNativeForm({ ...nativeForm, ssProtocol: event.target.value })}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="all">all</MenuItem>
                      <MenuItem value="tcp">tcp</MenuItem>
                      <MenuItem value="udp">udp</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={nativeForm.ssExtended}
                          onChange={(event) => setNativeForm({ ...nativeForm, ssExtended: event.target.checked })}
                        />
                      }
                      label="Extended"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Extra Args (Optional)"
                      placeholder="state established"
                      value={nativeForm.ssExtraArgs}
                      onChange={(event) => setNativeForm({ ...nativeForm, ssExtraArgs: event.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={runSs} disabled={nativeLoading.ss} fullWidth>
                      {nativeLoading.ss ? 'Running...' : 'Run ss'}
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  label="ss Output"
                  value={nativeResult.ss}
                  multiline
                  minRows={8}
                  fullWidth
                  sx={{ mt: 1.2 }}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Card>
          </Stack>
        </TabPanel>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
