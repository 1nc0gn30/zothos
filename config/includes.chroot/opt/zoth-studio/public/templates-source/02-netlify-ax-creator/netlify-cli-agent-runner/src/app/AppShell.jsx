import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded'
import CameraEnhanceRoundedIcon from '@mui/icons-material/CameraEnhanceRounded'
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SettingsEthernetRoundedIcon from '@mui/icons-material/SettingsEthernetRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useMemo, useState } from 'react'
import PortalSwitcher from '../components/PortalSwitcher'
import ClientLayout from '../components/ClientLayout'
import DeveloperLayout from '../components/DeveloperLayout'
import { usePortal } from './PortalContext'
import {
  agentDirectory,
  clientActivity,
  clientProfile as profileDefaults,
  clientProjects,
  clientWebsites,
  domainSuggestions,
  guidedActions,
  gigBoardListings,
  projectTemplates,
} from '../data/mockClientData'
import { developerProjects, guardrails, requestQueue } from '../data/mockDeveloperData'
import ClientProfilePage from '../components/ClientProfilePage'
import ClientTemplateLibrary from '../components/ClientTemplateLibrary'
import DeveloperLookupPage from '../components/DeveloperLookupPage'
import GuidedActions from '../components/GuidedActions'
import ActivityFeed from '../components/ActivityFeed'
import ActionDrawer from '../components/drawers/ActionDrawer'
import ClientWebsites from '../components/ClientWebsites'
import DomainPortfolio from '../components/DomainPortfolio'
import MediaPortfolio from '../components/MediaPortfolio'
import NotesWorkbench from '../components/NotesWorkbench'
import ClientGigsBoard from '../components/ClientGigsBoard'

