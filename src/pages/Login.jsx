import React, { useState, useContext } from "react";

import "../styles/Login.css";
import "../styles/App.css";

import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api";

import ForgotPasswordModal from "../components/Login/ForgotPasswordModal";
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal";

// 1. ALTERAÇÃO AQUI: Adicionei 'onSwitchToRegister' nas props recebidas
function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);

  const [successState, setSuccessState] = useState({
    show: false,
    message: "",
  });
  const [errorState, setErrorState] = useState({ show: false, message: "" });

  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorState({ show: false, message: "" });

    try {
      const data = await api.post("/autenticacao/login", {
        email: email,
        senha: password,
      });

      localStorage.setItem("feiraPlus_token", data.token);

      const dadosUsuario = await api.get("/usuarios/me");

      setSuccessState({
        show: true,
        message: "Login realizado com sucesso! Entrando...",
      });

      setTimeout(() => {
        login(data.token, dadosUsuario);
        if (onLogin) {
          onLogin();
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("feiraPlus_token");
      setErrorState({
        show: true,
        message: "Falha no login. Verifique seu e-mail e senha.",
      });
    }
  };

  return (
    <div className="custom-login-container d-flex justify-content-center align-items-center">
      <div className="card custom-login-card">
        <div className="card-body">
          <h2 className="card-title text-center mb-5 custom-login-title">
            Acesse a sua Conta
          </h2>

          <form onSubmit={handleSubmit}>
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

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold">
                Senha
              </label>
              <div className="input-group input-group-lg">
                <input
                  type={showPassword ? "text" : "password"}
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
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 fw-bold mt-4 custom-btn-primary"
            >
              Entrar
            </button>

            {/* Link "Esqueceu a senha?" */}
            <div className="text-center mt-3">
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

      <ForgotPasswordModal
        show={showForgotModal}
        handleClose={() => setShowForgotModal(false)}
      />

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

export default Login;
