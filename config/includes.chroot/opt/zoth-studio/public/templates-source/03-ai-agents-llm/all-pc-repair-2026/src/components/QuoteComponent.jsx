import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const QuoteContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'gold',
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  fontSize: '4rem',
  opacity: 0.2,
  position: 'absolute',
  top: theme.spacing(-2),
  left: theme.spacing(-2),
}));

const QuoteText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Oswald, sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  position: 'relative',
  zIndex: 1,
}));

const QuoteComponent = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh', backgroundColor: 'transparent', px: 2 }}>
      <QuoteContainer>
        <QuoteIcon />
        <QuoteText variant="h4">
          "A smarter way to do I.T."
        </QuoteText>
      </QuoteContainer>
    </Box>
  );
};

export default QuoteComponent;
