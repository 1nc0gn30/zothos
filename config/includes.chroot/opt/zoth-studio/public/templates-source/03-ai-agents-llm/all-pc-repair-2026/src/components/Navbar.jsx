import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Menu, MenuItem, ListItemIcon, Box, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import BuildIcon from '@mui/icons-material/Build';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Logo from './assets/transparent-logo.png';
import { DesignServicesSharp, ManageAccountsTwoTone } from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';
import FloatingCTA from './FloatingCTA';

// Keyframes for pulsing effect
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledAppBar = styled(AppBar)(({ hide }) => ({
  backgroundColor: '#0A0A10',
  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
  transition: 'transform 0.3s ease',
  transform: hide ? 'translateY(-100%)' : 'translateY(0)',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledIconButton = styled(IconButton)({
  color: '#FFD700',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#FFFFFF',
  },
  '&:focus-visible': {
    outline: '3px solid #00D2FF',
    outlineOffset: '2px',
  }
});

const PhoneButton = styled(Box)(({ isMobile }) => ({
  backgroundColor: '#FFD700',
  color: '#000000',
  fontWeight: 'bold',
  padding: isMobile ? '5px 10px' : '8px 16px',
  borderRadius: '20px',
  fontFamily: 'Poppins, sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: isMobile ? '4px' : '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  fontSize: isMobile ? '0.8rem' : '1rem',
  '&:hover': {
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    boxShadow: '0 6px 12px rgba(255, 215, 0, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:focus-visible': {
    outline: '3px solid #00D2FF',
    outlineOffset: '2px',
  }
}));

const PhoneIconRotate = styled(PhoneIcon)(({ isMobile }) => ({
  transition: 'transform 0.3s ease',
  fontSize: isMobile ? '1rem' : '1.25rem',
  '&:hover': {
    transform: 'rotate(15deg)',
  },
}));

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: 260,
    backgroundColor: '#121218',
    color: '#FFD700',
    borderLeft: '1px solid rgba(255, 215, 0, 0.2)',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif',
  },
});

const StyledListItem = styled(ListItem)({
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateX(4px)',
  },
  '&:focus-visible': {
    outline: '3px solid #00D2FF',
    outlineOffset: '2px',
  }
});

const StyledMenuItem = styled(MenuItem)({
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateX(4px)',
  },
  '&:focus-visible': {
    outline: '3px solid #00D2FF',
    outlineOffset: '2px',
  }
});

