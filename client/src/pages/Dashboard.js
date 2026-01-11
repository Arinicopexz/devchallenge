// src/pages/Dashboard.js
import React from 'react';
import DashboardSolar from '../components/DashboardSolar'; // <--- Importamos el componente nuevo

const Dashboard = () => {
  return (
    <div>
      {/* Aquí cargamos todo el simulador solar */}
      <DashboardSolar />
    </div>
  );
};

export default Dashboard;