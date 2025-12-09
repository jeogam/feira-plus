import React, { useState, useEffect } from 'react';

// Adiciona as novas props: expositoresDisponiveis e loadingExpositores
const FeiraFormModal = ({ show, handleClose, handleSave, feiraParaEditar, expositoresDisponiveis = [], loadingExpositores = false }) => {
  
  // Enum de Frequências
  const frequencias = [
    "DIARIO", "SEMANAL", "QUINZENAL", "MENSAL", 
    "BIMESTRAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"
  ];

  const initialFormState = {
    tipo: 'EVENTO',
    nome: '',
    local: '',
    espacos: 0, 
    horaAbertura: '',
    horaFechamento: '',
    dataInicio: '',
    dataFim: '',
    frequencia: 'SEMANAL',
    // NOVO CAMPO: Lista de IDs de expositores selecionados
    expositorIds: [], 
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (feiraParaEditar) {
      const tipoDetectado = feiraParaEditar.frequencia ? 'PERMANENTE' : 'EVENTO';
      
      // Mapeia a lista de objetos expositores (que vem na resposta) para uma lista de IDs (Long)
      const idsAtuais = feiraParaEditar.expositores 
          ? feiraParaEditar.expositores.map(exp => exp.id)
          : [];
          
      setFormData({ 
          ...feiraParaEditar, 
          tipo: tipoDetectado, 
          espacos: Number(feiraParaEditar.espacos || 0),
          expositorIds: idsAtuais // Define os IDs para pre-seleção
      });
    } else {
      setFormData(initialFormState);
    }
  }, [feiraParaEditar, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'expositorIds') {
        // Lógica para Multi-Select: extrai todos os valores selecionados como array de IDs (Number)
        const selectedOptions = Array.from(e.target.options)
            .filter(option => option.selected)
            .map(option => Number(option.value)); 
        setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
        // Para outros campos
        const finalValue = name === 'espacos' ? Number(value) : value; 
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dadosFinais = { ...formData };
    
    // Limpeza de campos específicos que não se aplicam ao tipo
    if (formData.tipo === 'EVENTO') {
      delete dadosFinais.frequencia;
    } else {
      delete dadosFinais.dataInicio;
      delete dadosFinais.dataFim;
    }
    
    // Envia o DTO completo (que inclui 'expositorIds') para o componente pai
    handleSave(dadosFinais);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-xl"> {/* Aumentado para XL */}
        <div className="modal-content custom-modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold" style={{ color: 'var(--primary-color)' }}>
              {feiraParaEditar ? 'Editar Feira' : 'Nova Feira'}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              
              {/* Seleção do Tipo de Feira (Apenas na criação) */}
              {!feiraParaEditar && (
                <div className="mb-4 p-3 bg-light rounded border">
                  <label className="form-label fw-bold d-block">Tipo de Feira</label>
                  <div className="form-check form-check-inline">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tipo" 
                      id="tipoEvento" 
                      value="EVENTO" 
                      checked={formData.tipo === 'EVENTO'} 
                      onChange={handleChange} 
                    />
                    <label className="form-check-label" htmlFor="tipoEvento">Feira Evento (Datas Específicas)</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tipo" 
                      id="tipoPermanente" 
                      value="PERMANENTE" 
                      checked={formData.tipo === 'PERMANENTE'} 
                      onChange={handleChange} 
                    />
                    <label className="form-check-label" htmlFor="tipoPermanente">Feira Permanente (Recorrente)</label>
                  </div>
                </div>
              )}

              {/* CAMPOS PRINCIPAIS */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nome da Feira</label>
                  <input type="text" name="nome" className="form-control custom-input" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Local</label>
                  <input type="text" name="local" className="form-control custom-input" value={formData.local} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Hora Abertura</label>
                  <input type="time" name="horaAbertura" className="form-control custom-input" value={formData.horaAbertura} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Hora Fechamento</label>
                  <input type="time" name="horaFechamento" className="form-control custom-input" value={formData.horaFechamento} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Total de Espaços</label>
                  <input 
                    type="number" 
                    name="espacos" 
                    className="form-control custom-input" 
                    value={formData.espacos} 
                    onChange={handleChange} 
                    min="0"
                    required 
                  />
                </div>
              </div>
              
              {/* DADOS ESPECÍFICOS (EVENTO/PERMANENTE) */}
              <hr />
              <div className="row">
                <div className="col-md-6">
                  {formData.tipo === 'EVENTO' ? (
                    <div className="row fade-in">
                      <h6 className="text-muted mb-3">Datas do Evento</h6>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Data Início</label>
                        <input type="date" name="dataInicio" className="form-control custom-input" value={formData.dataInicio} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Data Fim</label>
                        <input type="date" name="dataFim" className="form-control custom-input" value={formData.dataFim} onChange={handleChange} required />
                      </div>
                    </div>
                  ) : (
                    <div className="row fade-in">
                      <h6 className="text-muted mb-3">Frequência</h6>
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Frequência</label>
                        <select name="frequencia" className="form-select custom-input" value={formData.frequencia} onChange={handleChange} required>
                          {frequencias.map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              
                {/* SELEÇÃO DE EXPOSITORES (NOVA SEÇÃO na mesma linha, para telas maiores) */}
                <div className="col-md-6">
                    <h6 className="text-muted mb-3">Expositores Participantes</h6>
                    <div className="col-12 mb-3">
                        <label className="form-label fw-bold">Selecione (Ctrl/Cmd para múltiplos)</label>
                        
                        {loadingExpositores ? (
                            <div className="text-center text-muted">Carregando lista de expositores...</div>
                        ) : (
                            <select 
                                name="expositorIds" 
                                className="form-select custom-input" 
                                multiple 
                                value={formData.expositorIds.map(String)} // Mapeia para string para o select funcionar com números
                                onChange={handleChange}
                                size="8" // Define o número de itens visíveis
                                style={{ minHeight: '200px' }} // Altura mínima para melhor usabilidade
                            >
                                {expositoresDisponiveis.map(exp => (
                                    <option key={exp.id} value={exp.id}>
                                        {exp.nome}
                                    </option>
                                ))}
                            </select>
                        )}
                        <div className="form-text text-muted">Use Ctrl/Cmd para selecionar ou desmarcar múltiplos expositores.</div>
                    </div>
                </div>
              </div>


              {/* RODAPÉ E BOTÕES */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light" onClick={handleClose}>Cancelar</button>
                <button type="submit" className="btn custom-btn-primary fw-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeiraFormModal;