// Importa o React e hooks essenciais
import React, { useState, useContext } from 'react';

// Importa os arquivos de estilo
import '../styles/Login.css'; 
import '../styles/App.css';

// Importa o contexto de autenticação e o serviço de requisições
import { AuthContext } from "../context/AuthContext.jsx";
import { apiFetch } from "../services/api";

// Importa os componentes de modais usados na tela
import ForgotPasswordModal from '../components/Login/ForgotPasswordModal';
import SuccessModal from '../components/common/SuccessModal';
import ErrorModal from '../components/common/ErrorModal';

// O componente Login recebe a prop 'onLogin', enviada pelo App.js
function Login({ onLogin }) {

  // --- ESTADOS DO FORMULÁRIO ---
  const [email, setEmail] = useState('');              // Campo do e-mail
  const [password, setPassword] = useState('');        // Campo da senha
  const [showPassword, setShowPassword] = useState(false); // Controla se a senha aparece ou não

  // --- ESTADOS DOS MODAIS ---
  const [showForgotModal, setShowForgotModal] = useState(false); // Modal de "Esqueci a senha"

  // Estado para modal de sucesso
  const [successState, setSuccessState] = useState({
    show: false,
    message: ''
  });

  // Estado para modal de erro
  const [errorState, setErrorState] = useState({
    show: false,
    message: ''
  });

  // --- CONTEXTO DE AUTENTICAÇÃO ---
  // Pega a função login() que atualiza o estado global do usuário
  const { login } = useContext(AuthContext);

  // --- FUNÇÃO DE LOGIN ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita reload da página no submit
    
    setErrorState({ show: false, message: '' }); // Limpa erros anteriores

    try {
      // 1. Envia email + senha para a API
      const data = await apiFetch("/autenticacao/login", {
        method: "POST",
        body: JSON.stringify({ email: email, senha: password }),
      });

      // 2. Salva o token recebido no localStorage
      localStorage.setItem("feiraPlus_token", data.token);

      // 3. Busca dados do usuário autenticado
      const dadosUsuario = await apiFetch("/usuarios/me");

      // 4. Atualiza o contexto com token + dados do usuário
      login(data.token, dadosUsuario);

      // 5. Exibe o modal de sucesso
      setSuccessState({
        show: true,
        message: 'Login realizado com sucesso! Entrando...'
      });

      // 6. Após 1.5s, chama a função do App.js para mudar tela
      setTimeout(() => {
        if (onLogin) {
          onLogin();
        }
      }, 1500);

    } catch (err) {
      console.error(err);

      // Remove token caso a API tenha retornado erro
      localStorage.removeItem("feiraPlus_token");

      // Mostra modal de erro com mensagem padrão
      setErrorState({
        show: true,
        message: 'Falha no login. Verifique seu e-mail e senha.'
      });
    }
  };

  return (
    // Container principal com fundo escuro
    <div className="custom-login-container d-flex justify-content-center align-items-center">
      
      {/* Card branco onde fica o formulário */}
      <div className="card custom-login-card">
        <div className="card-body">

          <h2 className="card-title text-center mb-5 custom-login-title">
            Acesse a sua Conta
          </h2>

          {/* Formulário principal */}
          <form onSubmit={handleSubmit}>

            {/* INPUT DO E-MAIL */}
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

            {/* INPUT DA SENHA + ÍCONE DE MOSTRAR/OCULTAR */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold">
                Senha
              </label>

              <div className="input-group input-group-lg">
                <input
                  type={showPassword ? 'text' : 'password'}  // alterna visibilidade
                  className="form-control password-input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />

                {/* Botão do olho (mostrar/ocultar senha) */}
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

            {/* BOTÃO DE LOGIN */}
            <button
              type="submit"
              className="btn btn-lg w-100 fw-bold mt-4 custom-btn-primary"
            >
              Entrar
            </button>

            {/* LINK "ESQUECI A SENHA" */}
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

      {/* --- MODAIS --- */}

      {/* Modal de recuperação de senha */}
      <ForgotPasswordModal
        show={showForgotModal}
        handleClose={() => setShowForgotModal(false)}
      />

      {/* Modal de sucesso genérico */}
      <SuccessModal
        show={successState.show}
        message={successState.message}
        handleClose={() => setSuccessState({ ...successState, show: false })}
      />

      {/* Modal de erro genérico */}
      <ErrorModal
        show={errorState.show}
        message={errorState.message}
        handleClose={() => setErrorState({ ...errorState, show: false })}
      />

    </div>
  );
}

export default Login;
