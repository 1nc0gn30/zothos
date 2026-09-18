import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  Chip,
  Divider,
  FormControlLabel,
  Switch,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';

const TEMPLATE_PRESETS = {
  announcement: {
    subject: 'Important Update',
    heading: 'Update from our team',
    preheader: 'A quick update and next steps',
    body: 'Hi there,\n\nWe wanted to share an important update related to this site.\n\nThanks for being with us.',
    ctaText: 'View Details',
    ctaUrl: 'https://example.com',
    footer: 'Reply to this email if you have questions.'
  },
  launch: {
    subject: 'New Feature Launch',
    heading: 'We launched something new',
    preheader: 'Check out the newest addition',
    body: 'Hello,\n\nA new feature is now live. We built it to improve your experience and move faster.\n\nTake a look and tell us what you think.',
    ctaText: 'See What Is New',
    ctaUrl: 'https://example.com/new',
    footer: 'You are receiving this because you are in our site contact list.'
  },
  promo: {
    subject: 'Special Offer for You',
    heading: 'A limited-time offer',
    preheader: 'This is available for a short period',
    body: 'Hi,\n\nFor a limited time, we are offering exclusive access to a special offer.\n\nClaim it before it expires.',
    ctaText: 'Claim Offer',
    ctaUrl: 'https://example.com/offer',
    footer: 'Offer terms may apply.'
  }
};

