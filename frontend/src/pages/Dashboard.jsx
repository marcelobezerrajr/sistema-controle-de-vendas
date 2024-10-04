import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Vendas',
        data: [10, 20, 30, 25, 35, 40],
        borderColor: '#4caf50',
        fill: false,
      },
    ],
  };

  return (
    <div className={`dashboard-container ${loading ? 'loading' : ''}`}>
      <h1 className="fade-in">Painel de Controle</h1>
      <div className="chart-container fade-in">
        <Line data={data} />
      </div>
      <div className="stats-grid">
        <div className="stat-card fade-in">
          <h2>Total de Vendas</h2>
          <p>R$ 50,000</p>
        </div>
        <div className="stat-card fade-in">
          <h2>Novos Clientes</h2>
          <p>20</p>
        </div>
        <div className="stat-card fade-in">
          <h2>Comissões Pagas</h2>
          <p>R$ 5,000</p>
        </div>
        <div className="stat-card fade-in">
          <h2>Produtos Vendidos</h2>
          <p>150 unidades</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
