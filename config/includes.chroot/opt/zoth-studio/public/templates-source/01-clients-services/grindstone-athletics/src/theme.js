// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Anton", "Cinzel", sans-serif',
    h1: {
      fontFamily: '"Cinzel", "Anton", sans-serif',
    },
    h2: {
      fontFamily: '"Cinzel", "Anton", sans-serif',
      
    },
    // Customize other typography variants similarly
  },
  palette: {
    primary: {
      main: '#FF0000', // Red from the logo
    },
    secondary: {
      main: '#0000FF', // Blue from the logo
    },
  },
});

export default theme;