const AnimatedPhoneNumber = styled(Box)({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '2px',
    bottom: '-2px',
    left: '0',
    backgroundColor: 'black',
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '100%',
  },
});

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isCallHovered, setIsCallHovered] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:400px)');
  
  const phoneNumber = "757-559-1231";
  const formattedPhoneNumber = "757-559-1231";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleServicesClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleServicesClose = () => {
    setAnchorEl(null);
  };

  const handleLinkClick = () => {
    setMobileOpen(false);
    handleServicesClose();
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${phoneNumber.replace(/-/g, '')}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  const drawer = (
    <List sx={{ fontFamily: 'Poppins, sans-serif' }} role="navigation" aria-label="Main Mobile Navigation">
      <StyledListItem button component={Link} to="/" onClick={handleLinkClick}>
        <ListItemIcon>
          <HomeIcon sx={{ color: 'gold' }} />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </StyledListItem>

      <StyledListItem button component={Link} to="/what-we-do" onClick={handleLinkClick}>
        <ListItemIcon>
          <AutoFixHighIcon sx={{ color: '#00D2FF' }} />
        </ListItemIcon>
        <ListItemText primary="AI Estimator & Services" />
      </StyledListItem>

      <StyledListItem button onClick={handleServicesClick} aria-expanded={Boolean(anchorEl)}>
        <ListItemIcon>
          <BusinessCenterIcon sx={{ color: 'gold' }} />
        </ListItemIcon>
        <ListItemText primary="Services Menu" />
        <ExpandMoreIcon />
      </StyledListItem>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleServicesClose}
        PaperProps={{
          style: {
            backgroundColor: '#121218',
            color: 'gold',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            fontFamily: 'Poppins, sans-serif',
          },
        }}
      >
        <StyledMenuItem component={Link} to="/what-we-do" onClick={handleLinkClick}>
          All Services & AI Estimator
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/services/it-services" onClick={handleLinkClick}>
          <ListItemIcon>
            <BuildIcon sx={{ color: 'gold' }} />
          </ListItemIcon>
          IT Services & PC Repair
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/services/cloud-services" onClick={handleLinkClick}>
          <ListItemIcon>
            <CloudIcon sx={{ color: 'gold' }} />
          </ListItemIcon>
          Cloud Services
        </StyledMenuItem>
        
        <StyledMenuItem component={Link} to="/services/cybersecurity-services" onClick={handleLinkClick}>
          <ListItemIcon>
            <SecurityIcon sx={{ color: 'gold' }} />
          </ListItemIcon>
          Cybersecurity Services
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/services/voip-services" onClick={handleLinkClick}>
          <ListItemIcon>
            <PhoneIcon sx={{ color: 'gold' }} />
          </ListItemIcon>
          VoIP Services
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/services/managed-it-services" onClick={handleLinkClick}>
          <ListItemIcon>
            <DesignServicesSharp sx={{ color: 'gold' }} />
          </ListItemIcon>
          Managed IT Services
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/services/technology-procurement-services" onClick={handleLinkClick}>
          <ListItemIcon>
            <ManageAccountsTwoTone sx={{ color: 'gold' }} />
          </ListItemIcon>
          TPM Services
        </StyledMenuItem>
      </Menu>

      <StyledListItem button component={Link} to="/who-we-are" onClick={handleLinkClick}>
        <ListItemIcon>
          <InfoIcon sx={{ color: 'gold' }} />
        </ListItemIcon>
        <ListItemText primary="Who We Are" />
      </StyledListItem>

      <StyledListItem button component={Link} to="/contact" onClick={handleLinkClick}>
        <ListItemIcon>
          <ContactMailIcon sx={{ color: 'gold' }} />
        </ListItemIcon>
        <ListItemText primary="Contact Us" />
      </StyledListItem>

      <StyledListItem button component={Link} to="/blog" onClick={handleLinkClick}>
        <ListItemIcon>
          <ArticleIcon sx={{ color: 'gold' }} />
        </ListItemIcon>
        <ListItemText primary="Blog & News" />
      </StyledListItem>

      <StyledListItem button component={Link} to="/privacy-policy" onClick={handleLinkClick} sx={{ mt: 'auto', borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
        <ListItemIcon>
          <PrivacyTipIcon sx={{ color: 'gold' }} />
        </ListItemIcon>
        <ListItemText primary="Privacy Policy" />
      </StyledListItem>
    </List>
  );

  return (
    <>
      <StyledAppBar position="sticky" hide={hideNavbar} role="banner">
        <StyledToolbar>
          <Link to="/" aria-label="All PC Repair - Home">
            <img 
              src={Logo} 
              alt="All PC Repair & IT Solutions Logo" 
              style={{ height: isMobile ? '70px' : '95px', width: 'auto' }} 
            />
          </Link>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
            <Tooltip title="Call All PC Repair at (757) 559-1231" arrow placement="bottom">
              <PhoneButton 
                onClick={handlePhoneCall}
                onMouseEnter={() => setIsCallHovered(true)}
                onMouseLeave={() => setIsCallHovered(false)}
                tabIndex={0}
                role="button"
                aria-label={`Call All PC Repair at ${phoneNumber}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePhoneCall(); }}
                sx={{ animation: isCallHovered ? 'none' : `${pulse} 2s infinite ease-in-out` }}
                isMobile={isMobile}
              >
                {isCallHovered ? (
                  <CallEndIcon fontSize={isMobile ? "small" : "medium"} sx={{ transform: 'rotate(135deg)' }} />
                ) : (
                  <PhoneIconRotate fontSize={isMobile ? "small" : "medium"} isMobile={isMobile} />
                )}
                {isExtraSmall ? null : (
                  <AnimatedPhoneNumber>
                    {formattedPhoneNumber}
                  </AnimatedPhoneNumber>
                )}
              </PhoneButton>
            </Tooltip>
            
            <StyledIconButton edge="end" aria-label="Open main navigation menu" onClick={handleDrawerToggle}>
              <MenuIcon style={{ fontSize: isMobile ? "30px" : "40px" }}/>
            </StyledIconButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      
      <nav aria-label="Side drawer navigation">
        <StyledDrawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </StyledDrawer>
      </nav>

      {hideNavbar && <FloatingCTA phoneNumber={phoneNumber} />}
    </>
  );
};

export default Navbar;
