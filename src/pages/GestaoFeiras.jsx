import React, { useState, useEffect, useContext } from 'react';
import FeiraFormModal from '../components/feiras/FeiraFormModal'; 
import ConfirmationModal from '../components/common/ConfirmationModal';
import SuccessModal from '../components/common/SuccessModal';
// import ErrorModal from '../../components/common/ErrorModal'; // Se tiver, descomente
import { FeiraService } from '../services/FeiraService'; 
import { AuthContext } from '../context/AuthContext'; // <--- 1. Import do Contexto

const GestaoFeiras = () => {
  const { user } = useContext(AuthContext); // <--- 2. Pega o usuário logado
  
  const [feiras, setFeiras] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  const [feiraSelecionada, setFeiraSelecionada] = useState(null);
  const [mensagemModal, setMensagemModal] = useState('');

  // --- Carregar Dados do Backend ---
  const carregarFeiras = async () => {
    setLoading(true);
    try {
      const dados = await FeiraService.listarTodas();
      setFeiras(dados);
    } catch (error) {
      setMensagemModal("Não foi possível carregar as feiras. Verifique se o servidor está rodando.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFeiras();
  }, []);

  // --- Handlers ---

  const handleNovo = () => {
    setFeiraSelecionada(null);
    setShowFormModal(true);
  };

  const handleEditar = (feira) => {
    setFeiraSelecionada(feira);
    setShowFormModal(true);
  };

  const handleConfirmarExclusao = (feira) => {
    setFeiraSelecionada(feira);
    setShowDeleteModal(true);
  };

  // Salvar ou Atualizar
  const handleSalvar = async (dadosFeira) => {
    // Verificação de segurança: Usuário existe?
    if (!user || !user.id) {
        setMensagemModal("Erro: Usuário não identificado. Faça login novamente.");
        setShowErrorModal(true);
        return;
    }

    try {
      if (feiraSelecionada) {
        // Atualizar - Passamos o ID do usuário também
        await FeiraService.atualizar(feiraSelecionada.id, dadosFeira, user.id);
        setMensagemModal('Feira atualizada com sucesso!');
      } else {
        // Criar Nova - Passamos o ID do usuário logado aqui!
        await FeiraService.salvar(dadosFeira, user.id); 
        setMensagemModal('Feira cadastrada com sucesso!');
      }
      
      // Fecha modal e recarrega lista
      setShowFormModal(false); 
      setShowSuccessModal(true);
      carregarFeiras(); 
    } catch (error) {
      console.error(error);
      setMensagemModal("Erro ao salvar os dados. Verifique os campos.");
      setShowErrorModal(true);
    }
  };

  // Excluir
  const handleExcluir = async () => {
    try {
      if (feiraSelecionada) {
        await FeiraService.excluir(feiraSelecionada.id, feiraSelecionada.tipo);
        setMensagemModal('Feira removida com sucesso!');
        setShowSuccessModal(true);
        carregarFeiras();
      }
    } catch (error) {
      console.error(error);
      setMensagemModal("Erro ao excluir a feira.");
      setShowErrorModal(true);
    }
  };

  // --- Filtros e Renderização ---

  const feirasFiltradas = feiras.filter(feira => 
    feira.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    feira.local?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const renderDetalhesData = (feira) => {
    if (feira.tipo === 'PERMANENTE') {
      return <span className="badge bg-info text-dark">{feira.frequencia}</span>;
    } else {
      return (
        <small className="text-muted">
          {feira.dataInicio} até {feira.dataFim}
        </small>
      );
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#1F2A37' }}>Gestão de Feiras</h2>
        <button className="btn custom-btn-primary" onClick={handleNovo}>
          <i className="bi bi-plus-lg me-2"></i> Nova Feira
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-start-0 ps-0" 
              placeholder="Buscar por nome ou local..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Nome</th>
                  <th>Local</th>
                  <th>Tipo / Detalhes</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="6" className="text-center py-4">Carregando...</td></tr>
                ) : feirasFiltradas.length > 0 ? (
                  feirasFiltradas.map((feira) => (
                    <tr key={`${feira.tipo}-${feira.id}`}>
                      <td className="ps-4 fw-bold text-dark">{feira.nome}</td>
                      <td>{feira.local}</td>
                      <td>{renderDetalhesData(feira)}</td>
                      <td>
                        <i className="bi bi-clock me-1 text-muted"></i>
                        {feira.horaAbertura} - {feira.horaFechamento}
                      </td>
                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(feira)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleConfirmarExclusao(feira)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">Nenhuma feira encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modais */}
      <FeiraFormModal 
        show={showFormModal}
        handleClose={() => setShowFormModal(false)}
        handleSave={handleSalvar}
        feiraParaEditar={feiraSelecionada}
      />

      <ConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={handleExcluir}
        title="Excluir Feira"
        message={`Tem certeza que deseja excluir "${feiraSelecionada?.nome}"?`}
      />

      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        message={mensagemModal}
      />
      
      {showErrorModal && (
        <div className="alert alert-danger fixed-bottom m-4" role="alert">
           {mensagemModal}
           <button type="button" className="btn-close float-end" onClick={() => setShowErrorModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default GestaoFeiras;