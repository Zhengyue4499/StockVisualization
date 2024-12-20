import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, Paper, Avatar } from '@mui/material';
import { Person, Work } from '@mui/icons-material';

const WelcomePage = () => {
  const navigate = useNavigate();

  const colors = {
    background: '#f9f9f9',
    paper: '#ffffff',
    primary: '#1976d2',
    secondary: '#9c27b0',
    text: '#333333',
    textSecondary: '#555555',
    border: '#e0e0e0',
  };

  return (
    <Box sx={{ bgcolor: colors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: colors.paper,
            boxShadow: '0px 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: colors.text }}>
            Please select your identity
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: colors.textSecondary }}>
            Select your character to continue
          </Typography>



            <Grid item xs={12} sm={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  }
                }}
                onClick={() => navigate('/login')}
              >
                <Avatar sx={{ bgcolor: colors.secondary, width: 64, height: 64, mb: 2 }}>
                  <Work />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.text }}>
                  Employee
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  Continue as an employee
                </Typography>
              </Paper>
            </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomePage;
