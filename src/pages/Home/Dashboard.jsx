import React from 'react';
import MetricCard from '../../components/MetricCard';
import './Dashboard.css';

const Dashboard = () => {
  // Dataset de métricas - facilita manutenção e escalabilidade
  const metrics = [
    {
      id: 1,
      title: 'Feiras Ativas',
      value: '12',
      subtext: '3 programadas',
      icon: '📅',
      color: '#8e44ad',
    },
    {
      id: 2,
      title: 'Expositores',
      value: '248',
      subtext: '+18 este mês',
      icon: '👥',
      color: '#2ecc71',
    },
    {
      id: 3,
      title: 'Taxa Ocupação',
      value: '87%',
      subtext: 'Média geral',
      icon: '📈',
      color: '#f1c40f',
    },
    {
      id: 4,
      title: 'Vendas Totais',
      value: 'R$ 485k',
      subtext: '+12% vs mês anterior',
      icon: '💰',
      color: '#e74c3c',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema Feira+</p>
      </div>

      {/* Grid responsivo renderizando cards de métricas */}
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-wrapper">
            <MetricCard
              title={metric.title}
              value={metric.value}
              subtext={metric.subtext}
              icon={metric.icon}
              color={metric.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
