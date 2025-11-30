import React from 'react';
import './MetricCard.css';

// Componente reutilizável de card de métrica com cor dinâmica
const MetricCard = ({ title, value, subtext, icon, color }) => {
  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        <span className="metric-icon">{icon}</span>
      </div>
      <p className="metric-value">{value}</p>
      <p className="metric-subtext">{subtext}</p>
    </div>
  );
};

export default MetricCard;
