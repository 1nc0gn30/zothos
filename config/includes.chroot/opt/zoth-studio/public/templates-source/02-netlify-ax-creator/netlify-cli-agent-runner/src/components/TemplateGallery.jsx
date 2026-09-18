import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import BrushRoundedIcon from '@mui/icons-material/BrushRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded'
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Drawer,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

function TemplateGallery({ templates }) {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState(0)
  const [advisorPrompt, setAdvisorPrompt] = useState('Seasonal landing with reservations + promos')
  const [advisorSuggestions, setAdvisorSuggestions] = useState(templates.slice(0, 2))

  const industries = useMemo(() => ['All', ...new Set(templates.map((tpl) => tpl.industry))], [templates])

  const filteredTemplates = useMemo(
    () => (filter === 'All' ? templates : templates.filter((tpl) => tpl.industry === filter)),
    [filter, templates]
  )

  const handleSelect = (tpl) => {
    setSelected(tpl)
    setStep(0)
    setOpen(true)
  }

  const handleAdvance = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1))
  }

  const handleAdvisorRecommend = () => {
    const prompt = advisorPrompt.toLowerCase()
    const matched = templates
      .filter((tpl) => tpl.description.toLowerCase().includes('preview') || prompt.includes('preview'))
      .filter((tpl) => tpl.industry.toLowerCase().includes('restaurant') || !prompt.includes('restaurant'))
      .slice(0, 3)

    setAdvisorSuggestions(matched.length ? matched : templates.slice(0, 3))
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CollectionsBookmarkRoundedIcon color="success" />
          <Typography variant="h6" fontWeight={800}>
            Project templates
          </Typography>
        </Stack>
        <Chip label="Ready to launch" size="small" variant="outlined" color="success" sx={{ borderRadius: 2 }} />
      </Stack>

      <Stack spacing={2} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <FilterAltRoundedIcon color="success" />
          {industries.map((item) => (
            <Chip
              key={item}
              label={item}
              clickable
              color={filter === item ? 'success' : 'default'}
              variant={filter === item ? 'filled' : 'outlined'}
              onClick={() => setFilter(item)}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            p: 2,
            background: 'linear-gradient(135deg, rgba(129,199,132,0.12), rgba(255,255,255,0.9))',
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                <SmartToyRoundedIcon color="success" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Template scout
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ask the bot to shortlist templates and the agent will pre-fill the drawer.
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<RocketLaunchRoundedIcon />}
                onClick={handleAdvisorRecommend}
                sx={{ borderRadius: 2, alignSelf: { xs: 'stretch', md: 'center' } }}
              >
                Refresh picks
              </Button>
            </Stack>

            <Stack spacing={1}>
              <TextField
                fullWidth
                size="small"
                label="Tell the bot what you need"
                value={advisorPrompt}
                onChange={(e) => setAdvisorPrompt(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BoltRoundedIcon color="success" />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Suggestions
                </Typography>
                {['Reservations', 'Promo landing', 'Gallery', 'Accessibility'].map((hint) => (
                  <Chip
                    key={hint}
                    label={hint}
                    size="small"
                    onClick={() => setAdvisorPrompt((prev) => `${prev} · ${hint}`)}
                    variant="outlined"
                    color="success"
                  />
                ))}
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                {advisorSuggestions.map((tpl) => (
                  <Card key={tpl.name} variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
                    <CardActionArea onClick={() => handleSelect(tpl)} sx={{ p: 1.5 }}>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <RocketLaunchRoundedIcon color="success" fontSize="small" />
                          <Typography variant="subtitle2" fontWeight={800}>
                            {tpl.name}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {tpl.description}
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                          <Chip label={tpl.industry} size="small" color="success" variant="outlined" />
                          <Chip label={`${tpl.pages} pages`} size="small" />
                        </Stack>
                      </Stack>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap">
        {filteredTemplates.map((tpl) => (
          <Card key={tpl.name} variant="outlined" sx={{ minWidth: { xs: '100%', md: 280 }, flex: 1, borderRadius: 2 }}>
            <CardActionArea onClick={() => handleSelect(tpl)} sx={{ p: 2, height: '100%' }}>
              <Stack spacing={1} alignItems="flex-start">
                <Chip label={tpl.industry} size="small" color="success" variant="outlined" />
                <Typography variant="subtitle1" fontWeight={800}>
                  {tpl.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tpl.description}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={`${tpl.pages} pages`} size="small" />
                  <Chip label={tpl.setup} size="small" variant="outlined" />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <BrushRoundedIcon fontSize="small" color="success" />
                  <Typography variant="caption">{tpl.highlight}</Typography>
                </Stack>
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 440 }, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 } }}>
        {selected && (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LaunchRoundedIcon color="success" />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Create {selected.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selected.industry} template
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Included pages
              </Typography>
              <Stack spacing={0.5}>
                {selected.pagesIncluded.map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center">
                    <CategoryRoundedIcon fontSize="small" color="success" />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Suggested features
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selected.features.map((feature) => (
                  <Chip key={feature} label={feature} size="small" color="success" variant="outlined" sx={{ borderRadius: 2 }} />
                ))}
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Brand & safety options
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {['Reservations CTA', 'Keep menu tone friendly', 'No live deploys', 'Accessibility check'].map((item) => (
                  <Chip key={item} icon={<ChecklistRoundedIcon />} label={item} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {['Green palette', 'Minimal layout', 'Bold type'].map((style) => (
                  <Chip key={style} icon={<PaletteRoundedIcon />} label={style} size="small" />
                ))}
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Guided steps
              </Typography>
              <LinearProgress variant="determinate" value={(step + 1) * 33} color="success" sx={{ borderRadius: 2 }} />
              <Stack spacing={1}>
                {selected.actions.map((action, index) => (
                  <Card key={action} variant={step >= index ? 'outlined' : 'elevation'} sx={{ borderRadius: 2, p: 1.25 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step > index ? 'Ready' : 'Agent will handle this step for you.'}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Stack>

            <Button variant="contained" color="success" onClick={handleAdvance} startIcon={<LaunchRoundedIcon />}>
              {step >= 2 ? 'Create project' : 'Next guided step'}
            </Button>

            <Button onClick={() => setOpen(false)} sx={{ mt: 'auto' }} color="inherit">
              Close
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}

export default TemplateGallery
