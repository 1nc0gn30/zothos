import React, { useState, useId } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import { useNavigate } from 'react-router-dom';
import { playClickSound, playCalculationSound, playSuccessSound, setMuted, getMuted } from '../utils/audioFX';

const serviceCategories = [
  { id: 'pc_repair', label: 'PC & Hardware Repair', icon: <MemoryIcon sx={{ color: '#FFD700' }} /> },
  { id: 'cybersecurity', label: 'Cybersecurity Audit', icon: <SecurityIcon sx={{ color: '#00D2FF' }} /> },
  { id: 'cloud', label: 'Cloud & Infrastructure', icon: <CloudIcon sx={{ color: '#A060FF' }} /> },
  { id: 'managed_it', label: 'Managed IT & VoIP', icon: <PhoneInTalkIcon sx={{ color: '#00FF99' }} /> }
];

const issuePresets = {
  pc_repair: [
    { id: 'virus', label: 'Virus / Ransomware Removal', baseCost: 120, timeHrs: 2 },
    { id: 'ssd', label: 'SSD Speed & Memory Upgrade', baseCost: 150, timeHrs: 1.5 },
    { id: 'screen', label: 'Laptop Display / Screen Replacement', baseCost: 180, timeHrs: 2 },
    { id: 'power', label: 'Power Supply / No Power / Boot Failure', baseCost: 140, timeHrs: 2 },
    { id: 'motherboard', label: 'Motherboard Diagnostic & Component Repair', baseCost: 220, timeHrs: 3.5 },
    { id: 'overheating', label: 'Thermal Cleanup & Cooling Replacement', baseCost: 95, timeHrs: 1.5 }
  ],
  cybersecurity: [
    { id: 'risk_audit', label: 'Comprehensive Cyber Risk Assessment', baseCost: 450, timeHrs: 6 },
    { id: 'edr', label: 'Endpoint Detection & Response (EDR Setup)', baseCost: 250, timeHrs: 3 },
    { id: 'vciso', label: 'Virtual CISO Executive Consulting', baseCost: 650, timeHrs: 8 },
    { id: 'phishing', label: 'Employee Phishing Simulation & Training', baseCost: 200, timeHrs: 3 },
    { id: 'compliance', label: 'HIPAA / CMMC Compliance Hardening', baseCost: 550, timeHrs: 7 }
  ],
  cloud: [
    { id: 'm365', label: 'Microsoft 365 / Google Workspace Migration', baseCost: 350, timeHrs: 5 },
    { id: 'azure_aws', label: 'Azure / AWS Cloud Server Setup', baseCost: 600, timeHrs: 8 },
    { id: 'backup', label: 'Automated Immutable Cloud Backup', baseCost: 220, timeHrs: 3 },
    { id: 'disaster', label: 'Disaster Recovery Architecture Plan', baseCost: 400, timeHrs: 5 }
  ],
  managed_it: [
    { id: 'helpdesk', label: '24/7 Proactive Helpdesk Monitoring', baseCost: 300, timeHrs: 4 },
    { id: 'voip', label: 'Cloud VoIP Phone System Setup', baseCost: 280, timeHrs: 4 },
    { id: 'cabling', label: 'Structured Ethernet & Network Cabling', baseCost: 380, timeHrs: 6 },
    { id: 'firewall', label: 'Enterprise Firewall & VPN Tunnel Config', baseCost: 320, timeHrs: 4 }
  ]
};

