import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, subtext, icon, color }) => {
  return (
    <div 
      className="metric-card" 
      style={{ borderLeftColor: color }} // A borda colorida na esquerda
    >
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        
        {/* ALTERAÇÃO AQUI: 
            1. Usamos a cor dinâmica no ícone também.
            2. Renderizamos a tag <i> com a classe do Font Awesome 
        */}
        <span className="metric-icon" style={{ color: color }}>
          <i className={icon}></i>
        </span>
      </div>
      
      <p className="metric-value">{value}</p>
      <p className="metric-subtext">{subtext}</p>
    </div>
  );
};

export default MetricCard;