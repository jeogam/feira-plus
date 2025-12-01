import React, { useState, useEffect } from 'react';

const FeiraFormModal = ({ show, handleClose, handleSave, feiraParaEditar }) => {
  // Enum de Frequências conforme o Diagrama de Classes
  const frequencias = [
    "DIARIO", "SEMANAL", "QUINZENAL", "MENSAL", 
    "BIMESTRAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"
  ];

  const initialFormState = {
    tipo: 'EVENTO', // Padrão: EVENTO ou PERMANENTE
    nome: '',
    local: '',
    horaAbertura: '',
    horaFechamento: '',
    // Campos específicos de Evento
    dataInicio: '',
    dataFim: '',
    // Campos específicos de Permanente
    frequencia: 'SEMANAL'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (feiraParaEditar) {
      // Identifica o tipo baseado nos campos existentes
      const tipoDetectado = feiraParaEditar.frequencia ? 'PERMANENTE' : 'EVENTO';
      setFormData({ ...feiraParaEditar, tipo: tipoDetectado });
    } else {
      setFormData(initialFormState);
    }
  }, [feiraParaEditar, show]);

  const handleChange = (e) => {
    const {Kf, value } = e.target;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpeza de dados antes de salvar (remove campos inúteis para o tipo escolhido)
    const dadosFinais = { ...formData };
    if (formData.tipo === 'EVENTO') {
      delete dadosFinais.frequencia;
    } else {
      delete dadosFinais.dataInicio;
      delete dadosFinais.dataFim;
    }
    
    handleSave(dadosFinais);
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Aumentei para modal-lg */}
        <div className="modal-content custom-modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold" style={{ color: 'var(--primary-color)' }}>
              {feiraParaEditar ? 'Editar Feira' : 'Nova Feira'}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              
              {/* Seleção do Tipo de Feira (Apenas na criação para simplificar) */}
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

              {/* Campos Comuns (Classe Abstrata Feira) */}
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
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Hora Abertura</label>
                  <input type="time" name="horaAbertura" className="form-control custom-input" value={formData.horaAbertura} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Hora Fechamento</label>
                  <input type="time" name="horaFechamento" className="form-control custom-input" value={formData.horaFechamento} onChange={handleChange} required />
                </div>
              </div>

              <hr />

              {/* Renderização Condicional baseada no Tipo */}
              {formData.tipo === 'EVENTO' ? (
                <div className="row fade-in">
                  <h6 className="text-muted mb-3">Dados do Evento</h6>
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
                  <h6 className="text-muted mb-3">Dados de Recorrência</h6>
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

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light" onClick={handleClose}>Cancelar</button>
                <button type="submit" className="btn custom-btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeiraFormModal;