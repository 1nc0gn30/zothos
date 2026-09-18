import React from 'react';
import { Email, Facebook, Phone, X } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Button, Typography, Divider, IconButton, useTheme } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const DesktopAppBar = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'row',
        height: '150px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '0 24px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left Section with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link to="/">
        <Box
          component="img"
          src="/assets/images/EvergreenGreenLogo.png"
          alt="Evergreen Logo"
          sx={{
            height: '180px',
            cursor: 'pointer',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        </Link>
      </Box>

      {/* Center Section with Contact Info */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 3,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Phone sx={{ color: '#56B435' }} />
        <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
          951-893-0859
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ borderColor: '#ccc' }} />
        <Email sx={{ color: '#56B435' }} />
        <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
          support@evergreenhc.com
        </Typography>
      </Box>

      {/* Right Section with Navigation and Social Media */}
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 3,
          paddingRight: '8px',
        }}
      >
        {/* Social Media Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 'bold' }}>
            Follow us:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              sx={{
                bgcolor: '#4267B2',
                color: 'white',
                transition: 'transform 0.3s',
                '&:hover': {
                  bgcolor: '#365899',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: 'black',
                color: 'white',
                transition: 'transform 0.3s',
                '&:hover': {
                  bgcolor: '#333',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <X />
            </IconButton>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          {[
            { name: 'Locations', path: '/locations' },
            { name: 'About Us', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Contact', path: '/contact' },
            { name: 'FAQ', path: '/faq'},
          ].map((item) => (
            <Button
              key={item.name}
              component={Link} // Use Link component from react-router-dom
              to={item.path} // Set the path for navigation
              color="inherit"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                textTransform: 'none',
                transition: 'color 0.3s',
                '&:hover': {
                  color: '#56B435',
                },
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: -45,
            right: -25,
            width: '50vw',
            height: 40,
            background: '#56B435',
            borderTopLeftRadius: 100,
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default DesktopAppBar;
