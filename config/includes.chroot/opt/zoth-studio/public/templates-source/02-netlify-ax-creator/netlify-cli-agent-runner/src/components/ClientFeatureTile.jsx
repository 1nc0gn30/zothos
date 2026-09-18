import { Card, CardActionArea, Stack, Typography } from '@mui/material'

function ClientFeatureTile({ icon, title, hint, onOpen }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(145deg, rgba(49, 196, 141, 0.08), rgba(49, 196, 141, 0.02))',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: 1,
        },
      }}
    >
      <CardActionArea onClick={onOpen} sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            {icon}
            <Stack spacing={0.25}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: 0 }}>
                {title}
              </Typography>
              {hint && (
                <Typography variant="body2" color="text.secondary">
                  {hint}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  )
}

export default ClientFeatureTile
