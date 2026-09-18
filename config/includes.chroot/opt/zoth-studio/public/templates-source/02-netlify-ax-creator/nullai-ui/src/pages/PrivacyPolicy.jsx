// src/pages/PrivacyPolicy.jsx
import { Box, Container, Paper, Stack, Typography, Divider, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import PolicyIcon from '@mui/icons-material/Policy';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';

export default function PrivacyPolicy() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const surface = alpha(theme.palette.background.paper, isDark ? 0.86 : 0.94);
  const border = `1px solid ${alpha(theme.palette.divider, isDark ? 0.55 : 0.7)}`;

  return (
    <Box
      component="main"
      sx={{
        pt: { xs: 12, md: 14 },
        pb: { xs: 8, md: 10 },
        minHeight: '100dvh',
        background: isDark
          ? `
            radial-gradient(900px circle at 20% 0%, rgba(91,140,255,0.16), transparent 45%),
            radial-gradient(700px circle at 80% 18%, rgba(34,211,238,0.10), transparent 55%),
            linear-gradient(180deg, #05060A, #0B0E14)
          `
          : `
            radial-gradient(900px circle at 20% 0%, rgba(91,140,255,0.14), transparent 45%),
            radial-gradient(700px circle at 80% 18%, rgba(34,211,238,0.10), transparent 55%),
            linear-gradient(180deg, #FFFFFF, #F4F7FB)
          `,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.25, md: 3.75 },
            borderRadius: 3,
            background: surface,
            border,
            boxShadow: isDark
              ? '0 40px 120px rgba(0,0,0,0.75)'
              : '0 24px 60px rgba(15,23,42,0.14)',
            backdropFilter: 'blur(18px)',
            overflow: 'hidden',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              pointerEvents: 'none',
              background: isDark
                ? `radial-gradient(600px circle at 25% 0%, ${alpha(theme.palette.primary.main, 0.18)}, transparent 55%)`
                : `radial-gradient(600px circle at 25% 0%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 55%)`,
              filter: 'blur(10px)',
              opacity: 0.9,
            },
          }}
        >
          <Stack spacing={2.25} sx={{ position: 'relative', zIndex: 1 }}>
            <Header
              icon={<PolicyIcon sx={{ color: 'primary.main' }} />}
              title="Privacy Policy"
              badge="Effective: Jan 1, 2026"
            />

            <Typography color="text.secondary">
              This policy explains what NullAI collects, why, and how you control it. NullAI is designed to be
              privacy-forward and operator-safe: minimal collection, strong boundaries, and sensible defaults.
            </Typography>

            <Highlights />

            <Divider sx={{ opacity: 0.25 }} />

            <Section title="1. What we collect">
              <Bullets
                items={[
                  'Account data: email, auth identifiers, and tier status (if you create an account).',
                  'Operational metadata: request timing, error logs, abuse signals, and rate-limit counters to keep the service stable.',
                  'Billing metadata (paid plans): handled by the billing provider; we receive status + receipt identifiers, not full card details.',
                  'User content (prompts/inputs): processed to respond to you. Retention depends on product settings and features you enable.',
                ]}
              />
            </Section>

            <Section title="2. What we do NOT do">
              <Bullets
                items={[
                  'We do not sell your personal data.',
                  'We do not run third-party ad trackers on core app surfaces.',
                  'We do not intentionally collect sensitive categories (health, biometrics, etc.) unless you provide them.',
                ]}
              />
            </Section>

            <Section title="3. How prompts and outputs are handled">
              <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                NullAI generates responses using models running on our infrastructure (local-first inference). Depending on
                your settings, we may store certain artifacts to support continuity.
              </Typography>
              <Bullets
                items={[
                  'Local storage: chat/session data may be stored in your browser (device-based) if enabled.',
                  'Server-side storage: may be used for features like multi-device sessions, retrieval, and history (if enabled).',
                  'Security tooling: some features are gated behind tiers, rate limits, and explicit user actions.',
                ]}
              />
            </Section>

            <Section title="4. Authentication and security">
              <Bullets
                items={[
                  'We use TLS encryption in transit.',
                  'We validate Supabase JWTs for authenticated requests and enforce tier boundaries.',
                  'Access to operational systems is restricted and monitored.',
                  'We apply least-privilege practices and secret isolation (systemd EnvironmentFile / server-side env).',
                ]}
              />
            </Section>

            <Section title="5. Data retention">
              <Bullets
                items={[
                  'Operational logs are retained for a limited period for reliability and security, then rotated.',
                  'You can clear local chat/session history using in-app controls (where available).',
                  'If server-side storage is enabled, retention may vary by tier and configuration.',
                ]}
              />
            </Section>

            <Section title="6. Third parties">
              <Typography color="text.secondary">
                If you subscribe, payments are processed by a third-party billing provider. If you connect integrations,
                those services receive only the data you authorize.
              </Typography>
            </Section>

            <Section title="7. Your choices and rights">
              <Bullets
                items={[
                  'Access / deletion: you can request access to or deletion of account data where applicable.',
                  'Opt-out: disable non-essential telemetry (where offered).',
                  'Local controls: clear stored chat history, exported transcripts, or cached session artifacts.',
                ]}
              />
            </Section>

            <Section title="8. Contact">
              <Typography color="text.secondary">
                Questions or requests: <strong>privacy@nullai.tech</strong>
              </Typography>
            </Section>

            <Divider sx={{ opacity: 0.25 }} />
            <Typography variant="caption" color="text.secondary">
              This is provided for product policy convenience and may be updated over time.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

