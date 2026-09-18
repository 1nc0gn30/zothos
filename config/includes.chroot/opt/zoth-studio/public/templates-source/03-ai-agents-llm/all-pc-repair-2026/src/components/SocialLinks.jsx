import React from 'react';
import { styled } from '@mui/material/styles';  
import { Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { X } from '@mui/icons-material';

const SocialLinksContainer = styled(Grid)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16px', 
});

const SocialLinks = () => {
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61561359129196';
  const linkedinUrl = 'https://www.linkedin.com/company/all-pc-repair';
  const xUrl = "https://x.com/allpcrepair";

  return (
    <SocialLinksContainer container spacing={2}>
      <Grid item>
        <IconButton component="a" href={facebookUrl} target="_blank" rel="noopener noreferrer">
          <FacebookIcon sx={{ color: "white", transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out', '&:hover': { color: 'gold', transform: 'scale(1.05)' } }}/>
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton component="a" href={linkedinUrl} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon sx={{ color: "white", transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out', '&:hover': { color: 'gold', transform: 'scale(1.05)' } }}/>
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton component="a" href={xUrl} target="_blank" rel="noopener noreferrer">
          <X sx={{ color: "white", transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out', '&:hover': { color: 'gold', transform: 'scale(1.05)' } }}/>
        </IconButton>
      </Grid>
    </SocialLinksContainer>
  );
};

export default SocialLinks;
