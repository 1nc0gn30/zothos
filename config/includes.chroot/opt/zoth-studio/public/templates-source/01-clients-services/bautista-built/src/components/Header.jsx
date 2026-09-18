import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  useScrollTrigger, 
  Slide,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '1px',
  background: 'linear-gradient(45deg, #f5f5f5, #bdbdbd)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderRadius: '4px',
  padding: '6px 16px',
  position: 'relative',
  fontWeight: 500,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff'
  },
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40%',
    height: '3px',
    backgroundColor: '#64b5f6',
    borderRadius: '2px'
  } : {}
}));

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close drawer when changing routes
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [location.pathname]);
  
  const drawer = (
    <Box sx={{ 
      width: 250, 
      height: '100%',
      background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <LogoTypography variant="h6">Bautista Built</LogoTypography>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.name}
            sx={{ 
              mb: 1, 
              borderRadius: '4px',
              backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderLeft: isActive(item.path) ? '3px solid #64b5f6' : '3px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            <ListItemText 
              primary={item.name} 
              sx={{ 
                color: isActive(item.path) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                '& .MuiListItemText-primary': {
                  fontWeight: isActive(item.path) ? 600 : 400,
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <HideOnScroll>
      <StyledAppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar sx={{ padding: { xs: 1, sm: 2 } }}>
            <LogoTypography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Bautista Built
            </LogoTypography>
            
            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Desktop navigation */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {navItems.map((item) => (
                <NavButton 
                  key={item.name}
                  component={Link} 
                  to={item.path}
                  active={isActive(item.path) ? 1 : 0}
                >
                  {item.name}
                </NavButton>
              ))}
            </Box>
          </Toolbar>
        </Container>
        
        {/* Mobile navigation drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </StyledAppBar>
    </HideOnScroll>
  );
};

export default Header;