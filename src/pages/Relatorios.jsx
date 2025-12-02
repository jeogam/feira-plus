import React, { useState, useEffect } from 'react';
import { RelatorioService } from '../services/RelatorioService';

const Relatorios = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarDados = async () => {
    setLoading(true);
    setErro('');
    try {
      const resultado = await RelatorioService.getOcupacao();
      setDados(resultado);
    } catch (error) {
      setErro('Não foi possível carregar os dados do relatório.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Função auxiliar para definir cor da barra de progresso baseada na porcentagem
  const getProgressColor = (taxa) => {
    if (taxa >= 90) return 'bg-success'; // Verde (Ótimo)
    if (taxa >= 50) return 'bg-primary'; // Azul (Bom)
    if (taxa >= 20) return 'bg-warning'; // Amarelo (Atenção)
    return 'bg-danger';                  // Vermelho (Baixo)
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#1F2A37' }}>Relatório de Ocupação</h2>
        <button className="btn btn-outline-secondary" onClick={carregarDados}>
          <i className="bi bi-arrow-clockwise me-2"></i> Atualizar
        </button>
      </div>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Feira</th>
                  <th className="text-center">Total Espaços</th>
                  <th className="text-center text-success">Ocupados</th>
                  <th className="text-center text-muted">Vagos</th>
                  <th className="ps-4">Taxa de Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : dados.length > 0 ? (
                  dados.map((item, index) => (
                    <tr key={index}>
                      <td className="ps-4 fw-bold">{item.nomeFeira}</td>
                      <td className="text-center fw-bold">{item.totalEspacos}</td>
                      <td className="text-center text-success">{item.espacosOcupados}</td>
                      <td className="text-center text-muted">{item.espacosVagos}</td>
                      <td className="ps-4" style={{ minWidth: '200px' }}>
                        <div className="d-flex align-items-center">
                          <span className="me-2 fw-bold" style={{ width: '45px' }}>{item.taxaOcupacao}%</span>
                          <div className="progress flex-grow-1" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${getProgressColor(item.taxaOcupacao)}`} 
                              role="progressbar" 
                              style={{ width: `${item.taxaOcupacao}%` }}
                              aria-valuenow={item.taxaOcupacao} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Nenhum dado encontrado para gerar o relatório.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;