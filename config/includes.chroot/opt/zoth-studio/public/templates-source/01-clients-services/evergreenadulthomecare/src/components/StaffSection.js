import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';

const staffMembers = [
  {
    name: 'Emily Johnson',
    title: 'Registered Nurse (RN)',
    image: 'https://media.istockphoto.com/id/2104290678/photo/portrait-of-a-female-nurse-in-blue-medical-scrubs-holding-a-patient-medical-record.jpg?s=2048x2048&w=is&k=20&c=8Sejfqc4zuJkXFshLYC64QR-6AtBsOdvlmDL83Qw0aY=',
    description: 'Emily ensures the medical needs of our residents are met with compassion and expertise.',
  },
  {
    name: 'Michael Davis',
    title: 'Caregiver',
    image: 'https://media.istockphoto.com/id/1783744987/photo/medical-arms-crossed-doctor-with-portrait-of-man-for-healthcare-surgery-and-happy-smile.jpg?s=2048x2048&w=is&k=20&c=j9rwhipPAihL69Rfd3WGDQTK_FeXzf5T65QclsbMTG4=',
    description: 'Michael provides daily assistance with activities and offers emotional support to all residents.',
  },
  {
    name: 'Sophia Martinez',
    title: 'Nutritionist',
    image: 'https://media.istockphoto.com/id/2155531264/photo/smiling-medical-professional-in-scrubs-holding-a-clipboard-in-hospital-setting.jpg?s=2048x2048&w=is&k=20&c=v57JhO2YESkPP7F3nlLuExgUwtLSmNXjafTmA_spP4g=',
    description: 'Sophia prepares personalized meal plans to promote healthy living and well-being.',
  },
];

const StaffSection = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 8, px: 4 }}>
      <Typography variant="h6" align="center"  mb={2}>
        Meet Our Compassionate
      </Typography>
      <Typography variant="h2" align="center" fontWeight="bold" mb={4} >
        Assisted Living Staff
      </Typography>
      <Typography 
        variant="body1" 
        align="center" 
        color="textSecondary" 
        sx={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '20px' }}
      >
        Our dedicated team works tirelessly to provide high-quality care, ensuring the well-being, comfort, 
        and happiness of every resident at Evergreen Adult Home Care.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {staffMembers.map((staff, index) => (
          <Grid item="true" key={index} size={{xs: 12, sm: 6, md: 4}}>
            <Card
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 3,
                position: 'relative', // Allow for overlay positioning
                transition: 'transform 0.4s, box-shadow 0.4s',
                '&:hover': { 
                  transform: 'scale(1.05)', 
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' 
                },
              }}
            >
              {/* Overlay Chips for Name and Title */}
              <Stack 
                direction="column" 
                spacing={1} 
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  zIndex: 1,
                }}
              >
                <Chip 
                  label={staff.name} 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    fontWeight: 'bold', 
                    color: '#0A4704' 
                  }} 
                />
                <Chip 
                  label={staff.title} 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    color: '#0A4704', 
                    fontStyle: 'italic' 
                  }} 
                />
              </Stack>

              <CardMedia
                component="img"
                height="300"
                image={staff.image}
                alt={staff.name}
                sx={{ 
                  filter: 'grayscale(50%)', 
                  transition: 'filter 0.4s', 
                  '&:hover': { filter: 'grayscale(0%)' } 
                }}
              />
              <CardContent sx={{ backgroundColor: '#56B435', textAlign: 'center', padding: '24px' }}>
                <Typography variant="body2" color="white">
                  {staff.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StaffSection;
