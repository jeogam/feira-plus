import React, { useState } from 'react';
// Importa o CSS com as cores e estilos corrigidos
import '../styles/Login.css'; 
import '../styles/App.css'

// Importa os Componentes Modais
import ForgotPasswordModal from '../components/Login/ForgotPasswordModal';
import SuccessModal from '../components/common/SuccessModal';
import ErrorModal from '../components/common/ErrorModal';

function Login() {
  // --- Estados do Formulário ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  // --- Estados de Controle dos Modais ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  // Estado para controlar mensagens de sucesso e erro
  const [successState, setSuccessState] = useState({ show: false, message: '' });
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  // --- Handlers ---

  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    // Simulação de Validação
    if (email === 'teste@exemplo.com' && password === 'senha123') {
      // Abre o Modal de Sucesso
      setSuccessState({ 
        show: true, 
        message: 'Login realizado com sucesso! Redirecionando...' 
      });
    
    } else {
      // Abre o Modal de Erro
      setErrorState({ 
        show: true, 
        message: 'E-mail ou senha incorretos. Por favor, verifique suas credenciais.' 
      });
    }
  };

  return (
    // Container Principal (Fundo Escuro)
    <div className="custom-login-container d-flex justify-content-center align-items-center">
      
      {/* Card do Formulário (Fundo Branco) */}
      <div className="card custom-login-card"> 
        <div className="card-body">
          <h2 className="card-title text-center mb-5 custom-login-title"> 
            Acesse a sua Conta
          </h2>

          <form onSubmit={handleSubmit}>
            
            {/* Campo de E-mail */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-bold"> 
                Email
              </label>
              <input
                type="email"
                className="form-control form-control-lg custom-input" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu.email@exemplo.com"
              />
            </div>

            {/* Campo de Senha com Ícone de Olho */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold">
                Senha
              </label>
              <div className="input-group input-group-lg"> 
                <input
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control password-input" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                <button
                  className="btn d-flex align-items-center justify-content-center btn-password-toggle" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Botão de Submissão */}
            <button 
              type="submit" 
              className="btn btn-lg w-100 fw-bold mt-4 custom-btn-primary" 
            >
              Entrar
            </button>
            
            {/* Link "Esqueceu a senha?" */}
            <div className="text-center mt-4">
                 <a 
                    href="#" 
                    className="custom-link" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setShowForgotModal(true); 
                    }}
                 >
                    Esqueceu a senha?
                 </a>
            </div>
          </form>
        </div>
      </div>

      {/* --- RENDERIZAÇÃO DOS MODAIS --- */}

      {/* 1. Modal de Recuperação de Senha */}
      <ForgotPasswordModal 
        show={showForgotModal} 
        handleClose={() => setShowForgotModal(false)} 
      />

      {/* 2. Modal de Sucesso (Common) */}
      <SuccessModal 
        show={successState.show} 
        message={successState.message}
        handleClose={() => setSuccessState({ ...successState, show: false })}
      />

      {/* 3. Modal de Erro (Common) */}
      <ErrorModal 
        show={errorState.show} 
        message={errorState.message}
        handleClose={() => setErrorState({ ...errorState, show: false })}
      />

    </div>
  );
}

export default Login;