import React from "react";
// Se você não importou o CSS globalmente, importe aqui:
// import '../../styles/App.css';

const SuccessModal = ({ show, handleClose, title = "Sucesso!", message }) => {
  if (!show) return null;

  return (
    <div
      className="modal d-block fade show"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-modal-content text-center">
          <div className="modal-body p-4">
            {/* --- ÍCONE COM ANIMAÇÃO --- */}
            <div className="mb-3">
              {/* Adicionei a classe 'animate-success-icon' aqui */}
              {/* Substitua o <i className="bi..."> pelo SVG abaixo */}
              <div className="mb-3">
                <svg
                  className="checkmark-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>{" "}
            </div>

            <h4
              className="fw-bold mb-3"
              style={{ color: "var(--primary-color)" }}
            >
              {title}
            </h4>

            <p className="text-center-body mb-4">{message}</p>

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
