import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Card, CardContent, Chip, Grow, Modal, Backdrop, Fade } from '@mui/material';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import logo from './assets/logo.png';
import scheduleData from './data/scheduleData.json';
import './styles/WeeklySchedule.css';

const WeeklySchedule = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [schedule, setSchedule] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    setSchedule(scheduleData);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedDay(newValue);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const days = Object.keys(schedule);

  return (
    <ParallaxProvider>
      <Box className="weekly-schedule">
        <Box className="sidebar">
          <img src={logo} alt="Logo" className="weekly-logo" />
          <Tabs
            orientation="vertical"
            value={selectedDay}
            onChange={handleTabChange}
            className="vertical-tabs"
            aria-label="weekly schedule"
          >
            {days.map((day, index) => (
              <Tab
                key={day}
                label={day}
                className="day-tab"
                onMouseEnter={() => setSelectedDay(index)}
                onClick={() => setSelectedDay(index)}
              />
            ))}
          </Tabs>
        </Box>
        <Box className="weekly-content">
          <Parallax y={[20, -20]} className="parallax-container">
            <Grow in>
              <Card className="schedule-card">
                <CardContent>
                  <Typography variant="h4" className="schedule-day">
                    {days[selectedDay]}
                  </Typography>
                  <Box className="chip-container">
                    {schedule[days[selectedDay]] && schedule[days[selectedDay]].split('\n').map((item, index) => (
                      <Chip
                        key={index}
                        label={item.trim()}
                        className="schedule-chip"
                        onClick={() => handleEventClick(item.trim())}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Parallax>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className="modal-content">
              <Typography variant="h6" className="modal-title">
                Event Details
              </Typography>
              <Typography variant="body1" className="modal-description">
                {selectedEvent}
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ParallaxProvider>
  );
};

export default WeeklySchedule;
