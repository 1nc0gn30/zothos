import React, { useState } from 'react';
import { 
  AppBar, Box, Toolbar, IconButton, Menu, MenuItem, Typography, Grow,  Button 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Close } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // Import Link for routing

const MobileAppBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'row',
        height: '104px',
      }}
    >
      {/* Left Section with Logo */}
      <Box
        sx={{
          width: { xs: '40%', sm: '30%' },
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '16px',
        }}
      >
        <Link to="/">
          <Box
            component="img"
            src="/assets/images/EvergreenGreenLogo.png"
            sx={{ height: '150px', cursor: 'pointer' }}
          />
        </Link>
      </Box>

      {/* Right Section with Green Background */}
      <Toolbar
        sx={{
          width: { xs: '90%', sm: '80%' },
          display: 'flex',
          justifyContent: 'flex-end',
          borderBottomLeftRadius: '100px',
          background: '#56B435',
        }}
      >
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ marginRight: '8px' }}
        >
          <MenuIcon sx={{ fontSize: '3rem' }} />
        </IconButton>

        {/* Dropdown Menu with Grow Transition */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          TransitionComponent={Grow}
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: '#fff',
              borderRadius: '12px',
              width: '90vw',
              height: '100vh',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          }}
        >
          {/* Close Icon */}
          <IconButton 
            onClick={handleMenuClose}
            sx={{ position: 'absolute', top: '16px', right: '16px' }}
          >
            <Close />
          </IconButton>

          {/* Navigation Links */}
          <Box sx={{ marginTop: '60px', flex: 1, padding: '16px' }}>
            {[
              { name: 'Locations', path: '/locations' },
              { name: 'About Us', path: '/about' },
              { name: 'Services', path: '/services' },
              { name: 'Contact', path: '/contact' },
              { name: 'FAQ', path: '/faq' },
            ].map((item) => (
              <MenuItem key={item.name} onClick={handleMenuClose}>
                <Button
                  component={Link}
                  to={item.path}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    color: '#333',
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      color: '#56B435',
                    },
                  }}
                >
                  {item.name}
                </Button>
              </MenuItem>
            ))}
          </Box>

          {/* Footer with Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              borderTop: '1px solid #e0e0e0',
              marginTop: 20,
            }}
          >
            <Box
              component="img"
              src="/assets/images/EvergreenGreenLogo.png"
              sx={{ height: '50px', marginRight: '8px' }}
            />
            <Typography variant="body2" color="textSecondary">
              © 2024 Evergreen Inc.
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MobileAppBar;
