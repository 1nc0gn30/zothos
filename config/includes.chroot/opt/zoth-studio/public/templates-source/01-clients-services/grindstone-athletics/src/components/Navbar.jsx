import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ClassIcon from '@mui/icons-material/Class';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TestimonialIcon from '@mui/icons-material/ThumbUp';
import MembershipIcon from '@mui/icons-material/CardMembership';
import MediaIcon from '@mui/icons-material/Photo';
import ContactIcon from '@mui/icons-material/ContactMail';
import FAQIcon from '@mui/icons-material/Help';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'; // Make sure the path is correct
import './styles/Navbar.css'; // Custom styles

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Classes', path: '/classes', icon: <ClassIcon /> },
    { label: 'Schedule', path: '/classes#schedule', icon: <ScheduleIcon /> },
    { label: 'Testimonials', path: '/testimonials', icon: <TestimonialIcon /> },
    { label: 'Membership', path: '/membership', icon: <MembershipIcon /> },
    { label: 'Media', path: '/media', icon: <MediaIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
    { label: 'FAQ', path: '/faq', icon: <FAQIcon /> }, // Add FAQ route
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 'none', top: 0 }}>
        <Toolbar>
          <img src={logo} alt="Logo" style={{ height: '80px', cursor: 'pointer' }} onClick={() => navigate('/')} />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ color: 'black' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        transitionDuration={500}
        PaperProps={{
          sx: {
            width: '300px',
            backgroundColor: '#f5f5f5',
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Align items at the top
            padding: '10px',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={handleDrawerToggle}
            sx={{ color: 'black' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.label} onClick={() => handleNavigate(item.path)} className="menu-item">
              <ListItemIcon className="menu-item-icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ className: 'menu-item-text' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
