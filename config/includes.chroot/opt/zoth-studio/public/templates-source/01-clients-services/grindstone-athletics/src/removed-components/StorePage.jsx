import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

const items = [
  { id: 1, name: 'Item 1', price: '$10.00', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Item 2', price: '$20.00', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Item 3', price: '$30.00', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Item 4', price: '$40.00', image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Item 5', price: '$50.00', image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Item 6', price: '$60.00', image: 'https://via.placeholder.com/150' },
];

const StorePage = () => {
  return (
    <Container id="page-top" maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Store
      </Typography>
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StorePage;
