import React from 'react';
import { Box } from '@mui/material';
import NavigationBar from '../components/NavigationBar'; // Import NavigationBar
import PortfolioPage from './PortfolioPage'; // Import PortfolioPage

const EmployeePage = () => {
  return (
    <div>
      <NavigationBar /> {/* Reusable navigation bar */}
      <Box sx={{ p: 3 }}>
        <PortfolioPage />
      </Box>
    </div>
  );
};

export default EmployeePage;