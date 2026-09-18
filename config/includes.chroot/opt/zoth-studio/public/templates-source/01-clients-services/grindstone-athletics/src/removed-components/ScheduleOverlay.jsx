import React from 'react';
import { Box, Typography, Modal, Backdrop } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const ScheduleOverlay = ({ open, handleClose, day, schedule }) => {
  const animation = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
    config: { tension: 300, friction: 25 }
  });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <animated.div style={{ ...animation, position: 'absolute', top: '50%', left: '50%' }}>
        <Box sx={{
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {day}
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
            {schedule}
          </Typography>
        </Box>
      </animated.div>
    </Modal>
  );
};

export default ScheduleOverlay;
