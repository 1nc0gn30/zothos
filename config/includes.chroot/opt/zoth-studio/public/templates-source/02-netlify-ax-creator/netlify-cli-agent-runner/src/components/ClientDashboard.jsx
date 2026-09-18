import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import ActivityFeed from './ActivityFeed'
import AgentLookup from './AgentLookup'
import ClientFeatureDrawer from './ClientFeatureDrawer'
import ClientFeatureTile from './ClientFeatureTile'
import ClientLayout from './ClientLayout'
import ClientProfileCard from './ClientProfileCard'
import GuidedActions from './GuidedActions'
import TemplateGallery from './TemplateGallery'
import {
  agentDirectory,
  clientActivity,
  clientProfile,
  clientProjects,
  guidedActions,
  projectTemplates,
} from '../data/mockClientData'

function ClientDashboard() {
  const [activeFeature, setActiveFeature] = useState(null)
  const [profile, setProfile] = useState(clientProfile)
  const [activity, setActivity] = useState(clientActivity)

  const features = useMemo(
    () => [
      {
        id: 'profile',
        title: 'Profile',
        hint: 'Brand voice & alerts',
        icon: (
          <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
            <PersonRoundedIcon />
          </Avatar>
        ),
      },
      {
        id: 'projects',
        title: 'Projects',
        hint: 'Guarded sites',
        icon: (
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
            <LayersRoundedIcon />
          </Avatar>
        ),
      },
      {
        id: 'actions',
        title: 'Guided Actions',
        hint: 'Safe changes',
        icon: (
          <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
            <BoltRoundedIcon />
          </Avatar>
        ),
      },
      {
        id: 'templates',
        title: 'Templates',
        hint: 'Start fast',
        icon: (
          <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
            <GridViewRoundedIcon />
          </Avatar>
        ),
      },
      {
        id: 'activity',
        title: 'Activity',
        hint: 'Live feed',
        icon: (
          <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
            <TimelineRoundedIcon />
          </Avatar>
        ),
      },
      {
        id: 'developer',
        title: 'Find a Developer',
        hint: 'Human help',
        icon: (
          <Avatar sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>
            <EngineeringRoundedIcon />
          </Avatar>
        ),
      },
      {
        id: 'agent',
        title: 'AI Agent Help',
        hint: 'Instant assist',
        icon: (
          <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
            <SmartToyRoundedIcon />
          </Avatar>
        ),
      },
    ],
    []
  )

  const handleLog = (entry) => {
    setActivity((prev) => [
      {
        id: `log-${Date.now()}`,
        actor: 'Agent Runner',
        action: entry,
        status: 'Queued',
        timestamp: 'Just now',
        detail: 'Captured from dashboard',
      },
      ...prev,
    ])
  }

  const handleClose = () => setActiveFeature(null)

  const renderFeatureContent = () => {
    if (!activeFeature) return null

    switch (activeFeature.id) {
      case 'profile':
        return (
          <ClientProfileCard
            profile={profile}
            onUpdate={(next) => {
              setProfile(next)
              handleLog('Profile preferences updated')
            }}
          />
        )
      case 'projects':
        return (
          <Stack spacing={1.5}>
            {clientProjects.map((project) => (
              <Stack
                key={project.name}
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'rgba(49, 196, 141, 0.04)',
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  {project.name.charAt(0)}
                </Avatar>
                <Stack spacing={0.25} sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={800}>
                      {project.name}
                    </Typography>
                    <Stack direction="row" spacing={0.75}>
                      <Typography variant="caption" color="text.secondary">
                        {project.lastDeployed}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {project.guardrails}
                  </Typography>
                  <Stack direction="row" spacing={0.75}>
                    <Avatar
                      variant="rounded"
                      sx={{ bgcolor: 'success.light', color: 'success.main', width: 28, height: 24, fontSize: 12 }}
                    >
                      ●
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {project.status}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )
      case 'actions':
        return <GuidedActions actions={guidedActions} onLog={handleLog} />
      case 'templates':
        return <TemplateGallery templates={projectTemplates} />
      case 'activity':
        return <ActivityFeed activity={activity} />
      case 'developer':
        return <AgentLookup agents={agentDirectory} />
      case 'agent':
        return <AgentLookup agents={agentDirectory.filter((agent) => agent.type === 'AI Agent')} />
      default:
        return null
    }
  }

  return (
    <ClientLayout subtitle="Tap any tile to open a tool. Everything stays in-drawer.">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 2,
        }}
      >
        {features.map((feature) => (
          <ClientFeatureTile key={feature.id} icon={feature.icon} title={feature.title} hint={feature.hint} onOpen={() => setActiveFeature(feature)} />
        ))}
      </Box>

      <ClientFeatureDrawer
        open={Boolean(activeFeature)}
        onClose={handleClose}
        title={activeFeature?.title}
        subtitle={activeFeature?.hint}
        icon={activeFeature?.icon}
      >
        {renderFeatureContent()}
      </ClientFeatureDrawer>
    </ClientLayout>
  )
}

export default ClientDashboard
