import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<PrivateRoute component={DashboardPage} />} />

    </Routes>
  );
};

export default App;
