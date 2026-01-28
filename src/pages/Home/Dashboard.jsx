import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import MetricCard from '../../components/MetricCard';
import { FeiraService } from '../../services/FeiraService';
import { ExpositorService } from '../../services/ExpositorService';
import { RelatorioService } from '../../services/RelatorioService';
import { EspacoService } from '../../services/EspacoService';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    feirasAtivas: 0,
    feirasProgramadas: 0,
    expositores: 0,
    espacosOcupados: 0,
    taxaOcupacao: 0
  });
  const [feirasData, setFeirasData] = useState([]);
  const [ocupacaoData, setOcupacaoData] = useState([]);
  const [recentFeiras, setRecentFeiras] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [feiras, expositores, ocupacao] = await Promise.all([
          FeiraService.listarTodas(),
          ExpositorService.listarTodos(),
          RelatorioService.getOcupacao()
        ]);

        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        // Feiras ativas (ativas ou sem data específica)
        const feirasAtivas = feiras.filter(f => !f.dataFim || new Date(f.dataFim) >= hoje).length;

        // Feiras programadas (com data futura)
        const feirasProgramadas = feiras.filter(f => f.dataInicio && new Date(f.dataInicio) > hoje).length;

        // Espaços ocupados - vamos contar de algumas feiras ativas
        let espacosOcupados = 0;
        let totalEspacos = 0;
        for (const feira of feiras.slice(0, 5)) { // Limitar para performance
          try {
            const espacos = await EspacoService.listarPorFeira(feira.id);
            espacosOcupados += espacos.filter(e => e.status === 'OCUPADO').length;
            totalEspacos += espacos.length;
          } catch {
            // Ignorar erro se feira não tiver espaços
          }
        }

        const taxaOcupacao = ocupacao.taxa || (totalEspacos > 0 ? Math.round((espacosOcupados / totalEspacos) * 100) : 0);

        setMetrics({
          feirasAtivas,
          feirasProgramadas,
          expositores: expositores.length,
          espacosOcupados,
          taxaOcupacao: `${taxaOcupacao}%`
        });

        // Data for charts
        const eventosCount = feiras.filter(f => f.tipo === 'EVENTO').length;
        const permanentesCount = feiras.filter(f => f.tipo === 'PERMANENTE').length;
        setFeirasData([
          { name: 'Eventos', value: eventosCount, color: '#8884d8' },
          { name: 'Permanentes', value: permanentesCount, color: '#82ca9d' }
        ]);

        // Ocupação por mês (simulado)
        setOcupacaoData([
          { mes: 'Jan', ocupacao: 65 },
          { mes: 'Fev', ocupacao: 70 },
          { mes: 'Mar', ocupacao: 75 },
          { mes: 'Abr', ocupacao: 80 },
          { mes: 'Mai', ocupacao: taxaOcupacao },
        ]);

        // Recent feiras (last 5)
        const sortedFeiras = feiras.sort((a, b) => new Date(b.dataCriacao || 0) - new Date(a.dataCriacao || 0));
        setRecentFeiras(sortedFeiras.slice(0, 5));

        // Próximos eventos (próximas 3 feiras)
        const proximos = feiras
          .filter(f => f.dataInicio && new Date(f.dataInicio) > hoje)
          .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))
          .slice(0, 3);
        setProximosEventos(proximos);

      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      }
    };

    fetchMetrics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard-content">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-3">Dashboard</h2>
          <p className="text-muted">Visão geral do sistema de feiras</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Feiras Ativas"
            value={metrics.feirasAtivas.toString()}
            subtext="Em andamento"
            icon="fas fa-calendar-check"
            color="#8e44ad"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Feiras Programadas"
            value={metrics.feirasProgramadas.toString()}
            subtext="Próximos eventos"
            icon="fas fa-calendar-plus"
            color="#3498db"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Expositores"
            value={metrics.expositores.toString()}
            subtext="Total cadastrados"
            icon="fas fa-users"
            color="#2ecc71"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Espaços Ocupados"
            value={metrics.espacosOcupados.toString()}
            subtext="Em uso atualmente"
            icon="fas fa-map-marker-alt"
            color="#e74c3c"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard
            title="Taxa Ocupação"
            value={metrics.taxaOcupacao}
            subtext="Média geral"
            icon="fas fa-chart-line"
            color="#f1c40f"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Distribuição de Feiras
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feirasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Evolução da Ocupação
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ocupacaoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Ocupação']} />
                  <Legend />
                  <Line type="monotone" dataKey="ocupacao" stroke="#82ca9d" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Eventos e Atividades Recentes */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="card-title mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Próximos Eventos
              </h5>
            </div>
            <div className="card-body">
              {proximosEventos.length > 0 ? (
                <div className="list-group list-group-flush">
                  {proximosEventos.map((feira, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{feira.nome}</h6>
                        <small className="text-muted">
                          {new Date(feira.dataInicio).toLocaleDateString('pt-BR')} - {feira.tipo}
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {Math.ceil((new Date(feira.dataInicio) - new Date()) / (1000 * 60 * 60 * 24))} dias
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">Nenhum evento programado</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-history me-2"></i>
                Feiras Recentes
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFeiras.map((feira, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{feira.nome}</td>
                        <td>
                          <span className={`badge ${feira.tipo === 'EVENTO' ? 'bg-primary' : 'bg-success'}`}>
                            {feira.tipo}
                          </span>
                        </td>
                        <td className="text-muted">
                          {feira.dataCriacao ? new Date(feira.dataCriacao).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;