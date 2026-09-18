import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeMosaicRoundedIcon from '@mui/icons-material/AutoAwesomeMosaicRounded'
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded'
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import ClientLayout from './ClientLayout'

const fallbacks = [
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544145945-f90425340c7b?auto=format&fit=crop&w=800&q=80',
]

function MediaPortfolio({ websites = [], onBack }) {
  const mediaAssets = websites.map((site, index) => ({
    id: site.domain,
    title: `${site.name} hero`,
    url: `https://${site.domain}`,
    preview: fallbacks[index % fallbacks.length],
    tag: site.environment,
  }))

  return (
    <ClientLayout
      title="Media portfolio"
      subtitle="AI collects hero shots, social previews, and on-page media straight from your deployed sites."
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
              Back to portal
            </Button>
            <Chip label="Auto-collected" color="success" variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip label="Alt text ready" size="small" variant="outlined" />
            <Chip label="Safe for previews" size="small" color="success" variant="outlined" />
          </Stack>
        </Stack>

        <Card elevation={0} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, rgba(25,118,210,0.12), rgba(25,118,210,0.04))' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <AutoAwesomeMosaicRoundedIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Modern asset shelf
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pulls images from live and preview URLs, dedupes them, and keeps them ready for campaigns.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip icon={<RocketLaunchRoundedIcon />} label="Launch-ready" variant="outlined" />
                <Chip icon={<AutoFixHighRoundedIcon />} label="AI polish" color="secondary" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={1.5} columns={{ xs: 1, md: 12 }}>
          {mediaAssets.map((asset) => (
            <Grid key={asset.id} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                <Box
                  sx={{
                    height: 160,
                    backgroundImage: `linear-gradient(120deg, rgba(5,10,18,0.4), rgba(5,10,18,0.05)), url(${asset.preview})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Stack spacing={0.25}>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {asset.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {asset.url}
                      </Typography>
                    </Stack>
                    <Chip label={asset.tag} size="small" variant="outlined" />
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary">
                      <CloudDownloadRoundedIcon />
                    </IconButton>
                    <IconButton size="small" color="inherit">
                      <LinkRoundedIcon />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <ImageRoundedIcon />
                    </IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Pulled automatically from the deployed URL, cleaned up, and ready for reuse.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </ClientLayout>
  )
}

export default MediaPortfolio
