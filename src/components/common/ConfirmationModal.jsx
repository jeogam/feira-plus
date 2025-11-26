// src/components/common/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ show, handleClose, onConfirm, title = "Confirmação", message }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-modal-content">
          <div className="modal-body p-4 text-center">
            {/* Ícone de Pergunta Azul */}
            <i className="bi bi-question-circle-fill modal-icon text-primary"></i>
            
            <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
              {title}
            </h4>
            
            <p className="text-center-body mb-4">
              {message}
            </p>

            <div className="d-flex gap-2 justify-content-center">
              <button 
                type="button" 
                className="btn btn-light w-50 fw-bold" 
                onClick={handleClose}
                style={{ borderRadius: '10px', color: '#666' }}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn custom-btn-primary w-50" 
                onClick={() => {
                  onConfirm(); // Executa a ação de confirmação
                  handleClose(); // Fecha o modal
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;