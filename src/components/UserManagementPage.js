import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Grid,
  Alert,
  Avatar,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import NavigationBar from './NavigationBar';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get color based on risk
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return '#ef5350'; // Red
      case 'Medium':
        return '#ffa726'; // Orange
      case 'Low':
        return '#66bb6a'; // Green
      default:
        return '#9e9e9e'; // Grey if not specified
    }
  };

  // Fetch user data from the backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const jsonResponse = await response.json();
      console.log('Backend Data:', jsonResponse);

      // Check if the "data" field is an array
      if (!Array.isArray(jsonResponse.data)) {
        throw new Error('Invalid data received from backend.');
      }

      setUsers(jsonResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call the API when the page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Insert the NavigationBar with margin-bottom */}
        <NavigationBar
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1100, // Ensure it stays above other content if needed
          }}
        />

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: '#212121',
            textAlign: 'center',
            mt: 8,
            mb: 4,
          }}
        >
          User Page
        </Typography>

      {/* Button to reload users */}
      <Button
        variant="contained"
        onClick={fetchUsers}
        sx={{
          mb: 4,
          backgroundColor: '#e0e0e0', // Profile background color
          color: '#000', // Text color
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#d6d6d6' }, // Slightly darker hover effect
        }}
      >
        Reload User Information
      </Button>

      {loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading user data...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4, width: '80%' }}>
          {error}
        </Alert>
      )}

      {/* User Cards in a Grid */}
      <Grid container spacing={3} sx={{ width: '100%' }}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.UserID}>
            <UserCard user={user} getRiskColor={getRiskColor}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Component for a single user card
const UserCard = ({ user, getRiskColor }) => {
  const riskColor = getRiskColor(user.RiskProfileLevel);

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        p: 2,
        textAlign: 'center',
        transition: '0.3s',
        '&:hover': { transform: 'scale(1.02)' },
      }}
    >
      <CardContent>
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: '#e0e0e0',
              mb: 1,
            }}
          >
            <PersonIcon sx={{ fontSize: 40, color: '#757575' }} />
          </Avatar>
        </Box>

        {/* User Name */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {user.Name}
        </Typography>

        {/* Email */}
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          {user.Email}
        </Typography>

        {/* UID */}
        <Typography variant="body2" sx={{ color: 'text.disabled', mb: 2 }}>
          UID: {user.UserID}
        </Typography>

        {/* Risk Profile Chip */}
        <Chip
          label={`Risk: ${user.RiskProfileLevel}`}
          sx={{
            backgroundColor: riskColor,
            color: '#fff',
            fontWeight: 'bold',
            mb: 2
          }}
        />

        {/* Additional User Info */}
        <Box sx={{ textAlign: 'left', mt: 2, mx: 'auto', maxWidth: '80%' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Account Type:</strong> {user.AccountType}
          </Typography>
          <Typography variant="body2"sx={{ mb: 1 }}>
            <strong> Name:</strong> {user.Name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Age:</strong> {user.Age}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Date of Birth:</strong> {user.DateOfBirth}
          </Typography>
、
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserPage;