function Header({ icon, title, badge }) {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      {icon}
      <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em">
        {title}
      </Typography>
      <Box sx={{ flex: 1 }} />
      <Chip
        size="small"
        label={badge}
        sx={{
          background: alpha(theme.palette.primary.main, 0.12),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
          fontWeight: 800,
        }}
      />
    </Stack>
  );
}

function Highlights() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const items = [
    {
      icon: <VisibilityOffIcon fontSize="small" />,
      title: 'No ad tracking',
      body: 'Core app surfaces avoid third-party ad trackers by default.',
    },
    {
      icon: <StorageIcon fontSize="small" />,
      title: 'Local-first bias',
      body: 'Prefer device-based storage where possible; server storage is feature-based.',
    },
    {
      icon: <LockIcon fontSize="small" />,
      title: 'JWT auth',
      body: 'Supabase JWT validation + tier enforcement on protected routes.',
    },
    {
      icon: <CreditCardIcon fontSize="small" />,
      title: 'Billing separation',
      body: 'Billing is handled by a processor; we don’t store full card details.',
    },
    {
      icon: <SecurityIcon fontSize="small" />,
      title: 'Abuse controls',
      body: 'Rate limits + gating protect stability and reduce malicious automation.',
    },
  ];

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.25}
      useFlexGap
      flexWrap="wrap"
      sx={{ mt: 0.5 }}
    >
      {items.map((it) => (
        <Paper
          key={it.title}
          elevation={0}
          sx={{
            flex: '1 1 240px',
            p: 1.5,
            borderRadius: 2.5,
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.55 : 0.7)}`,
            background: alpha(theme.palette.background.paper, isDark ? 0.72 : 0.92),
            backdropFilter: 'blur(14px)',
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.main',
                background: alpha(theme.palette.primary.main, 0.12),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
                boxShadow: `0 0 26px ${alpha(theme.palette.primary.main, 0.10)}`,
                flex: '0 0 auto',
              }}
            >
              {it.icon}
            </Box>
            <Stack spacing={0.25}>
              <Typography fontWeight={900} sx={{ lineHeight: 1.1 }}>
                {it.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {it.body}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

function Section({ title, children }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6" fontWeight={900} letterSpacing="-0.01em">
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

function Bullets({ items }) {
  const theme = useTheme();
  return (
    <Stack spacing={0.75} sx={{ pl: 0.5 }}>
      {items.map((t) => (
        <Stack key={t} direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{
              mt: '8px',
              width: 6,
              height: 6,
              borderRadius: 999,
              background: alpha(theme.palette.primary.main, 0.9),
              boxShadow: `0 0 14px ${alpha(theme.palette.primary.main, 0.35)}`,
              flex: '0 0 auto',
            }}
          />
          <Typography color="text.secondary">{t}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
