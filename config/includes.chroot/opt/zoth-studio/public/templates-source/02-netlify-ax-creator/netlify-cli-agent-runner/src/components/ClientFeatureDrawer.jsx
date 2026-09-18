import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material'

function ClientFeatureDrawer({ open, onClose, title, icon, subtitle, children }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 460 },
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          background: 'linear-gradient(180deg, #ffffff 60%, rgba(49, 196, 141, 0.05))',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.25} alignItems="center">
            {icon}
            <Stack spacing={0.25}>
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>
          </Stack>
          <IconButton onClick={onClose} edge="end" aria-label="Close feature">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', pr: 0.5 }}>{children}</Box>
      </Box>
    </Drawer>
  )
}

export default ClientFeatureDrawer
