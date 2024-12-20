import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Alert, useMediaQuery } from '@mui/material';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'react-chartjs-2';
import NavigationBar from '../components/NavigationBar';

// Register Chart.js components and plugins
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  zoomPlugin
);

const RealTimeStockPage = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSearch = async () => {
    if (!ticker.trim()) {
      setError('Please enter a valid stock ticker.');
      return;
    }

    setError(null);
    setLoading(true);
    setChartData(null);

    try {
      const response = await fetch(`http://localhost:8080/stock?symbol=${ticker}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stock data. Please check the ticker symbol.');
      }

      const json = await response.json();
      if (!json.ok || !Array.isArray(json.data)) {
        throw new Error('Invalid data received from backend.');
      }

      const compiledData = compileChartData(json.data);
      setChartData(compiledData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const compileChartData = (data) => {
    const labels = data.map((item) => item.date);
    const highLowData = data.map((item) => ({ x: item.date, y: [item.low, item.high] }));
    const closePrices = data.map((item) => item.close);

    return {

      labels,
      datasets: [
        {
          label: 'Daily High-Low',
          data: highLowData,
          backgroundColor: 'rgba(66, 165, 245, 0.5)',
          borderColor: '#42a5f5',
          borderWidth: 1,
          type: 'bar',
        },
        {
          label: 'Close Price',
          data: closePrices,
          borderColor: '#ff7043',
          backgroundColor: 'rgba(255,112,67,0.1)',
          borderWidth: 2,
          type: 'line',
          tension: 0.3,
          pointBackgroundColor: '#ff7043',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  // Dynamically calculate chart size for mobile, tablet, and desktop
  const calculateChartSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const chartWidth = isMobile ? width * 0.9 : width * 0.7;
    const chartHeight = isMobile ? height * 0.5 : height * 0.6;
    return { chartWidth, chartHeight };
  };

  const { chartWidth, chartHeight } = calculateChartSize();

  return (
    <Box
      sx={{
        pt: 0, // Remove top padding
        pr: 4,
        pb: 4,
        pl: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Roboto, sans-serif',
      }}
    >

    <NavigationBar sx={{ mb: 4 }} />
<Box sx={{ height: '32px' }} />
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>

      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, width: '80%' }}>
        <TextField
          label="Stock Ticker"
          variant="outlined"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleSearch} size={isMobile ? "small" : "medium"}>
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4, width: '80%' }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading stock data...
          </Typography>
        </Box>
      )}

      {chartData && (
        <Box
          sx={{
            mt: 4,
            width: chartWidth,
            height: chartHeight,
            position: 'relative',
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            Stock Chart for {ticker.toUpperCase()}
          </Typography>
          <Chart
            type="bar"
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1000,
              },
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const datasetIndex = context.datasetIndex;
                      if (datasetIndex === 0) {
                        const low = context.raw.y[0];
                        const high = context.raw.y[1];
                        return `Low: $${low.toFixed(2)}  High: $${high.toFixed(2)}`;
                      } else if (datasetIndex === 1) {
                        return `Close: $${context.raw.toFixed(2)}`;
                      }
                    },
                    title: (context) => `Date: ${context[0].label}`,
                  },
                  displayColors: false,
                },
                zoom: {
                  pan: { enabled: true, mode: 'x' },
                  zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                    limits: {
                      x: { minRange: 5 },
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Date', font: { size: 14 } },
                  ticks: { maxRotation: 45, minRotation: 0 },
                  grid: { display: false },
                },
                y: {
                  title: { display: true, text: 'Price (USD)', font: { size: 14 } },
                  ticks: { callback: (value) => `$${value}` },
                  grid: { color: 'rgba(0,0,0,0.1)', borderDash: [3, 3] },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default RealTimeStockPage;