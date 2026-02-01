import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // ✅ Importando Contexto

const PublicNavbar = ({ onNavigateLogin }) => {
  const { user, logout } = useContext(AuthContext); // Pega o user do contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Garante que fica na home
  };

  const handleGoToPanel = () => {
    navigate('/painel');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="#" style={{ color: '#1e2939' }}>
          <i className="fas fa-store me-2 text-primary"></i> 
          Feira<span className="text-primary">+</span>
        </a>
        
        <div className="d-flex gap-2">
          
          {/* SE ESTIVER LOGADO */}
          {user ? (
            <>
              <span className="d-flex align-items-center me-3 fw-bold text-muted">
                Olá, {user.nome?.split(' ')[0]}
              </span>

              {/* SE FOR ADMIN: Botão Painel */}
              {user.perfilUsuario === 'ADMIN' && (
                <button 
                  className="btn btn-success rounded-pill px-4 fw-bold text-white" 
                  onClick={handleGoToPanel}
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Painel
                </button>
              )}

              {/* PARA TODOS LOGADOS: Botão Sair */}
              <button 
                className="btn btn-outline-danger rounded-pill px-4 fw-bold" 
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Sair
              </button>
            </>
          ) : (
            
            /* SE NÃO ESTIVER LOGADO */
            <>
              <button 
                className="btn btn-outline-primary rounded-pill px-4 fw-bold" 
                onClick={onNavigateLogin}
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Entrar
              </button>

              <button 
                className="btn btn-primary rounded-pill px-4 fw-bold" 
                onClick={onNavigateLogin}
                style={{ backgroundColor: '#1e2939', borderColor: '#1e2939' }}
              >
                <i className="fas fa-user-shield me-2"></i>
                ADMs
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;