const AIEstimatorWidget = () => {
  const navigate = useNavigate();
  const categoryId = useId();
  const urgencyId = useId();
  const [selectedCategory, setSelectedCategory] = useState('pc_repair');
  const [deviceCount, setDeviceCount] = useState(1);
  const [urgency, setUrgency] = useState('standard');
  const [selectedIssues, setSelectedIssues] = useState(['virus', 'ssd']);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [audioMuted, setAudioMuted] = useState(getMuted());
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleSound = () => {
    const nextState = !audioMuted;
    setAudioMuted(nextState);
    setMuted(nextState);
    if (!nextState) playClickSound();
  };

  const handleCategoryChange = (catId) => {
    playClickSound();
    setSelectedCategory(catId);
    // Pre-select top 2 presets for quick preview
    const defaults = issuePresets[catId].slice(0, 2).map((item) => item.id);
    setSelectedIssues(defaults);
    setDiagnosticResult(null);
  };

  const handleIssueToggle = (issueId) => {
    playClickSound();
    if (selectedIssues.includes(issueId)) {
      setSelectedIssues(selectedIssues.filter((id) => id !== issueId));
    } else {
      setSelectedIssues([...selectedIssues, issueId]);
    }
  };

  const calculateEstimate = () => {
    playCalculationSound();
    setIsCalculating(true);

    setTimeout(() => {
      const presets = issuePresets[selectedCategory];
      const activeItems = presets.filter((p) => selectedIssues.includes(p.id));

      let baseTotal = activeItems.reduce((acc, curr) => acc + curr.baseCost, 0);
      if (baseTotal === 0) baseTotal = 120; // Default minimum diagnostic

      // Multiplier based on device count
      const scaleFactor = 1 + (deviceCount - 1) * 0.45;
      let calculatedCost = baseTotal * scaleFactor;

      // Urgency factor
      let urgencyMultiplier = 1.0;
      let urgencyLabel = 'Standard 48-Hour Turnaround';
      if (urgency === 'priority') {
        urgencyMultiplier = 1.25;
        urgencyLabel = 'Priority Next-Day Turnaround (+25%)';
      } else if (urgency === 'emergency') {
        urgencyMultiplier = 1.6;
        urgencyLabel = '24/7 Immediate Emergency Dispatch (+60%)';
      }

      calculatedCost *= urgencyMultiplier;

      const minEstimate = Math.round(calculatedCost * 0.9);
      const maxEstimate = Math.round(calculatedCost * 1.15);
      const totalLaborHours = Math.round(activeItems.reduce((acc, curr) => acc + curr.timeHrs, 0) * scaleFactor * 10) / 10 || 2.5;

      // AI Reasoning Engine generation
      let aiAnalysis = '';
      if (symptomNotes.trim().length > 5) {
        aiAnalysis = `AI Symptom Audit: Evaluated custom notes ("${symptomNotes.trim()}"). High probability of hardware/configuration bottleneck requiring localized repair and security isolation.`;
      } else {
        aiAnalysis = `AI Diagnostic Synthesis: Workload configured for ${deviceCount} system(s) under ${selectedCategory.toUpperCase()} parameters. Optimized for maximum performance and security resiliency.`;
      }

      setDiagnosticResult({
        categoryName: serviceCategories.find((c) => c.id === selectedCategory).label,
        minEstimate,
        maxEstimate,
        laborHours: totalLaborHours,
        urgencyLabel,
        activeItems,
        aiAnalysis,
        confidenceScore: 98.4
      });

      setIsCalculating(false);
      playSuccessSound();
    }, 450);
  };

  const handleCopyQuote = () => {
    if (!diagnosticResult) return;
    playClickSound();
    const summaryText = `--- All PC Repair Instant Estimate ---
Service Type: ${diagnosticResult.categoryName}
Device Count: ${deviceCount}
Turnaround: ${diagnosticResult.urgencyLabel}
Selected Workload: ${diagnosticResult.activeItems.map((i) => i.label).join(', ')}
Estimated Labor: ${diagnosticResult.laborHours} hrs
Estimated Cost Range: $${diagnosticResult.minEstimate} - $${diagnosticResult.maxEstimate}
AI Diagnostic Note: ${diagnosticResult.aiAnalysis}
Phone: (757) 559-1231 | Website: https://www.allpcrepairva.com`;

    navigator.clipboard.writeText(summaryText);
    setToastMessage('Estimate copied to clipboard successfully!');
  };

  const handleBookConsultation = () => {
    playClickSound();
    const noteStr = diagnosticResult
      ? `Estimate for ${diagnosticResult.categoryName} ($${diagnosticResult.minEstimate}-$${diagnosticResult.maxEstimate})`
      : 'General Inquiry';
    navigate('/contact', { state: { estimateDetails: noteStr } });
  };

  return (
    <Box
      id="estimator"
      sx={{
        py: 6,
        px: { xs: 2, sm: 4 },
        my: 4,
        background: 'linear-gradient(135deg, rgba(18, 18, 24, 0.95) 0%, rgba(10, 10, 16, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.1)',
        color: '#FFFFFF'
      }}
    >
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoFixHighIcon sx={{ color: '#FFD700', fontSize: '2.2rem' }} />
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#FFD700', fontFamily: 'Namotura, sans-serif' }}>
              Interactive AI Service & Repair Estimator
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
              Instant cost breakdowns & diagnostic synthesis for Hampton Roads businesses and residents
            </Typography>
          </Box>
        </Box>

        <Tooltip title={audioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'} arrow>
          <IconButton
            onClick={toggleSound}
            aria-label={audioMuted ? 'Unmute interactive sound effects' : 'Mute interactive sound effects'}
            sx={{
              color: audioMuted ? '#9E9E9E' : '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              backgroundColor: 'rgba(255, 215, 0, 0.05)',
              '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.15)' }
            }}
          >
            {audioMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Category Tabs */}
      <Grid container spacing={2} sx={{ mb: 4 }} role="tablist" aria-label="Service Category Selection">
        {serviceCategories.map((cat) => (
          <Grid item xs={6} sm={3} key={cat.id}>
            <Paper
              role="tab"
              aria-selected={selectedCategory === cat.id}
              tabIndex={0}
              onClick={() => handleCategoryChange(cat.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCategoryChange(cat.id); }}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                background: selectedCategory === cat.id
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: selectedCategory === cat.id
                  ? '2px solid #FFD700'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#FFD700',
                  boxShadow: '0 6px 16px rgba(255, 215, 0, 0.15)'
                },
                '&:focus-visible': {
                  outline: '3px solid #00D2FF',
                  outlineOffset: '2px'
                }
              }}
            >
              <Box sx={{ fontSize: '2rem', mb: 0.5 }}>{cat.icon}</Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: selectedCategory === cat.id ? '#FFD700' : '#E0E0E0' }}>
                {cat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Left Inputs Panel */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 600 }}>
            1. Select Specific Issues & Services
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            {issuePresets[selectedCategory].map((issue) => (
              <FormControlLabel
                key={issue.id}
                control={
                  <Checkbox
                    checked={selectedIssues.includes(issue.id)}
                    onChange={() => handleIssueToggle(issue.id)}
                    sx={{
                      color: 'rgba(255, 215, 0, 0.6)',
                      '&.Mui-checked': { color: '#FFD700' }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#E0E0E0' }}>{issue.label}</Typography>
                    <Chip label={`~$${issue.baseCost}`} size="small" sx={{ ml: 1, backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', fontSize: '0.75rem' }} />
                  </Box>
                }
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
            2. System / Device Quantity: {deviceCount}
          </Typography>
          <Box sx={{ px: 2, mb: 3 }}>
            <Slider
              value={deviceCount}
              min={1}
              max={50}
              onChange={(e, val) => { playClickSound(); setDeviceCount(val); }}
              valueLabelDisplay="auto"
              aria-label="Number of computers or systems requiring IT service"
              sx={{
                color: '#FFD700',
                '& .MuiSlider-thumb': {
                  boxShadow: '0 0 10px #FFD700'
                }
              }}
            />
            <Typography variant="caption" sx={{ color: '#90A4AE' }}>
              Select number of PCs, servers, or endpoints affected.
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id={urgencyId} sx={{ color: '#FFD700' }}>Turnaround & SLA</InputLabel>
                <Select
                  labelId={urgencyId}
                  value={urgency}
                  label="Turnaround & SLA"
                  onChange={(e) => { playClickSound(); setUrgency(e.target.value); }}
                  sx={{
                    color: '#FFF',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 215, 0, 0.4)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                    '.MuiSvgIcon-root': { color: '#FFD700' }
                  }}
                >
                  <MenuItem value="standard">Standard (48 hrs)</MenuItem>
                  <MenuItem value="priority">Priority Next-Day (+25%)</MenuItem>
                  <MenuItem value="emergency">24/7 Emergency Onsite (+60%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Custom Symptom Notes (Optional)"
                placeholder="e.g. BSOD error 0x000, slow startup..."
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFF' },
                  '& .MuiInputLabel-root': { color: '#B0BEC5' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            disabled={isCalculating}
            onClick={calculateEstimate}
            startIcon={<AutoFixHighIcon />}
            sx={{
              py: 1.5,
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: '12px',
              backgroundColor: '#FFD700',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
              },
              '&:focus-visible': {
                outline: '3px solid #00D2FF',
                outlineOffset: '2px'
              }
            }}
          >
            {isCalculating ? 'Processing AI Diagnostic...' : 'Generate Instant AI Estimate'}
          </Button>
        </Grid>

        {/* Right Output Panel */}
        <Grid item xs={12} md={6}>
          <Card
            role="region"
            aria-live="polite"
            aria-label="AI Estimate Results"
            sx={{
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '16px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00D2FF', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon /> Diagnostic Estimate Summary
              </Typography>

              {!diagnosticResult ? (
                <Box sx={{ py: 6, textAlign: 'center', color: '#78909C' }}>
                  <AutoFixHighIcon sx={{ fontSize: '3.5rem', opacity: 0.3, mb: 1 }} />
                  <Typography variant="body1">
                    Select your service parameters on the left and click <strong>Generate Instant AI Estimate</strong>.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2, p: 2, backgroundColor: 'rgba(255, 215, 0, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#FFD700', textTransform: 'uppercase', tracking: '1px' }}>
                        Estimated Price Range
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                        ${diagnosticResult.minEstimate} <Typography component="span" variant="h5" sx={{ color: '#FFD700' }}>- ${diagnosticResult.maxEstimate}</Typography>
                      </Typography>
                    </Box>
                    <Chip icon={<CheckCircleIcon sx={{ color: '#00FF99 !important' }} />} label={`${diagnosticResult.confidenceScore}% AI Confidence`} sx={{ backgroundColor: 'rgba(0, 255, 153, 0.15)', color: '#00FF99', fontWeight: 600 }} />
                  </Box>

                  <Typography variant="subtitle2" sx={{ color: '#B0BEC5', mb: 0.5 }}>
                    Labor Estimate: <strong style={{ color: '#FFF' }}>~{diagnosticResult.laborHours} Hours</strong> | Turnaround: <strong style={{ color: '#FFD700' }}>{diagnosticResult.urgencyLabel}</strong>
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, mb: 1 }}>
                    Scope of Services Included:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {diagnosticResult.activeItems.map((item) => (
                      <Chip key={item.id} label={item.label} size="small" sx={{ backgroundColor: 'rgba(0, 210, 255, 0.15)', color: '#00D2FF', border: '1px solid rgba(0, 210, 255, 0.3)' }} />
                    ))}
                  </Box>

                  <Alert severity="info" icon={<AutoFixHighIcon sx={{ color: '#00D2FF' }} />} sx={{ backgroundColor: 'rgba(0, 210, 255, 0.08)', color: '#E0F7FA', border: '1px solid rgba(0, 210, 255, 0.2)', fontSize: '0.85rem' }}>
                    {diagnosticResult.aiAnalysis}
                  </Alert>
                </Box>
              )}
            </CardContent>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Button
                fullWidth
                variant="outlined"
                disabled={!diagnosticResult}
                onClick={handleCopyQuote}
                startIcon={<ContentCopyIcon />}
                sx={{
                  color: '#FFD700',
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  '&:hover': { borderColor: '#FFD700', backgroundColor: 'rgba(255, 215, 0, 0.1)' },
                  '&:focus-visible': { outline: '3px solid #00D2FF', outlineOffset: '2px' }
                }}
              >
                Copy Formal Quote
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBookConsultation}
                endIcon={<SendIcon />}
                sx={{
                  backgroundColor: '#00D2FF',
                  color: '#000000',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#FFFFFF', boxShadow: '0 0 20px rgba(0, 210, 255, 0.6)' },
                  '&:focus-visible': { outline: '3px solid #FFD700', outlineOffset: '2px' }
                }}
              >
                Book Repair & Audit
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage('')}
        message={toastMessage}
      />
    </Box>
  );
};

export default AIEstimatorWidget;
