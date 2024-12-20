import React from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (

    <AppBar
      position="static"
      color="default"
      sx={{
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
        alignItems: 'center',
      }}
    >
      <Tabs
        value={location.pathname} // Highlight the active tab based on the URL path
        variant="fullWidth"
        textColor="inherit"
        sx={{
          width: '50%',
          minWidth: '300px',
        }}
        TabIndicatorProps={{
          style: {
            backgroundColor: '#000',
            height: '2px',
          },
        }}
      >
        <Tab
          label="Portfolio"
          value="/employee"
          onClick={() => navigate('/employee')}
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            color: '#000',
            '&.Mui-selected': { color: '#000' },
          }}
        />
        <Tab
          label="Real Time Stock"
          value="/real-time-stock"
          onClick={() => navigate('/real-time-stock')}
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            color: '#000',
            '&.Mui-selected': { color: '#000' },
          }}
        />
        <Tab
          label="User Management"
          value="/user-management"
          onClick={() => navigate('/user-management')}
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            color: '#000',
            '&.Mui-selected': { color: '#000' },
          }}
        />
      </Tabs>
    </AppBar>
  );
};

export default NavigationBar;
