import React, { useState } from 'react';
import '../styles/Login.css'; 
import '../styles/App.css';
import api from "../services/api"; 
import SuccessModal from '../components/common/SuccessModal';
import ErrorModal from '../components/common/ErrorModal';

function Register({ onSwitchToLogin }) {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [successState, setSuccessState] = useState({ show: false, message: '' });
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorState({ show: false, message: '' });

    if (password !== confirmPassword) {
      setErrorState({ show: true, message: 'As senhas não coincidem.' });
      return;
    }

    try {
      const payload = {
        nome,
        email,
        senha: password,
        perfilUsuario: perfil 
      };

      await api.post("/usuarios/register", payload);

      setSuccessState({
        show: true,
        message: 'Conta criada com sucesso! Redirecionando...'
      });

      // Limpa form
      setNome(''); setEmail(''); setPerfil(''); setPassword(''); setConfirmPassword('');

      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
      }, 2000);

    } catch (err) {
      console.error(err);
      const msgErro = err.response?.data?.message || 'Erro ao criar conta.';
      setErrorState({ show: true, message: msgErro });
    }
  };

  return (
    <div className="custom-login-container d-flex justify-content-center align-items-center">
      
      {/* MUDANÇA AQUI: Adicionei a classe 'custom-register-card' 
          que definimos no CSS para deixar o card mais largo 
      */}
      <div className="card custom-login-card custom-register-card">
        <div className="card-body p-4">

          <h2 className="card-title text-center mb-4 custom-login-title">
            Crie sua Conta
          </h2>

          <form onSubmit={handleSubmit}>
            
            {/* LINHA 1: Nome e Email lado a lado */}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="nome" className="form-label fw-bold">Nome Completo</label>
                    <input
                        type="text"
                        className="form-control form-control-lg custom-input"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        placeholder="Seu Nome"
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label fw-bold">Email</label>
                    <input
                        type="email"
                        className="form-control form-control-lg custom-input"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="email@exemplo.com"
                    />
                </div>
            </div>

            {/* LINHA 2: Perfil (Ocupando largura total ou metade, se preferir) */}
            <div className="row">
                <div className="col-12 mb-3">
                    <label htmlFor="perfil" className="form-label fw-bold">Perfil</label>
                    <input
                        type="text"
                        className="form-control form-control-lg custom-input"
                        id="perfil"
                        value={perfil}
                        onChange={(e) => setPerfil(e.target.value)}
                        required
                        placeholder="Ex: ADMIN ou USUARIO"
                    />
                </div>
            </div>

            {/* LINHA 3: Senhas lado a lado */}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label fw-bold">Senha</label>
                    <div className="input-group input-group-lg">
                        <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="********"
                        />
                        <button
                        className="btn btn-password-toggle"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-bold">Confirme sua Senha</label>
                    <div className="input-group input-group-lg">
                        <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control password-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="********"
                        />
                        <button
                        className="btn btn-password-toggle"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTÕES */}
            <div className="row mt-2">
                <div className="col-12">
                    <button
                    type="submit"
                    className="btn btn-lg w-100 fw-bold custom-btn-primary"
                    >
                    Cadastrar
                    </button>
                </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted me-2">Já tem uma conta?</span>
              <a
                href="#"
                className="custom-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSwitchToLogin) onSwitchToLogin();
                }}
              >
                Entrar
              </a>
            </div>

          </form>
        </div>
      </div>

      <SuccessModal
        show={successState.show}
        message={successState.message}
        handleClose={() => setSuccessState({ ...successState, show: false })}
      />

      <ErrorModal
        show={errorState.show}
        message={errorState.message}
        handleClose={() => setErrorState({ ...errorState, show: false })}
      />

    </div>
  );
}

export default Register;