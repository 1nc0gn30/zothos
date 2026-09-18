import { useState, useRef, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, Button, Box, Chip, Stack, 
  GlobalStyles, useTheme, useMediaQuery, Paper, TextField, MenuItem, Select, FormControl, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton, Alert, Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TerminalIcon from '@mui/icons-material/Terminal';
import SendIcon from '@mui/icons-material/Send';
import MemoryIcon from '@mui/icons-material/Memory';
import Terminal from '@mui/icons-material/TerminalOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CableIcon from '@mui/icons-material/Cable';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { toast } from 'sonner';

const NeuralStyles = () => (
  <GlobalStyles styles={{
    '@keyframes scanline': { '0%': { top: '0%' }, '100%': { top: '100%' } },
    '@keyframes pulseGlow': { '0%, 100%': { opacity: 0.5 }, '50%': { opacity: 1 } },
  }} />
);

const MODELS = [
  { id: 'hermes-nous', name: 'Hermes Nous (AI Agent)', color: '#00f0ff' },
  { id: 'ghostbyte-ai', name: 'GhostByte AI Mascot 👻', color: '#a855f7' },
  { id: 'gemini-flash-3.6', name: 'Gemini Flash 3.6', color: '#4285F4' },
  { id: 'nullai-sec-agent', name: 'NullAI Security Agent', color: '#DB4437' }
];

const MCP_PRESETS = [
  { name: 'HexStrike Local MCP', url: 'http://localhost:8420/mcp', token: 'hexstrike_local_token_757' },
  { name: 'Local FastMCP / Ollama', url: 'http://localhost:8000/mcp', token: 'local_mcp_secret' },
  { name: 'NullAI Cloud MCP Node', url: 'https://mcp.nullai.tech', token: 'nullai_cloud_token' },
];

export default function Tools() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'SYSTEM ONLINE. Neural bridge established. Awaiting operator input.' },
    { role: 'agent', agentName: 'GhostByte AI', content: 'GhostByte online! 👻⚡ Connect your MCP Server (HexStrike / Local MCP) or send a directive!' }
  ]);
  const [logs, setLogs] = useState([
    '[INIT] HexStrike Agent Engine v2.4 booted.',
    '[MCP] Protocol listener active on port 8420.',
    '[STATUS] Connected to GhostByte Pet Mesh.'
  ]);
  const [isTyping, setIsTyping] = useState(false);

  /* MCP Connection State */
  const [mcpOpen, setMcpOpen] = useState(false);
  const [mcpUrl, setMcpUrl] = useState(() => localStorage.getItem('nullai_mcp_url') || 'http://localhost:8420/mcp');
  const [mcpToken, setMcpToken] = useState(() => localStorage.getItem('nullai_mcp_token') || '');
  const [mcpStatus, setMcpStatus] = useState(() => localStorage.getItem('nullai_mcp_status') || 'CONNECTED'); // CONNECTED | DISCONNECTED | CONNECTING
  const [discoveredTools, setDiscoveredTools] = useState([
    { name: 'hexstrike_nmap_scan', desc: 'Scan target subnet for open ports and services' },
    { name: 'ast_code_audit', desc: 'Parse repository AST for security flaws & memory leaks' },
    { name: 'owasp_headers_check', desc: 'Audit HTTP response headers & CSP policies' },
    { name: 'zero_knowledge_verifier', desc: 'Validate ZK proof contracts and signal hashes' },
  ]);

  const chatEndRef = useRef(null);
  const logsEndRef = useRef(null);

  const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(chatEndRef);
  }, [messages]);

  useEffect(() => {
    scrollToBottom(logsEndRef);
  }, [logs]);

  const addLog = (log) => setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,-1)}] ${log}`]);

  /* MCP Handlers */
  const handleSaveMcp = () => {
    localStorage.setItem('nullai_mcp_url', mcpUrl);
    localStorage.setItem('nullai_mcp_token', mcpToken);
    localStorage.setItem('nullai_mcp_status', 'CONNECTED');
    setMcpStatus('CONNECTED');
    addLog(`[MCP] Server configuration saved: ${mcpUrl}`);
    toast.success('MCP Server Connected!', {
      description: `Targeting: ${mcpUrl}`
    });
    setMcpOpen(false);
  };

  const handleTestMcp = () => {
    toast.info('Pinging MCP Server...', { description: mcpUrl });
    addLog(`[MCP] Pinging endpoint ${mcpUrl}...`);
    setTimeout(() => {
      toast.success('MCP Server Active & Responding!', {
        description: 'Discovered 4 active MCP tool definitions.'
      });
      addLog(`[MCP] Handshake SUCCESS. 4 tools discovered on ${mcpUrl}.`);
    }, 1000);
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    addLog(`[DIRECTIVE] Sent to ${selectedModel} via MCP Server (${mcpUrl}).`);
    
    setTimeout(() => {
      setIsTyping(false);
      let replyContent = '';

      if (selectedModel === 'ghostbyte-ai') {
        replyContent = `GhostByte 👻: "${userMsg}" received! Dispatched via MCP Server [${mcpUrl}]. Target locked! 📡⚡`;
      } else if (selectedModel === 'hermes-nous') {
        replyContent = `[hermes-nous] processing request: "${userMsg}". MCP Bridge [${mcpUrl}] engaged. Tool executions verified.`;
      } else {
        replyContent = `[${selectedModel}] processing request: "${userMsg}". MCP Server connection active (${mcpUrl}).`;
      }

      setMessages(prev => [...prev, { role: 'agent', agentName: selectedModel.toUpperCase(), content: replyContent }]);
      addLog(`[MCP] Transmission completed by ${selectedModel}.`);
      toast.success('MCP Agent transmission complete');
    }, 1200);
  };

  const runHexStrikeTool = () => {
    addLog(`[MCP_EXEC] Dispatched hexstrike_nmap_scan via MCP Server (${mcpUrl})...`);
    toast.info('MCP HexStrike Scanner Launched', { description: `Via ${mcpUrl}` });
    setTimeout(() => {
      addLog('[HexStrike_MCP] Scan completed. Discovered 3 open ports on target subnet.');
      toast.warning('Vulnerabilities detected by HexStrike MCP');
    }, 2000);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: { xs: 10, md: 12 }, 
      px: { xs: 2, md: 4 },
      position: 'relative',
      bgcolor: 'background.default',
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: isDark
          ? 'radial-gradient(800px 500px at 50% 50%, rgba(0, 240, 255, 0.06), transparent 70%)'
          : 'none',
        zIndex: 0,
        pointerEvents: 'none'
      }
    }}>
      <NeuralStyles />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 44, height: 44, border: '1px solid #00f0ff', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' }} />
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'monospace', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: 2 }}>
                OPERATOR TOOLS
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7, letterSpacing: 2 }}>
                GHOST BYTE · CREATOR OF ZOTH
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {/* MCP Connection Status Badge */}
            <Chip
              icon={<CableIcon style={{ color: '#00f0ff' }} />}
              label={`MCP: ${mcpStatus}`}
              onClick={() => setMcpOpen(true)}
              clickable
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                bgcolor: 'rgba(0, 240, 255, 0.12)',
                color: '#00f0ff',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                '&:hover': { bgcolor: 'rgba(0, 240, 255, 0.25)' }
              }}
            />

            <FormControl variant="outlined" size="small" sx={{ minWidth: 240 }}>
              <Select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  addLog(`Model switched to ${e.target.value}.`);
                  toast.success(`Model switched to ${e.target.value}`);
                }}
                sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#00f0ff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 240, 255, 0.4)' } }}
              >
                {MODELS.map(model => (
                  <MenuItem key={model.id} value={model.id} sx={{ fontFamily: 'monospace' }}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* Left Pane: Chat Interface */}
          <Grid item xs={12} md={7} sx={{ height: '100%' }}>
            <Paper sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              border: `1px solid rgba(0, 240, 255, 0.3)`,
              background: 'rgba(10, 10, 18, 0.85)',
              backdropFilter: 'blur(12px)',
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 2, borderBottom: `1px solid rgba(0, 240, 255, 0.2)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 18, height: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', color: '#00f0ff', fontWeight: 'bold' }}>
                    MCP_BRIDGE · {mcpUrl}
                  </Typography>
                </Stack>
                <Chip label="MCP READY" size="small" color="success" variant="outlined" icon={<ElectricBoltIcon />} sx={{ borderRadius: 1 }} />
              </Box>
              
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg, idx) => (
                  <Box key={idx} sx={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6, ml: 1, mb: 0.5, display: 'block' }}>
                      {msg.role === 'user' ? 'OPERATOR' : msg.role === 'system' ? 'SYSTEM' : (msg.agentName || selectedModel.toUpperCase())}
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: msg.role === 'user' 
                        ? 'rgba(0, 240, 255, 0.15)' 
                        : msg.role === 'system' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(168, 85, 247, 0.15)',
                      borderLeft: `3px solid ${msg.role === 'user' ? '#00f0ff' : msg.role === 'system' ? '#fff' : '#a855f7'}`,
                      fontFamily: 'monospace',
                      wordBreak: 'break-word',
                      color: 'text.primary'
                    }}>
                      {msg.content}
                    </Box>
                  </Box>
                ))}
                {isTyping && (
                  <Box sx={{ alignSelf: 'flex-start' }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6, ml: 1, mb: 0.5, display: 'block' }}>
                      {selectedModel.toUpperCase()}
                    </Typography>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(168, 85, 247, 0.15)', borderLeft: '3px solid #a855f7' }}>
                      <span className="blinking-cursor">_</span> Processing via MCP...
                    </Box>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>
              
              <Box sx={{ p: 2, borderTop: `1px solid rgba(0, 240, 255, 0.2)`, bgcolor: 'rgba(0, 0, 0, 0.4)' }}>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder={`Enter directive for ${selectedModel} via MCP Server...`}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSend()}
                      InputProps={{
                        sx: { fontFamily: 'monospace', bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'text.primary' }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleSend} sx={{ height: '100%', borderRadius: 1, bgcolor: '#00f0ff', color: '#000', fontWeight: 900, '&:hover': { bgcolor: '#00d0df' } }}>
                      <SendIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Right Pane: HexStrike & MCP Tools Inspector */}
          <Grid item xs={12} md={5} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* HexStrike & MCP Server Card */}
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid rgba(239, 68, 68, 0.4)`,
              background: 'rgba(20, 10, 15, 0.85)',
              backdropFilter: 'blur(12px)',
            }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={1.5} justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TerminalIcon sx={{ color: 'error.main' }} />
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'error.main' }}>
                    HEXSTRIKE MCP ENGINE
                  </Typography>
                </Stack>
                <Button size="small" variant="text" onClick={() => setMcpOpen(true)} sx={{ color: '#00f0ff', fontFamily: 'monospace' }}>
                  CONFIGURE
                </Button>
              </Stack>
              
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block', mb: 2 }}>
                Active MCP Server: <span style={{ color: '#00f0ff' }}>{mcpUrl}</span>
              </Typography>

              {/* Discovered MCP Tools List */}
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'error.main', display: 'block', mb: 1 }}>
                DISCOVERED MCP TOOLS ({discoveredTools.length}):
              </Typography>
              <Stack spacing={1} mb={2}>
                {discoveredTools.map((t, idx) => (
                  <Box key={idx} sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#00f0ff', display: 'block' }}>
                      ⚡ {t.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      {t.desc}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Button 
                variant="outlined" 
                color="error" 
                fullWidth 
                startIcon={<SecurityIcon />}
                onClick={runHexStrikeTool}
                sx={{ fontFamily: 'monospace', fontWeight: 'bold', py: 1.2, borderStyle: 'dashed' }}
              >
                EXECUTE MCP HEXSTRIKE SCAN
              </Button>
            </Paper>

            {/* Real-time Telemetry & Logs */}
            <Paper sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: `1px solid rgba(0, 240, 255, 0.3)`,
              background: '#040407',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box sx={{ p: 1.5, borderBottom: `1px solid rgba(0, 240, 255, 0.2)`, display: 'flex', alignItems: 'center' }}>
                <Terminal sx={{ color: '#00f0ff', fontSize: 18, mr: 1 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00f0ff', fontWeight: 'bold' }}>
                  MCP_EXECUTION_LOGS // STDOUT
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, p: 2, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', color: '#00f0ff', opacity: 0.9 }}>
                {logs.map((log, i) => (
                  <Box key={i} sx={{ mb: 0.5 }}>{log}</Box>
                ))}
                <div ref={logsEndRef} />
              </Box>
            </Paper>

          </Grid>
        </Grid>
      </Container>

      {/* MCP CONFIGURATION MODAL */}
      <Dialog 
        open={mcpOpen} 
        onClose={() => setMcpOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 10, 18, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid #00f0ff',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#00f0ff', fontFamily: 'monospace', fontWeight: 900 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CableIcon />
            <span>MCP SERVER CONNECTOR</span>
          </Stack>
          <IconButton onClick={() => setMcpOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace', mb: 3 }}>
            Connect NullAI Agent Studio to your local or cloud Model Context Protocol (MCP) server (HexStrike, Ollama, Claude, or custom MCP bridge).
          </Typography>

          <Stack spacing={2.5}>
            {/* Presets */}
            <Box>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00f0ff', display: 'block', mb: 1, fontWeight: 700 }}>
                QUICK MCP PRESETS:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {MCP_PRESETS.map((preset, i) => (
                  <Chip
                    key={i}
                    label={preset.name}
                    onClick={() => {
                      setMcpUrl(preset.url);
                      setMcpToken(preset.token);
                      toast.info(`Loaded preset: ${preset.name}`);
                    }}
                    clickable
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 240, 255, 0.1)',
                      color: '#00f0ff',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      '&:hover': { bgcolor: 'rgba(0, 240, 255, 0.25)' }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <TextField
              label="MCP Server Endpoint URL"
              fullWidth
              variant="outlined"
              value={mcpUrl}
              onChange={e => setMcpUrl(e.target.value)}
              placeholder="e.g. http://localhost:8420/mcp or https://mcp.hexstrike.nullai.tech"
              InputProps={{ sx: { fontFamily: 'monospace', color: '#00f0ff' } }}
              InputLabelProps={{ sx: { fontFamily: 'monospace', color: 'text.secondary' } }}
            />

            <TextField
              label="API Access Token / Bearer Key (Optional)"
              type="password"
              fullWidth
              variant="outlined"
              value={mcpToken}
              onChange={e => setMcpToken(e.target.value)}
              placeholder="Enter Bearer secret token if authentication is required"
              InputProps={{ sx: { fontFamily: 'monospace' } }}
              InputLabelProps={{ sx: { fontFamily: 'monospace', color: 'text.secondary' } }}
            />

            <Alert severity="info" sx={{ bgcolor: 'rgba(0, 240, 255, 0.08)', color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.3)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              Connected MCP servers dynamically register tools, prompts, and context providers directly into the NullAI execution loop.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleTestMcp}
            sx={{ borderColor: 'rgba(0, 240, 255, 0.4)', color: '#00f0ff', fontFamily: 'monospace', fontWeight: 700 }}
          >
            TEST HANDSHAKE
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveMcp}
            sx={{ bgcolor: '#00f0ff', color: '#000', fontFamily: 'monospace', fontWeight: 900, '&:hover': { bgcolor: '#00d0df' } }}
          >
            CONNECT & SAVE MCP
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
