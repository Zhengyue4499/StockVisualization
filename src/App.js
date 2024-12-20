import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import EmployeePage from './components/EmployeePage';
import RealTimeStockPage from './components/RealTimeStockPage';
import UserManagementPage from './components/UserManagementPage';
import PortfolioDetailPage from './components/PortfolioDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />

        <Route path="/real-time-stock" element={<RealTimeStockPage />} />

        <Route path="/user-management" element={<UserManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;