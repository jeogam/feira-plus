// src/components/common/SuccessModal.jsx
import React from 'react';

const SuccessModal = ({ show, handleClose, title = "Sucesso!", message }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-modal-content text-center">
          <div className="modal-body p-4">
            {/* Ícone de Check Verde */}
            <i className="bi bi-check-circle-fill modal-icon text-success"></i>
            
            <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
              {title}
            </h4>
            
            <p className="text-center-body mb-4">
              {message}
            </p>

            <button 
              type="button" 
              className="btn custom-btn-primary w-100" 
              onClick={handleClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;