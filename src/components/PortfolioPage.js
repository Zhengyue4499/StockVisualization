import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch portfolio data from the backend
  const fetchPortfolios = async () => {
    try {
      const response = await fetch('http://localhost:8080/allportfolio');
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data.');
      }

      const data = await response.json();
      if (!data.ok || !Array.isArray(data.data)) {
        throw new Error('Invalid data structure received from backend.');
      }

      setPortfolios(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Define unique colors for cards
  const cardColors = ['#FFD54F', '#BDBDBD', '#FFAB91', '#64B5F6', '#81C784', '#F06292'];

  // Handle "View the Results" click
  const handleViewResults = (portfolioId) => {
    navigate(`/portfolio/${portfolioId}`); // Navigate using dynamic segment
  };

  return (
    <Box
      sx={{
        p: 4,
        fontFamily: 'Roboto, sans-serif',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          fontFamily: 'Cursive',
        }}
      >
        Portfolio Trending
      </Typography>

      {error && (
        <Typography
          variant="body1"
          sx={{ color: 'red', mb: 4 }}
        >
          {error}
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        {portfolios.map((portfolio, index) => (
          <Grid item xs={12} sm={6} md={4} key={portfolio.PortfolioID}>
            <Card
              sx={{
                backgroundColor: cardColors[index % cardColors.length], // Use unique color
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                textAlign: 'left',
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: '#212121',
                  }}
                >
                  Top {index + 1}: {portfolio.PortfolioName}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-block',
                      backgroundColor: '#e0e0e0',
                      color: '#212121',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    Level: {portfolio.ProfileName}
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleViewResults(portfolio.PortfolioID)} // Pass PortfolioID
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#212121',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    📊 View the results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PortfolioPage;
