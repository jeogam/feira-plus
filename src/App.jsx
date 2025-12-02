import { useState, useContext } from "react";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import HomeLayout from "./components/HomeLayout";
import Dashboard from "./pages/Home/Dashboard";
import GestaoFeiras from "./pages/GestaoFeiras"; 

import { AuthContext } from "./context/AuthContext";
import "./styles/App.css";

function App() {
  const { user, logout, loading } = useContext(AuthContext);

  // Controle simples da página atual
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Tela de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se NÃO estiver logado → tela de login
  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  // Navegação da sidebar
  const handleNavigate = (pageId) => {
    if (pageId === "sair") {
      logout();
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
        {currentPage === "dashboard" && <Dashboard />}

        {/* 🔥 AGORA FUNCIONA DE NOVO */}
        {currentPage === "feiras" && <GestaoFeiras />}

        {currentPage === "expositores" && (
          <div style={{ padding: "20px" }}>Expositores</div>
        )}

        {currentPage === "configuracoes" && (
          <div style={{ padding: "20px" }}>Configurações</div>
        )}
      </HomeLayout>
    </div>
  );
}

export default App;