function escapeHtml(input) {
  return (input || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function htmlFromDesigner(designer) {
  const heading = escapeHtml(designer.heading);
  const preheader = escapeHtml(designer.preheader);
  const body = escapeHtml(designer.body).replaceAll('\n', '<br/>');
  const footer = escapeHtml(designer.footer).replaceAll('\n', '<br/>');
  const ctaText = escapeHtml(designer.ctaText);
  const ctaUrl = escapeHtml(designer.ctaUrl);
  const showCta = Boolean(designer.ctaText && designer.ctaUrl);

  return `
<div style="margin:0;padding:24px;background:${designer.canvasBg};font-family:'Space Grotesk','Segoe UI',sans-serif;color:#dfe9ff;">
  <div style="max-width:640px;margin:0 auto;background:${designer.cardBg};border:1px solid ${designer.accentColor};border-radius:14px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.28);">
    <div style="padding:22px 26px;border-bottom:1px solid rgba(255,255,255,.12);background:linear-gradient(135deg, ${designer.accentColor}22, transparent 62%);">
      <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.75;">${preheader}</div>
      <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#fff;">${heading}</h1>
    </div>
    <div style="padding:24px 26px;font-size:15px;line-height:1.7;color:#d9e6ff;">${body}</div>
    ${showCta ? `<div style="padding:0 26px 22px;"><a href="${ctaUrl}" style="display:inline-block;background:${designer.accentColor};color:#021318;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;">${ctaText}</a></div>` : ''}
    <div style="padding:16px 26px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;line-height:1.6;color:#b9c8ec;">${footer}</div>
  </div>
</div>`;
}

function textFromDesigner(designer) {
  return `${designer.heading}\n\n${designer.body}\n\n${designer.ctaText && designer.ctaUrl ? `${designer.ctaText}: ${designer.ctaUrl}\n\n` : ''}${designer.footer}`;
}

export default function EmailStudio({ apiBase, site }) {
  const [smtp, setSmtp] = useState(null);
  const [smtpForm, setSmtpForm] = useState({
    server: '',
    port: 465,
    user: '',
    password: '',
    from_name: '',
    from_email: '',
    use_ssl: true,
    use_tls: false
  });
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [recipientMode, setRecipientMode] = useState('selected_site_emails');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [singleEmail, setSingleEmail] = useState('');
  const [manualEmails, setManualEmails] = useState('');
  const [designer, setDesigner] = useState({
    ...TEMPLATE_PRESETS.announcement,
    accentColor: '#6ff7ff',
    canvasBg: '#070c18',
    cardBg: '#0f1730'
  });
  const [subject, setSubject] = useState(TEMPLATE_PRESETS.announcement.subject);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const generatedHtml = useMemo(() => htmlFromDesigner(designer), [designer]);
  const generatedText = useMemo(() => textFromDesigner(designer), [designer]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [smtpRes, contactsRes] = await Promise.all([
        axios.get(`${apiBase}/api/config/smtp`),
        axios.get(`${apiBase}/api/sites/${site.id}/contacts`)
      ]);
      const smtpData = smtpRes.data?.smtp || {};
      setSmtp(smtpData);
      setSmtpForm((prev) => ({
        ...prev,
        server: smtpData.server || '',
        port: smtpData.port || 465,
        user: smtpData.user || '',
        password: '',
        from_name: smtpData.from_name || '',
        from_email: smtpData.from_email || '',
        use_ssl: smtpData.use_ssl ?? true,
        use_tls: smtpData.use_tls ?? false
      }));
      const loadedContacts = contactsRes.data?.contacts || [];
      setContacts(loadedContacts);
      setSelectedEmails(loadedContacts.slice(0, Math.min(2, loadedContacts.length)));
      setSingleEmail(loadedContacts[0] || '');
    } catch (e) {
      setStatus({ type: 'error', message: e?.response?.data?.detail || 'Failed to load email settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [apiBase, site.id]);

  const applyTemplate = (name) => {
    const preset = TEMPLATE_PRESETS[name];
    if (!preset) return;
    setDesigner((prev) => ({ ...prev, ...preset }));
    setSubject(preset.subject);
  };

  const saveSmtp = async () => {
    try {
      const res = await axios.post(`${apiBase}/api/config/smtp`, smtpForm);
      setSmtp(res.data?.smtp || null);
      setSmtpForm((prev) => ({ ...prev, password: '' }));
      setStatus({ type: 'success', message: 'SMTP settings saved.' });
    } catch (e) {
      setStatus({ type: 'error', message: e?.response?.data?.detail || 'Failed to save SMTP settings.' });
    }
  };

  const addContact = async () => {
    if (!newContact.trim()) return;
    try {
      const res = await axios.post(`${apiBase}/api/sites/${site.id}/contacts`, { email: newContact.trim() });
      setContacts(res.data?.contacts || []);
      setNewContact('');
      setStatus({ type: 'success', message: 'Site contact added.' });
    } catch (e) {
      setStatus({ type: 'error', message: e?.response?.data?.detail || 'Failed to add site contact.' });
    }
  };

  const removeContact = async (email) => {
    try {
      const res = await axios.delete(`${apiBase}/api/sites/${site.id}/contacts`, { params: { email } });
      const nextContacts = res.data?.contacts || [];
      setContacts(nextContacts);
      setSelectedEmails((prev) => prev.filter((item) => item !== email));
      if (singleEmail === email) setSingleEmail(nextContacts[0] || '');
      setStatus({ type: 'success', message: 'Site contact removed.' });
    } catch (e) {
      setStatus({ type: 'error', message: e?.response?.data?.detail || 'Failed to remove site contact.' });
    }
  };

  const sendDesignedEmail = async () => {
    const payload = {
      site_id: site.id,
      recipient_mode: recipientMode,
      single_email: singleEmail,
      selected_emails: selectedEmails,
      manual_emails: manualEmails,
      subject,
      html_body: generatedHtml,
      text_body: generatedText
    };

    try {
      const res = await axios.post(`${apiBase}/api/email/send`, payload);
      setStatus({ type: 'success', message: `Email sent to ${res.data.recipient_count} recipient(s).` });
    } catch (e) {
      setStatus({ type: 'error', message: e?.response?.data?.detail || 'Failed to send email.' });
    }
  };

  return (
    <Stack spacing={2}>
      {status.message && <Alert severity={status.type === 'success' ? 'success' : 'error'}>{status.message}</Alert>}

      <Card>
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">SMTP Settings</Typography>
            <Button size="small" startIcon={<RefreshIcon />} onClick={loadData} disabled={loading}>
              Reload
            </Button>
          </Stack>
          <Grid container spacing={1.25}>
            <Grid item xs={12} md={5}>
              <TextField
                label="SMTP Server"
                value={smtpForm.server}
                onChange={(event) => setSmtpForm({ ...smtpForm, server: event.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Port"
                type="number"
                value={smtpForm.port}
                onChange={(event) => setSmtpForm({ ...smtpForm, port: Number(event.target.value || 0) })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                label="SMTP Username"
                value={smtpForm.user}
                onChange={(event) => setSmtpForm({ ...smtpForm, user: event.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="From Name"
                value={smtpForm.from_name}
                onChange={(event) => setSmtpForm({ ...smtpForm, from_name: event.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="From Email"
                value={smtpForm.from_email}
                onChange={(event) => setSmtpForm({ ...smtpForm, from_email: event.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={smtp?.has_password ? 'SMTP Password (leave blank to keep)' : 'SMTP Password'}
                type="password"
                value={smtpForm.password}
                onChange={(event) => setSmtpForm({ ...smtpForm, password: event.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={1.5}>
                <FormControlLabel
                  control={<Switch checked={smtpForm.use_ssl} onChange={(event) => setSmtpForm({ ...smtpForm, use_ssl: event.target.checked })} />}
                  label="Use SSL"
                />
                <FormControlLabel
                  control={<Switch checked={smtpForm.use_tls} onChange={(event) => setSmtpForm({ ...smtpForm, use_tls: event.target.checked })} />}
                  label="Use TLS"
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth variant="contained" onClick={saveSmtp} startIcon={<SaveIcon />}>
                Save SMTP
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Site Contact Emails</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.25 }}>
            <TextField
              label="Add email for this site"
              value={newContact}
              onChange={(event) => setNewContact(event.target.value)}
              fullWidth
              size="small"
            />
            <Button variant="outlined" onClick={addContact}>Add</Button>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {contacts.length === 0 && <Typography variant="body2" color="text.secondary">No emails added yet.</Typography>}
            {contacts.map((email) => (
              <Chip
                key={email}
                label={email}
                onDelete={() => removeContact(email)}
                deleteIcon={<DeleteIcon />}
                sx={{ maxWidth: '100%' }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Email Designer</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Choose recipients and design the email visually before sending.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.2}>
                <TextField
                  select
                  label="Recipient Targeting"
                  value={recipientMode}
                  onChange={(event) => setRecipientMode(event.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="all_site_emails">All emails from site</MenuItem>
                  <MenuItem value="single_site_email">One email from site</MenuItem>
                  <MenuItem value="selected_site_emails">Selected emails from site</MenuItem>
                  <MenuItem value="manual_email">Manual entered email(s)</MenuItem>
                </TextField>

                {recipientMode === 'single_site_email' && (
                  <TextField
                    select
                    label="Site Email"
                    value={singleEmail}
                    onChange={(event) => setSingleEmail(event.target.value)}
                    size="small"
                    fullWidth
                  >
                    {contacts.map((email) => (
                      <MenuItem key={email} value={email}>{email}</MenuItem>
                    ))}
                  </TextField>
                )}

                {recipientMode === 'selected_site_emails' && (
                  <Box sx={{ border: '1px solid rgba(130,160,255,0.25)', borderRadius: 1, p: 1, maxHeight: 170, overflowY: 'auto' }}>
                    {contacts.map((email) => (
                      <FormControlLabel
                        key={email}
                        control={
                          <Checkbox
                            checked={selectedEmails.includes(email)}
                            onChange={(event) => {
                              setSelectedEmails((prev) =>
                                event.target.checked ? [...prev, email] : prev.filter((item) => item !== email)
                              );
                            }}
                          />
                        }
                        label={email}
                      />
                    ))}
                    {contacts.length === 0 && <Typography variant="caption">No site emails available.</Typography>}
                  </Box>
                )}

                {recipientMode === 'manual_email' && (
                  <TextField
                    label="Manual Emails"
                    placeholder="name@company.com, another@company.com"
                    value={manualEmails}
                    onChange={(event) => setManualEmails(event.target.value)}
                    multiline
                    minRows={2}
                    size="small"
                    fullWidth
                  />
                )}

                <Divider />

                <TextField
                  select
                  label="Template"
                  value={Object.keys(TEMPLATE_PRESETS).find((key) => TEMPLATE_PRESETS[key].heading === designer.heading) || 'announcement'}
                  onChange={(event) => applyTemplate(event.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="announcement">Announcement</MenuItem>
                  <MenuItem value="launch">Launch</MenuItem>
                  <MenuItem value="promo">Promotion</MenuItem>
                </TextField>

                <TextField label="Email Subject" value={subject} onChange={(event) => setSubject(event.target.value)} size="small" fullWidth />
                <TextField label="Heading" value={designer.heading} onChange={(event) => setDesigner({ ...designer, heading: event.target.value })} size="small" fullWidth />
                <TextField label="Preheader" value={designer.preheader} onChange={(event) => setDesigner({ ...designer, preheader: event.target.value })} size="small" fullWidth />
                <TextField
                  label="Body"
                  value={designer.body}
                  onChange={(event) => setDesigner({ ...designer, body: event.target.value })}
                  multiline
                  minRows={5}
                  size="small"
                  fullWidth
                />
                <Grid container spacing={1}>
                  <Grid item xs={6}><TextField label="CTA Text" value={designer.ctaText} onChange={(event) => setDesigner({ ...designer, ctaText: event.target.value })} size="small" fullWidth /></Grid>
                  <Grid item xs={6}><TextField label="CTA URL" value={designer.ctaUrl} onChange={(event) => setDesigner({ ...designer, ctaUrl: event.target.value })} size="small" fullWidth /></Grid>
                  <Grid item xs={12}><TextField label="Footer" value={designer.footer} onChange={(event) => setDesigner({ ...designer, footer: event.target.value })} multiline minRows={2} size="small" fullWidth /></Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={4}><TextField label="Accent" type="color" value={designer.accentColor} onChange={(event) => setDesigner({ ...designer, accentColor: event.target.value })} size="small" fullWidth /></Grid>
                  <Grid item xs={4}><TextField label="Canvas" type="color" value={designer.canvasBg} onChange={(event) => setDesigner({ ...designer, canvasBg: event.target.value })} size="small" fullWidth /></Grid>
                  <Grid item xs={4}><TextField label="Card" type="color" value={designer.cardBg} onChange={(event) => setDesigner({ ...designer, cardBg: event.target.value })} size="small" fullWidth /></Grid>
                </Grid>

                <Button variant="contained" startIcon={<SendIcon />} onClick={sendDesignedEmail}>
                  Send Designed Email
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%', minHeight: 500, overflow: 'hidden' }}>
                <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2">Live Preview</Typography>
                </Box>
                <Box sx={{ maxHeight: 560, overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: generatedHtml }} />
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
