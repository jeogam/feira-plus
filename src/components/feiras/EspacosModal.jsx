import React, { useState, useEffect } from 'react';
import { EspacoService } from '../../services/EspacoService';
import SuccessModal from '../common/SuccessModal';
import ErrorModal from '../common/ErrorModal';

const EspacosModal = ({ show, handleClose, feira }) => {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para feedback visual (Sucesso/Erro)
  const [feedback, setFeedback] = useState({ showSuccess: false, showError: false, msg: '' });

  // Estado do formulário
  const [novoEspaco, setNovoEspaco] = useState({ 
    nome: '', 
    local: '', 
    dimensao: '', 
    status: 'LIVRE' 
  });

  // Carrega dados sempre que o modal abre ou a feira muda
  useEffect(() => {
    if (show && feira) {
      carregarEspacos();
      // Reinicia o form ao abrir
      setNovoEspaco({ nome: '', local: '', dimensao: '', status: 'LIVRE' });
    }
  }, [show, feira]);

  const carregarEspacos = async () => {
    setLoading(true);
    try {
      const dados = await EspacoService.listarPorFeira(feira.id);
      setEspacos(dados);
    } catch (error) {
      console.error("Erro ao carregar espaços", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoEspaco(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNÇÃO DE SALVAR (POST) ---
  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!novoEspaco.nome || !novoEspaco.local) return;

    try {
      // PREPARAÇÃO DO PAYLOAD:
      // A entidade Java 'Espaco' exige dataInicio, dataFim e horarios.
      // Como o usuário não digita isso no box, pegamos da Feira pai.
      
      const dataAtual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const payload = {
        ...novoEspaco,
        feiraId: feira.id, // Vínculo com a feira
        
        // Se a feira for Permanente e não tiver data definida, usa data atual
        dataInicio: feira.dataInicio || dataAtual,
        dataFim: feira.dataFim || dataAtual,
        
        // Se a feira não tiver horário, define um comercial padrão
        horarios: feira.horaAbertura ? `${feira.horaAbertura} - ${feira.horaFechamento}` : "08:00 - 18:00"
      };

      await EspacoService.salvar(payload);
      
      setFeedback({ ...feedback, showSuccess: true, msg: 'Espaço criado com sucesso!' });
      setNovoEspaco({ nome: '', local: '', dimensao: '', status: 'LIVRE' }); // Limpa form
      carregarEspacos(); // Recarrega a tabela
    } catch (error) {
      console.error(error);
      setFeedback({ ...feedback, showError: true, msg: 'Erro ao criar espaço. Verifique se a feira possui datas/horários.' });
    }
  };

  // --- FUNÇÃO DE EXCLUIR (DELETE) ---
  const handleExcluir = async (id) => {
    if(!window.confirm("Deseja realmente excluir este espaço?")) return;

    try {
      await EspacoService.excluir(id);
      carregarEspacos();
    } catch (error) {
      setFeedback({ ...feedback, showError: true, msg: 'Erro ao excluir espaço.' });
    }
  };

  // --- FUNÇÃO DE ALTERAR STATUS (PUT) ---
  const handleToggleStatus = async (espaco) => {
    try {
      await EspacoService.alternarStatus(espaco);
      carregarEspacos();
    } catch (error) {
      setFeedback({ ...feedback, showError: true, msg: 'Erro ao atualizar status do espaço.' });
    }
  };

  // Renderiza a cor do status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OCUPADO': return <span className="badge bg-danger">Ocupado</span>;
      case 'RESERVADO': return <span className="badge bg-warning text-dark">Reservado</span>;
      default: return <span className="badge bg-success">Livre</span>;
    }
  };

  if (!show || !feira) return null;

  return (
    <>
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content shadow custom-modal-content">
            
            {/* Cabeçalho */}
            <div className="modal-header bg-white border-bottom-0 pb-0">
              <div>
                <h5 className="modal-title fw-bold text-dark mb-1">Mapa de Espaços</h5>
                <p className="text-muted small">
                  Gerenciando: <span className="fw-bold text-primary">{feira.nome}</span>
                </p>
              </div>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>

            <div className="modal-body p-4">
              
              {/* Formulário de Cadastro */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 text-secondary">
                    <i className="bi bi-plus-square-dotted me-2"></i> Cadastrar Novo Espaço
                  </h6>
                  <form onSubmit={handleAdicionar} className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Identificação</label>
                      <input 
                        type="text" name="nome" className="form-control custom-input" 
                        placeholder="Ex: Box A-01" 
                        value={novoEspaco.nome} onChange={handleInputChange} required 
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Localização Física</label>
                      <input 
                        type="text" name="local" className="form-control custom-input" 
                        placeholder="Ex: Setor de Comidas" 
                        value={novoEspaco.local} onChange={handleInputChange} required 
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold text-muted">Tamanho</label>
                      <input 
                        type="text" name="dimensao" className="form-control custom-input" 
                        placeholder="Ex: 3x3m" 
                        value={novoEspaco.dimensao} onChange={handleInputChange} 
                      />
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn custom-btn-primary w-100 fw-bold">
                        <i className="bi bi-save me-1"></i> Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Lista de Espaços */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold m-0">Espaços da Feira</h6>
                <span className="badge bg-light text-dark border">
                  Total: {espacos.length} | Livres: {espacos.filter(e => e.status === 'LIVRE').length}
                </span>
              </div>

              <div className="table-responsive border rounded bg-white" style={{ maxHeight: '400px' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th className="ps-4">Identificação</th>
                      <th>Localização</th>
                      <th>Dimensão</th>
                      <th className="text-center">Status</th>
                      <th className="text-end pe-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan="5" className="text-center py-5">Carregando...</td></tr>
                    ) : espacos.length > 0 ? (
                      espacos.map(espaco => (
                        <tr key={espaco.id}>
                          <td className="ps-4 fw-bold text-dark">{espaco.nome}</td>
                          <td className="text-muted">{espaco.local}</td>
                          <td><small className="badge bg-light text-secondary border">{espaco.dimensao || '-'}</small></td>
                          <td className="text-center">{getStatusBadge(espaco.status)}</td>
                          
                          <td className="text-end pe-4">
                            {/* Botão de Alterar Status (Ocupar/Liberar) */}
                            <button 
                              className={`btn btn-sm me-2 ${espaco.status === 'LIVRE' ? 'btn-outline-success' : 'btn-outline-warning'}`}
                              onClick={() => handleToggleStatus(espaco)}
                              title={espaco.status === 'LIVRE' ? "Ocupar Espaço" : "Liberar Espaço"}
                            >
                              <i className={`bi ${espaco.status === 'LIVRE' ? 'bi-person-plus-fill' : 'bi-person-dash'}`}></i>
                            </button>

                            {/* Botão de Excluir */}
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleExcluir(espaco.id)}
                              title="Excluir Espaço"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          <i className="bi bi-layout-text-window display-6 d-block mb-3 opacity-25"></i>
                          Nenhum espaço cadastrado nesta feira.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
            
            <div className="modal-footer border-0 bg-light">
              <button type="button" className="btn btn-secondary px-4" onClick={handleClose}>Fechar</button>
            </div>

          </div>
        </div>
      </div>

      {/* Modais de Feedback (Sucesso/Erro) */}
      <SuccessModal 
        show={feedback.showSuccess} 
        handleClose={() => setFeedback({ ...feedback, showSuccess: false })} 
        message={feedback.msg} 
      />
      <ErrorModal 
        show={feedback.showError} 
        handleClose={() => setFeedback({ ...feedback, showError: false })} 
        message={feedback.msg} 
      />
    </>
  );
};

export default EspacosModal;