import React from 'react';
import { Box, Typography, useMediaQuery, useTheme, Button, Card, CardContent } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom'; // Import Link for routing

const HeadingsWithImages = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        padding: '16px',
        width: '80vw',
        margin: '0 auto',
      }}
    >
      {/* Headings */}
      <Typography variant="h6" gutterBottom>
        What We Do
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }} variant="h2" gutterBottom>
        Services We Offer
      </Typography>

      {/* Services Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {/* Service Card 1 */}
        <Card
          sx={{
            maxWidth: '300px',
            borderRadius: '16px',
            textAlign: 'center',
            position: 'relative',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#0A4704',
              color: '#fff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            1
          </Box>
          <Box
            component="img"
            src="https://plus.unsplash.com/premium_photo-1663100865529-c64f19ba6ec9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Programs"
            sx={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
            }}
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
              paddingBottom: '15px',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#0A4704' }}>
                Customized Programs
              </Typography>
              <Typography variant="body2">
                Tailored programs to meet individual needs, ensuring comfort and engagement.
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/services"
              size="small"
              sx={{ color: '#0A4704' }}
              endIcon={<ArrowForwardIosIcon />}
            >
              Click Here
            </Button>
          </CardContent>
        </Card>

        {/* Service Card 2 */}
        <Card
          sx={{
            maxWidth: '300px',
            borderRadius: '16px',
            textAlign: 'center',
            position: 'relative',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#0A4704',
              color: '#fff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            2
          </Box>
          <Box
            component="img"
            src="https://plus.unsplash.com/premium_photo-1664475811964-75af7d90ee4b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Housing"
            sx={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
            }}
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
              paddingBottom: '15px',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#0A4704' }}>
                Comfortable Housing
              </Typography>
              <Typography variant="body2">
                Safe and welcoming living spaces for all residents.
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/services"
              size="small"
              sx={{ color: '#0A4704' }}
              endIcon={<ArrowForwardIosIcon />}
            >
              Click Here
            </Button>
          </CardContent>
        </Card>

        {/* Service Card 3 */}
        <Card
          sx={{
            maxWidth: '300px',
            borderRadius: '16px',
            textAlign: 'center',
            position: 'relative',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#0A4704',
              color: '#fff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            3
          </Box>
          <Box
            component="img"
            src="https://media.istockphoto.com/id/2151920923/photo/nurse-listening-heartbeat-of-a-senior-woman-during-medical-consultation.jpg?s=1024x1024&w=is&k=20&c=ZM1ppXUWRh3KaiZ-ahoDNLFOyE-DooJDbCklGcIQ9Bo="
            alt="Meals"
            sx={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
            }}
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
              paddingBottom: '15px',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#0A4704' }}>
                Nutritious Meals
              </Typography>
              <Typography variant="body2">
                Delicious and healthy meals provided daily to support well-being.
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/services"
              size="small"
              sx={{ color: '#0A4704' }}
              endIcon={<ArrowForwardIosIcon />}
            >
              Click Here
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default HeadingsWithImages;
