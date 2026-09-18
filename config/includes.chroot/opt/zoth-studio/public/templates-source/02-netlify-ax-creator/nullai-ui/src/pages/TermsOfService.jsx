// src/pages/TermsOfService.jsx
import { Box, Container, Paper, Stack, Typography, Divider, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import BoltIcon from '@mui/icons-material/Bolt';
import StorageIcon from '@mui/icons-material/Storage';
import PaidIcon from '@mui/icons-material/Paid';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function TermsOfService() {
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
            radial-gradient(900px circle at 20% 0%, ${alpha(theme.palette.primary.main, 0.18)}, transparent 45%),
            radial-gradient(700px circle at 80% 20%, rgba(34,211,238,0.10), transparent 55%),
            linear-gradient(180deg, #05060A, #0B0E14)
          `
          : `
            radial-gradient(900px circle at 20% 0%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 45%),
            radial-gradient(700px circle at 80% 20%, rgba(34,211,238,0.10), transparent 55%),
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
              icon={<GavelIcon sx={{ color: 'primary.main' }} />}
              title="Terms of Service"
              badge="Effective: Jan 1, 2026"
            />

            <Typography color="text.secondary">
              These Terms govern your access to and use of NullAI (the website, API, and tooling). By using the
              service, you agree to these Terms.
            </Typography>

            <Callout
              icon={<WarningAmberIcon />}
              title="Operator-grade rules"
              body="NullAI includes security + automation capabilities. You agree to use them only on systems you own or have explicit permission to test."
            />

            <Divider sx={{ opacity: 0.25 }} />

            <Section title="1. Eligibility and accounts">
              <Bullets
                items={[
                  'You must be legally able to form a contract in your jurisdiction.',
                  'You are responsible for maintaining account security and credentials.',
                  'You agree to provide accurate information and keep it up to date.',
                ]}
              />
            </Section>

            <Section title="2. Acceptable use">
              <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                You agree not to misuse the service. Prohibited behavior includes:
              </Typography>
              <Bullets
                items={[
                  'Illegal activity, including unauthorized access attempts or exploitation.',
                  'Distributing malware, phishing content, or instructions for wrongdoing.',
                  'Harassment, hate, or abusive content.',
                  'Attempting to overload or disrupt infrastructure (DoS, abuse, scraping).',
                  'Bypassing safety, tiering, authentication, or rate limits.',
                ]}
              />
            </Section>

            <Section title="3. API usage, tiers, and rate limits">
              <Stack spacing={1}>
                <Bullets
                  items={[
                    'Usage limits apply by plan/tier and may change to protect reliability.',
                    'Abuse patterns (automation loops, scraping, flooding) may be throttled or blocked.',
                    'Some tools may require explicit user confirmation (example: SQLMap, Hydra).',
                  ]}
                />
                <InlinePills
                  items={[
                    { icon: <BoltIcon fontSize="small" />, label: 'Rate limited by tier' },
                    { icon: <SecurityIcon fontSize="small" />, label: 'Auth + abuse controls' },
                  ]}
                />
              </Stack>
            </Section>

            <Section title="4. AI outputs and responsibility">
              <Bullets
                items={[
                  'Outputs may be inaccurate or incomplete. You are responsible for verifying results.',
                  'You are responsible for how you use outputs, including compliance and safety.',
                  'NullAI does not provide legal, medical, or financial advice.',
                ]}
              />
            </Section>

            <Section title="5. Plans, billing, and refunds">
              <Stack spacing={1}>
                <Bullets
                  items={[
                    'Paid plans renew based on your billing cycle unless canceled.',
                    'Billing is processed by a third-party provider; we do not store full card details.',
                    'Refunds, if any, depend on billing provider policy and local consumer law.',
                  ]}
                />
                <InlinePills items={[{ icon: <PaidIcon fontSize="small" />, label: 'Third-party billing' }]} />
              </Stack>
            </Section>

            <Section title="6. Service availability">
              <Bullets
                items={[
                  'We may modify, suspend, or discontinue features to improve the product or protect reliability.',
                  'Planned maintenance may temporarily impact access.',
                  'We do not guarantee uninterrupted or error-free operation.',
                ]}
              />
            </Section>

            <Section title="7. Content and IP">
              <Stack spacing={1}>
                <Bullets
                  items={[
                    'You retain rights to your input content to the extent allowed by law.',
                    'We retain rights to the platform, software, and branding.',
                    'You grant us permission to process your content solely to operate the service.',
                  ]}
                />
                <InlinePills items={[{ icon: <StorageIcon fontSize="small" />, label: 'Local-first by design' }]} />
              </Stack>
            </Section>

            <Section title="8. Termination">
              <Bullets
                items={[
                  'You may stop using the service at any time.',
                  'We may suspend or terminate accounts for violations or risk to the platform.',
                  'Termination may include loss of access to stored history depending on settings.',
                ]}
              />
            </Section>

            <Section title="9. Disclaimers and limitation of liability">
              <Typography color="text.secondary">
                The service is provided “as is” and “as available”. To the maximum extent permitted by law, NullAI
                is not liable for indirect, incidental, special, consequential, or punitive damages.
              </Typography>
            </Section>

            <Section title="10. Contact">
              <Typography color="text.secondary">
                Questions: <strong>support@nullai.tech</strong>
              </Typography>
            </Section>

            <Divider sx={{ opacity: 0.25 }} />
            <Typography variant="caption" color="text.secondary">
              This document is provided for product policy convenience and may be updated over time.
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

function Callout({ icon, title, body }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.75,
        borderRadius: 2.5,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.28)}`,
        background: `linear-gradient(90deg, ${alpha(theme.palette.warning.main, 0.10)}, ${alpha(
          theme.palette.background.paper,
          0.0
        )})`,
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
            color: theme.palette.warning.main,
            background: alpha(theme.palette.warning.main, 0.12),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.22)}`,
            boxShadow: `0 0 24px ${alpha(theme.palette.warning.main, 0.10)}`,
          }}
        >
          {icon}
        </Box>
        <Stack spacing={0.25}>
          <Typography fontWeight={900}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
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

function InlinePills({ items }) {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {items.map((it) => (
        <Chip
          key={it.label}
          size="small"
          icon={it.icon}
          label={it.label}
          sx={{
            borderRadius: 999,
            fontWeight: 800,
            background: alpha(theme.palette.primary.main, 0.10),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
          }}
        />
      ))}
    </Stack>
  );
}
