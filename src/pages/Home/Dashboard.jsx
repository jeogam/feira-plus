import React from 'react';
import MetricCard from '../../components/MetricCard';

const Dashboard = () => {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Container de Grid do Bootstrap */}
      <div className="row g-4"> {/* g-4 dá um espaçamento (gap) entre os cards */}
        
        {/* Card 1 */}
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Feiras Ativas" 
            value="12" 
            subtext="3 programadas" 
            icon="fas fa-calendar-check" 
            color="#8e44ad" // Roxo
          />
        </div>

        {/* Card 2 */}
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Expositores" 
            value="248" 
            subtext="+18 este mês" 
            icon="fas fa-users" 
            color="#2ecc71" // Verde
          />
        </div>

        {/* Card 3 */}
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Taxa Ocupação" 
            value="87%" 
            subtext="Média geral" 
            icon="fas fa-chart-line" 
            color="#f1c40f" // Amarelo
          />
        </div>

        {/* Card 4 */}
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard 
            title="Vendas Totais" 
            value="R$ 485k" 
            subtext="+12% vs mês anterior" 
            icon="fas fa-sack-dollar" 
            color="#e74c3c" // Vermelho
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;