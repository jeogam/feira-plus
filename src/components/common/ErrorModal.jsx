import React from 'react';

const ErrorModal = ({ show, handleClose, title = "Ocorreu um erro", message }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-modal-content text-center">
          <div className="modal-body p-4">
            {/* Ícone de Alerta Vermelho */}
            <i className="bi bi-x-circle-fill modal-icon text-danger"></i>
            
            <h4 className="fw-bold mb-3 text-danger">
              {title}
            </h4>
            
            <p className="text-center-body mb-4">
              {message}
            </p>

            <button 
              type="button" 
              className="btn btn-outline-danger w-100 fw-bold" 
              onClick={handleClose}
              style={{ borderRadius: '10px' }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;