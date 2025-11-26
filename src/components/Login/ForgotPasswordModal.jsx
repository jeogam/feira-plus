import React, { useState } from 'react';
import SuccessModal from '../common/SuccessModal';
import ErrorModal from '../common/ErrorModal';

function ForgotPasswordModal({ show, handleClose }) {
  const [forgotEmail, setForgotEmail] = useState('');

  // Estados locais para controlar os modais de feedback dentro deste modal
  const [successState, setSuccessState] = useState({ show: false, message: '' });
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  if (!show) {
    return null; 
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    // Simulação simples de validação/envio
    if (forgotEmail.trim() !== "") {
      // SUCESSO: Abre o modal de sucesso
      setSuccessState({
        show: true,
        message: `Enviamos um link de recuperação para: ${forgotEmail}`
      });
    } else {
      // ERRO: Abre o modal de erro 
      setErrorState({
        show: true,
        message: "Por favor, insira um e-mail válido."
      });
    }
  };

  // Função para fechar tudo quando o usuário der OK no sucesso
  const handleSuccessClose = () => {
    setSuccessState({ ...successState, show: false });
    setForgotEmail(''); 
    handleClose();
  };

  return (
    <>

      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content custom-modal-content">
            
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" style={{ color: 'var(--primary-color)' }}>
                Recuperar Senha
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              <p className="text-muted mb-3">
                Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
              </p>
              <form onSubmit={handleForgotSubmit}>
                <div className="mb-3">
                  <label htmlFor="forgotEmail" className="form-label fw-bold">Email de recuperação</label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="exemplo@email.com"
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn custom-btn-primary fw-bold">
                    Enviar Link
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-light text-muted" 
                    onClick={handleClose}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <SuccessModal 
        show={successState.show} 
        message={successState.message}
        handleClose={handleSuccessClose} 
      />

      {/* Modal de Erro */}
      <ErrorModal 
        show={errorState.show} 
        message={errorState.message}
        handleClose={() => setErrorState({ ...errorState, show: false })} // Apenas fecha o erro, mantém o form aberto
      />
    </>
  );
}

export default ForgotPasswordModal;