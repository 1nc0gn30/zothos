import React, { useState } from 'react';
import { Container, Grid, Card, CardMedia, CardActionArea, Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import CloseIcon from '@mui/icons-material/Close';

const Gallery = () => {
  const images = [
    { id: 1, title: "Metal Fabrication", url: "https://via.placeholder.com/400" },
    { id: 2, title: "Custom Signs", url: "https://via.placeholder.com/400" },
    { id: 3, title: "Bespoke Installations", url: "https://via.placeholder.com/400" },
    { id: 4, title: "Industrial Art", url: "https://via.placeholder.com/400" },
    { id: 5, title: "Structural Metal Work", url: "https://via.placeholder.com/400" },
    { id: 6, title: "Architectural Details", url: "https://via.placeholder.com/400" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Box sx={{ py: 10, bgcolor: '#121212', color: 'white' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#888', letterSpacing: 2, display: 'block' }}>
              PROJECT GALLERY
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Our Work in Action
            </Typography>
          </Box>
        </motion.div>

        {/* Image Grid */}
        <Grid container spacing={4}>
          {images.map((image) => (
            <Grid item key={image.id} xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Tilt glareEnable={true} glareMaxOpacity={0.3} scale={1.02}>
                  <Card 
                    sx={{
                      bgcolor: '#1A1A1A',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                      '&:hover': { boxShadow: '0 15px 40px rgba(255,255,255,0.2)' }
                    }}
                  >
                    <CardActionArea onClick={() => setSelectedImage(image.url)}>
                      <CardMedia
                        component="img"
                        image={image.url}
                        alt={image.title}
                        sx={{
                          height: 250,
                          filter: 'brightness(0.9)',
                          transition: 'transform 0.4s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                    </CardActionArea>
                  </Card>
                </Tilt>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Lightbox (Fullscreen Image Preview) */}
        <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md">
          <DialogContent sx={{ bgcolor: '#000', p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <CloseIcon />
            </IconButton>
            <img src={selectedImage} alt="Full size preview" style={{ width: '100%', borderRadius: 2 }} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Gallery;
