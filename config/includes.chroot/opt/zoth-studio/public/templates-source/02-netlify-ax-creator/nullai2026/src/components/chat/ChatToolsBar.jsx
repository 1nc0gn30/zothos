import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DownloadIcon from '@mui/icons-material/Download';
import StreamIcon from '@mui/icons-material/Stream';
import StopIcon from '@mui/icons-material/Stop';
import { motion } from 'framer-motion';

export default function ChatToolsBar({
  messages,
  onSave,
  onClear,
  onDownload,
  streaming,
  toggleStreaming,
}) {
  const theme = useTheme();

  const tools = [
    {
      label: 'Save',
      icon: <SaveIcon />,
      onClick: onSave,
    },
    {
      label: 'Download',
      icon: <DownloadIcon />,
      onClick: onDownload,
    },
    {
      label: 'Clear',
      icon: <DeleteSweepIcon />,
      onClick: onClear,
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      {/* ===== LEFT: TOOLS ===== */}
      <Stack direction="row" spacing={0.75}>
        {tools.map((t) => (
          <Tooltip key={t.label} title={t.label} arrow>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
            >
              <IconButton
                size="small"
                onClick={t.onClick}
                sx={{
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.75),
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.12),
                  },
                }}
              >
                {t.icon}
              </IconButton>
            </motion.div>
          </Tooltip>
        ))}
      </Stack>

      {/* ===== RIGHT: STREAM STATUS ===== */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          size="small"
          icon={streaming ? <StreamIcon /> : <StopIcon />}
          label={streaming ? 'Streaming' : 'Single'}
          onClick={toggleStreaming}
          sx={{
            cursor: 'pointer',
            fontSize: '0.7rem',
            letterSpacing: 0.6,
            background: streaming
              ? alpha(theme.palette.primary.main, 0.18)
              : alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${
              streaming
                ? alpha(theme.palette.primary.main, 0.45)
                : alpha(theme.palette.divider, 0.6)
            }`,
            '& .MuiChip-icon': {
              color: streaming ? 'primary.main' : 'text.secondary',
            },
          }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          {messages.length} msgs
        </Typography>
      </Stack>
    </Box>
  );
}
