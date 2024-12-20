import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get portfolio_id from URL
import { TextField, Button, Box, Typography, CircularProgress, Alert, useMediaQuery, Paper } from '@mui/material';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'react-chartjs-2';
import NavigationBar from '../components/NavigationBar';

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

const colors = [
  '#ff7043', // orange
  '#42a5f5', // blue
  '#66bb6a', // green
  '#ab47bc', // purple
  '#ffa726', // orange variant
  '#26c6da', // cyan
];

const RealTimeStockPage = () => {
  const { id: portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (portfolioId) {
      handleFetchPortfolio(portfolioId);
    }
  }, [portfolioId]);

  const handleFetchPortfolio = async (pid) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/portfolio?portfolio_id=${pid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data. Check the portfolio ID.');
      }

      const json = await response.json();
      if (!json.ok || !json.data || !Array.isArray(json.data.stocks)) {
        throw new Error('Invalid data received from backend.');
      }

      setPortfolioData(json.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const compileChartData = (stocks) => {
    const allDates = Array.from(
      new Set(stocks.flatMap((stock) => stock.StockData.map((item) => item.date)))
    ).sort();

    const lineDatasets = [];

    stocks.forEach((stock, idx) => {
      const color = colors[idx % colors.length];

      const openPrices = allDates.map((date) => {
        const dayData = stock.StockData.find((d) => d.date === date);
        return dayData ? dayData.open : null;
      });

      const closePrices = allDates.map((date) => {
        const dayData = stock.StockData.find((d) => d.date === date);
        return dayData ? dayData.close : null;
      });

      // Open price line dataset
      lineDatasets.push({
        label: `${stock.symbol} Open`,
        data: openPrices,
        borderColor: color,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        type: 'line',
        tension: 0.3,
        pointBackgroundColor: color,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y',
      });

      // Close price line dataset (slightly darker tone or same color)
      // We can use the same color, or a different approach to differentiate.
      // For simplicity, just use the same color but a different dash pattern:
      lineDatasets.push({
        label: `${stock.symbol} Close`,
        data: closePrices,
        borderColor: color,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        type: 'line',
        tension: 0.3,
        pointBackgroundColor: color,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderDash: [5, 5], // dashed line to differentiate from open
        yAxisID: 'y',
      });
    });

    return {
      labels: allDates,
      datasets: lineDatasets,
    };
  };

  const calculateChartSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const chartWidth = isMobile ? width * 0.9 : width * 0.7;
    const chartHeight = isMobile ? height * 0.5 : height * 0.6;
    return { chartWidth, chartHeight };
  };

  const { chartWidth, chartHeight } = calculateChartSize();

  let chartData = null;
  if (portfolioData && portfolioData.stocks && portfolioData.stocks.length > 0) {
    chartData = compileChartData(portfolioData.stocks);
  }

  return (
    <Box
      sx={{
        pt: 0,
        pr: 4,
        pb: 4,
        pl: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Roboto, sans-serif',
        gap: 2,
      }}
    >
      {/* Navigation bar at the top */}
      <NavigationBar sx={{ mb: 4 }} />

      {/* Top section: Portfolio summary box */}
      {portfolioData && (
        <Paper
          elevation={3}
          sx={{
            width: isMobile ? '100%' : '80%',
            p: 3,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>Portfolio Summary</Typography>
          <Typography variant="body1">Holdings: ${portfolioData.holdings.toFixed(2)}</Typography>
          <Typography variant="body1">Stocks:</Typography>
          {portfolioData.stocks.map((s) => (
            <Box key={s.symbol} sx={{ pl: 2, mb: 1 }}>
              <Typography variant="body2">
                <strong>{s.symbol}</strong> - Allocation: {s.allocation}%
              </Typography>
              <Typography variant="body2">Purchase Date: {s.purchase_date}</Typography>
            </Box>
          ))}
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4, width: '80%' }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading portfolio data...
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
            Combined Stock Chart (Open & Close Prices)
          </Typography>
          <Chart
            type="line"
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
                      const datasetLabel = context.dataset.label;
                      // datasetLabel might be something like "AAPL Open" or "AAPL Close"
                      const value = context.raw?.toFixed(2);
                      return `${datasetLabel}: $${value}`;
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

      {/* Individual charts per stock with open and close lines */}
      {portfolioData && portfolioData.stocks && portfolioData.stocks.length > 0 && (
        <>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mt: 4 }}>
            Individual Stock Charts
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {portfolioData.stocks.map((s, idx) => {
              const openPrices = s.StockData.map(d => d.open);
              const closePrices = s.StockData.map(d => d.close);
              const dateLabels = s.StockData.map(d => d.date);
              const color = colors[idx % colors.length];

              const singleStockData = {
                labels: dateLabels,
                datasets: [
                  {
                    label: `${s.symbol} Open`,
                    data: openPrices,
                    borderColor: color,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: color,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                  },
                  {
                    label: `${s.symbol} Close`,
                    data: closePrices,
                    borderColor: color,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: color,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    borderDash: [5, 5],
                  }
                ]
              };

              return (
                <Paper key={s.symbol} elevation={2} sx={{ p: 2, width: isMobile ? '90%' : '45%' }}>
                  <Typography variant="h6" gutterBottom>{s.symbol}</Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <Chart
                      type="line"
                      data={singleStockData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            title: { display: true, text: 'Date' },
                            ticks: { maxRotation: 45, minRotation: 0 },
                          },
                          y: {
                            title: { display: true, text: 'Price (USD)' },
                            ticks: { callback: (value) => `$${value}` },
                          },
                        },
                        plugins: {
                          legend: { display: true, position: 'top' },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const datasetLabel = context.dataset.label.toLowerCase();
                                const priceType = datasetLabel.includes('open') ? 'Open' : 'Close';
                                return `${priceType}: $${context.raw.toFixed(2)}`;
                              },
                              title: (context) => `Date: ${context[0].label}`
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default RealTimeStockPage;


