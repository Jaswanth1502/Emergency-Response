import React from 'react';
import { useApp } from '../context/AppContext';
import { AdminDashboard } from '../components/digitaltwin/AdminDashboard';
import { OperatorDashboard } from '../components/digitaltwin/OperatorDashboard';
import { AnalystDashboard } from '../components/digitaltwin/AnalystDashboard';

export const Dashboard: React.FC = () => {
  const { currentRole } = useApp();

  // Render role-tailored dashboard based on logged-in user role
  switch (currentRole) {
    case 'ADMIN':
      return <AdminDashboard />;

    case 'OPERATOR':
      return <OperatorDashboard />;

    case 'ANALYST':
      return <AnalystDashboard />;

    default:
      return <OperatorDashboard />;
  }
};

export default Dashboard;
