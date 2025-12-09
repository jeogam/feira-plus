import { useState, useContext } from "react";

import Register from "./pages/Register"; 
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import HomeLayout from "./components/HomeLayout";
import Dashboard from "./pages/Home/Dashboard";
import GestaoFeiras from "./pages/GestaoFeiras"; 
import Relatorios from "./pages/Relatorios"; 
import GestaoExpositores from "./pages/GestaoExpositores"; 

import { AuthContext } from "./context/AuthContext";
import "./styles/App.css";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import GestaoCategorias from "./pages/GestaoCategorias";

function App() {
  const { user, logout, loading } = useContext(AuthContext);

  // Controle simples da página interna (Dashboard, Feiras, etc.)
  const [currentPage, setCurrentPage] = useState("dashboard");

  // NOVO ESTADO: Controle para alternar entre Login e Cadastro
  const [isRegistering, setIsRegistering] = useState(false);

  // Tela de carregamento
  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  // --- LÓGICA DE AUTENTICAÇÃO ---
  // Se NÃO estiver logado, decide se mostra Login ou Register
  if (!user) {
    if (isRegistering) {
      // Mostra a tela de Registro e passa a função para voltar ao Login
      return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
    } else {
      // Mostra a tela de Login e passa a função para ir ao Registro
      return (
        <Login 
          onLogin={() => {}} // O contexto atualiza o user, o redirecionamento é automático
          onSwitchToRegister={() => setIsRegistering(true)} 
        />
      );
    }
  }

  // --- ÁREA LOGADA (DASHBOARD) ---
  
  // Navegação da sidebar
  const handleNavigate = (pageId) => {
    if (pageId === "sair") {
      logout();
      setIsRegistering(false); // Reseta para login ao sair
      return;
    }
    setCurrentPage(pageId);
  };

  return (
    <div className="app-container">
      <Sidebar
        activePage={currentPage}
        onNavigate={handleNavigate}
        userName={user.nome}
        userRole={user.perfilUsuario || "Usuário"}
      />

      <HomeLayout>
        {currentPage === "feiras" && <GestaoFeiras />}

        {currentPage === "relatorios" && <Relatorios />}

        {currentPage === "expositores" && <GestaoExpositores />}

        {currentPage === "usuarios" && <GestaoUsuarios />}

        {currentPage === "categorias" && <GestaoCategorias />}


        {currentPage === "configuracoes" && (
          <div style={{ padding: "20px" }}>Configurações (Em construção)</div>
        )}
      </HomeLayout>
    </div>
  );
}

export default App;