function AppShell() {
  const { portalMode, setPortalMode } = usePortal()
  const [flowGuarded, setFlowGuarded] = useState(true)
  const [profile, setProfile] = useState(profileDefaults)
  const [activity, setActivity] = useState(clientActivity)
  const [selectedAction, setSelectedAction] = useState(null)
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false)
  const [clientView, setClientView] = useState('home')

  const accent = useMemo(
    () =>
      portalMode === 'developer'
        ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.08), rgba(63, 81, 181, 0.04))'
        : 'linear-gradient(135deg, rgba(56, 142, 60, 0.08), rgba(129, 199, 132, 0.05))',
    [portalMode]
  )

  const handleSwitch = (mode) => {
    if (!mode || mode === portalMode) return
    setPortalMode(mode)
  }

  const handleActionLog = (action) => {
    setActivity((prev) => [
      {
        id: `log-${Date.now()}`,
        actor: 'Agent Runner',
        action,
        status: 'Stable',
        timestamp: 'Just now',
        detail: `${profile.businessName} preferences applied automatically`,
      },
      ...prev,
    ])
  }

  const handleQuickAction = (action) => {
    setSelectedAction(action)
    setActionDrawerOpen(true)
  }

  const handleQuickConfirm = (mode) => {
    setActionDrawerOpen(false)
    handleActionLog(`${mode === 'dry' ? 'Dry run —' : 'Started —'} ${selectedAction?.title}`)
  }

  const handleQuickRoute = () => {
    setActionDrawerOpen(false)
    handleActionLog(`Routed — ${selectedAction?.title}`)
  }

  const renderClientContent = () => {
    const clientApps = [
      {
        id: 'lookup',
        title: 'Developer / AI desk',
        description: 'Fast routing to human or AI help with availability signals.',
        icon: <PersonSearchRoundedIcon />,
        accent: 'linear-gradient(135deg, rgba(49,196,141,0.18), rgba(49,196,141,0.04))',
      },
      {
        id: 'gigs',
        title: 'Post website work',
        description: 'Share scoped Netlify projects for trusted developers.',
        icon: <WorkHistoryRoundedIcon />,
        accent: 'linear-gradient(135deg, rgba(103,58,183,0.12), rgba(49,196,141,0.04))',
      },
      {
        id: 'domains',
        title: 'Domain portfolio',
        description: 'DNS, SSL, and routing protections across every environment.',
        icon: <LanguageRoundedIcon />,
        accent: 'linear-gradient(135deg, rgba(33,150,243,0.16), rgba(33,150,243,0.05))',
      },
      {
        id: 'media',
        title: 'Media portfolio',
        description: 'Auto-collected hero shots and previews from live URLs.',
        icon: <CameraEnhanceRoundedIcon />,
        accent: 'linear-gradient(135deg, rgba(156,39,176,0.16), rgba(156,39,176,0.05))',
      },
      {
        id: 'notes',
        title: 'Notes & guidance',
        description: 'Give the agent context, tone, and guardrails to respect.',
        icon: <NoteAltRoundedIcon />,
        accent: 'linear-gradient(135deg, rgba(5,10,18,0.12), rgba(49,196,141,0.05))',
      },
    ]

    if (clientView === 'websites') {
      return <ClientWebsites websites={clientWebsites} onBack={() => setClientView('home')} />
    }

    if (clientView === 'templates') {
      return <ClientTemplateLibrary templates={projectTemplates} onBack={() => setClientView('home')} />
    }

    if (clientView === 'profile') {
      return (
        <ClientProfilePage
          profile={profile}
          onUpdate={(next) => {
            setProfile(next)
            handleActionLog('Profile preferences updated')
          }}
          onBack={() => setClientView('home')}
        />
      )
    }

    if (clientView === 'lookup') {
      return <DeveloperLookupPage agents={agentDirectory} onBack={() => setClientView('home')} />
    }

    if (clientView === 'domains') {
      return (
        <DomainPortfolio
          websites={clientWebsites}
          suggestions={domainSuggestions}
          onBack={() => setClientView('home')}
        />
      )
    }

    if (clientView === 'media') {
      return <MediaPortfolio websites={clientWebsites} onBack={() => setClientView('home')} />
    }

    if (clientView === 'notes') {
      return <NotesWorkbench onBack={() => setClientView('home')} />
    }

    if (clientView === 'gigs') {
      return <ClientGigsBoard listings={gigBoardListings} onBack={() => setClientView('home')} />
    }

    return (
      <ClientLayout subtitle="Guided actions with reversible changes">
        <Stack spacing={2.5} sx={{ animation: 'fadeIn 300ms ease' }}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Calm overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agents keep previews safe while you approve.
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip label="Preview ready" color="success" variant="outlined" />
                  <Chip label="Rollback on" color="primary" variant="outlined" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <LanguageRoundedIcon color="success" />
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      Websites
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open live sites, previews, and spin up a new experience in one place.
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Live + preview" size="small" variant="outlined" color="success" />
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => setClientView('websites')}
                    sx={{ borderRadius: 2 }}
                  >
                    Open websites
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(49,196,141,0.14), rgba(49,196,141,0.04))',
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.dark', color: 'common.white' }}>
                      <GridViewRoundedIcon />
                    </Avatar>
                    <Stack spacing={0.25}>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Project templates
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Curated starters tuned by the agent for your brand and tone.
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Agent-tuned" size="small" color="success" variant="outlined" />
                    <Chip label="Quick start" size="small" variant="outlined" />
                  </Stack>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => setClientView('templates')}
                    sx={{ borderRadius: 2, alignSelf: 'flex-start' }}
                  >
                    Browse templates
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(25,118,210,0.12), rgba(25,118,210,0.04))',
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      <PersonRoundedIcon />
                    </Avatar>
                    <Stack spacing={0.25}>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Client profile
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Edit brand voice, approvals, and alerts that guide every agent action.
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Tone & preferences" size="small" variant="outlined" color="primary" />
                    <Chip label="Ready to edit" size="small" variant="outlined" />
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => setClientView('profile')}
                    sx={{ borderRadius: 2, alignSelf: 'flex-start' }}
                  >
                    Edit profile
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Stack spacing={1.25}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack spacing={0.25}>
                <Typography variant="subtitle1" fontWeight={900}>
                  Workspace apps
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tap a card to open a dedicated space, just like launching an app on your phone.
                </Typography>
              </Stack>
              <Chip label="New" color="success" variant="outlined" />
            </Stack>
            <Grid container spacing={1.5} columns={{ xs: 1, md: 12 }}>
              {clientApps.map((app) => (
                <Grid key={app.id} size={{ xs: 12, md: 3 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      boxShadow: '0 12px 28px rgba(5,10,18,0.08)',
                      background: app.accent,
                      backdropFilter: 'blur(8px)',
                      transition: 'transform 180ms ease, box-shadow 180ms ease',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 16px 40px rgba(5,10,18,0.16)' },
                    }}
                  >
                    <CardActionArea onClick={() => setClientView(app.id)} sx={{ p: 2, height: '100%' }}>
                      <Stack spacing={1.25} alignItems="flex-start">
                        <Avatar
                          sx={{
                            bgcolor: 'common.white',
                            color: 'success.dark',
                            border: 1,
                            borderColor: 'divider',
                            boxShadow: 1,
                          }}
                        >
                          {app.icon}
                        </Avatar>
                        <Stack spacing={0.25}>
                          <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: 0 }}>
                            {app.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {app.description}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Chip label="Opens workspace" size="small" variant="outlined" />
                          <Chip label="Touch-friendly" size="small" color="success" variant="outlined" />
                        </Stack>
                      </Stack>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Card elevation={0} sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <BlurOnRoundedIcon color="success" />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Quick handoffs
                  </Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {guidedActions.slice(0, 3).map((action) => (
                    <Card
                      key={action.id}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        p: 1.5,
                        background: 'linear-gradient(120deg, rgba(129,199,132,0.08), rgba(255,255,255,0.9))',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleQuickAction(action)}
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.summary}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Chip label="Dry run" size="small" color="success" variant="outlined" />
                        <Chip label="Safe by default" size="small" variant="outlined" />
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ flex: 1, borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <SecurityRoundedIcon color="success" />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Guarded projects
                  </Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {clientProjects.slice(0, 3).map((project) => (
                    <Stack key={project.name} spacing={0.5} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.light', color: 'success.dark', fontWeight: 700 }}>
                          {project.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {project.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {project.guardrails}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip label={project.status} size="small" color="success" variant="outlined" />
                        <Chip label={`Last deployed ${project.lastDeployed}`} size="small" variant="outlined" />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <GuidedActions actions={guidedActions} onLog={handleActionLog} />

          <ActivityFeed activity={activity} />

          <ActionDrawer
            open={actionDrawerOpen}
            action={selectedAction}
            onClose={() => setActionDrawerOpen(false)}
            onConfirm={handleQuickConfirm}
            onRoute={handleQuickRoute}
          />
        </Stack>
      </ClientLayout>
    )
  }

  const developerContent = (
    <DeveloperLayout subtitle="Controls, guardrails, and live queues">
      <Stack spacing={2.5} sx={{ animation: 'fadeIn 300ms ease' }}>
        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={800}>
                  Deployment posture
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Switch contexts without losing queues.
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Guarded flows
                </Typography>
                <Switch checked={flowGuarded} onChange={(e) => setFlowGuarded(e.target.checked)} color="secondary" />
                <Chip label={flowGuarded ? 'Locks on' : 'Locks off'} size="small" color={flowGuarded ? 'secondary' : 'default'} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card elevation={0} sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <TuneRoundedIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={800}>
                  Guardrails
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {guardrails.slice(0, 4).map((rule) => (
                  <Stack
                    key={rule.id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.25, bgcolor: rule.active ? 'secondary.50' : 'background.paper' }}
                  >
                    <ToggleOffRoundedIcon color={rule.active ? 'secondary' : 'disabled'} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {rule.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rule.detail}
                      </Typography>
                    </Box>
                    <Chip label={rule.active ? 'Active' : 'Paused'} size="small" color={rule.active ? 'secondary' : 'default'} variant="outlined" />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <SettingsEthernetRoundedIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={800}>
                  Request queue
                </Typography>
              </Stack>
              <Stack spacing={1.25}>
                {requestQueue.map((item) => (
                  <Stack key={item.id} spacing={0.5} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.25 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.client}
                      </Typography>
                      <Chip label={item.risk} size="small" color={item.risk === 'Low' ? 'success' : 'warning'} variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {item.request}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.eta}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AutoGraphRoundedIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={800}>
                  Active projects
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label="Canary" size="small" variant="outlined" color="secondary" />
                <Chip label="Approvals" size="small" variant="outlined" color="secondary" />
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ mt: 2 }}>
              {developerProjects.map((project) => (
                <Card key={project.name} variant="outlined" sx={{ flex: 1, borderRadius: 2, p: 1.5 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.approval}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={project.status} size="small" color="secondary" variant="outlined" />
                      <Chip label={project.access} size="small" variant="outlined" />
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </DeveloperLayout>
  )

  return (
    <Box
      className="app-shell"
      sx={{
        minHeight: '100vh',
        backgroundImage: accent,
        transition: 'background-image 240ms ease',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          background: 'radial-gradient(circle at 20% 20%, rgba(49,196,141,0.28), transparent 28%), rgba(5,10,18,0.94)',
          boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
          color: 'common.white',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.25}
            py={1.25}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'inherit',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              >
                <SecurityRoundedIcon color={portalMode === 'developer' ? 'secondary' : 'success'} fontSize="small" />
              </IconButton>
              <Stack spacing={0.25}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Agent portals
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: 0 }}>
                  {portalMode === 'developer' ? 'Developer' : 'Client'} mode
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
              sx={{ width: '100%', flexWrap: 'wrap', rowGap: 0.75 }}
            >
              <Chip
                label="Realtime safe"
                size="small"
                sx={{
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.18)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
                variant="outlined"
              />
              <Chip
                label={portalMode === 'developer' ? 'Build posture' : 'Client workspace'}
                size="small"
                color={portalMode === 'developer' ? 'secondary' : 'success'}
                variant="outlined"
                sx={{ borderRadius: 2, display: { xs: 'none', sm: 'inline-flex' } }}
              />
              <PortalSwitcher value={portalMode} onChange={handleSwitch} />
              <Tooltip title="Profile">
                <Avatar
                  src="https://avatars.githubusercontent.com/u/7892489?v=4"
                  alt="Netlify"
                  sx={{
                    width: 34,
                    height: 34,
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  }}
                />
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {portalMode === 'client' && renderClientContent()}
        {portalMode === 'developer' && developerContent}
      </Container>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  )
}

export default AppShell
