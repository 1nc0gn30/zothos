import React, { useState } from 'react';
import { Box, Container, Typography, Modal, Paper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useSpring, animated } from 'react-spring';
import styled from '@emotion/styled';
import './styles/SchedulePage.css';
import scheduleData from './data/schedule.json'; // Path to the JSON file

const StyledBox = styled(Box)`
  .fc {
    --fc-bg-event: #fff;
    --fc-border-color: #d32f2f;
    --fc-event-bg-color: #d32f2f;
    --fc-event-border-color: #d32f2f;
    --fc-event-text-color: #fff;
    --fc-today-bg-color: rgba(211, 47, 47, 0.2);
  }
`;

const SchedulePage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const modalAnimation = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(-20px)',
  });

  return (
    <Container id="page-top" maxWidth={false} disableGutters className="schedule-container">
      <Box className="hero-small-schedule">
        <Typography variant="h2" className="hero-title-schedule">
          Class Schedule
        </Typography>
      </Box>
      <Container maxWidth="lg" className="calendar-container">
        <StyledBox>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={scheduleData.map(event => ({
              title: event.className,
              start: event.start, // Assuming start date/time is in the JSON file
              end: event.end, // Assuming end date/time is in the JSON file
              extendedProps: {
                description: event.description,
                instructor: event.instructor,
              },
            }))}
            eventClick={handleEventClick}
          />
        </StyledBox>
      </Container>
      <Modal open={open} onClose={handleClose} className="modal-schedule">
        <animated.div style={modalAnimation} className="animated-modal-schedule">
          <Box className="modal-box-schedule">
            {selectedEvent && (
              <Paper elevation={3} className="event-details-schedule">
                <Typography variant="h4" color="textPrimary">{selectedEvent.title}</Typography>
                <Typography variant="body1" color="textSecondary">{selectedEvent.extendedProps.description}</Typography>
                <Typography variant="body2" color="textSecondary">Instructor: {selectedEvent.extendedProps.instructor}</Typography>
                <Typography variant="body2" color="textSecondary">Start: {selectedEvent.start.toLocaleString()}</Typography>
                <Typography variant="body2" color="textSecondary">End: {selectedEvent.end.toLocaleString()}</Typography>
                <button onClick={handleClose} className="close-button">Close</button>
              </Paper>
            )}
          </Box>
        </animated.div>
      </Modal>
    </Container>
  );
};

export default SchedulePage;
