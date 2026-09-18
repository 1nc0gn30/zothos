import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './styles/SignInPage.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const response = await fetch('/.netlify/functions/signIn', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (result.success) {
      navigate('/store');
    } else {
      alert('Sign-in failed. Please try again.');
    }
  };
  

  return (
    <Container id="page-top" maxWidth={false} className="sign-in-container">
      <Paper elevation={3} className="sign-in-paper">
        <Box p={3} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Welcome to Grindstone Athletics Store
          </Typography>
          <Typography variant="body1" gutterBottom>
            Sign in to access the best gear and equipment for your training.
          </Typography>
          <form onSubmit={handleSignIn}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignInPage;
