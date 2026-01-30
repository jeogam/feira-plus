import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

import Register from "./pages/Register"; 
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import HomeLayout from "./components/HomeLayout";
import Dashboard from "./pages/Home/Dashboard";
import GestaoFeiras from "./pages/GestaoFeiras"; 
import Relatorios from "./pages/Relatorios"; 
import GestaoExpositores from "./pages/GestaoExpositores"; 
import GestaoUsuarios from "./pages/GestaoUsuarios";
import GestaoCategorias from "./pages/GestaoCategorias";
import HomePublica from "./pages/HomePublica"; 
import { AuthContext } from "./context/AuthContext";
import "./styles/App.css";

// --- COMPONENTE INTERNO: ÁREA ADMINISTRATIVA (LOGADA) ---
// Extraí isso para limpar as Rotas principais
const AdminArea = () => {
  const { user, logout } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigate = (pageId) => {
    if (pageId === "sair") {
      logout();
      return; // O AuthContext limpa o user e o Router redireciona pra Home
    }
    setCurrentPage(pageId);
  };

  return (
    <div className="app-container">
      <Sidebar
        activePage={currentPage}
        onNavigate={handleNavigate}
        userName={user?.nome || "Usuário"}
        userRole={user?.perfilUsuario || "Usuário"}
      />
      <HomeLayout>
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "feiras" && <GestaoFeiras />}
        {currentPage === "relatorios" && <Relatorios />}
        {currentPage === "expositores" && <GestaoExpositores />}
        {currentPage === "usuarios" && <GestaoUsuarios />}
        {currentPage === "categorias" && <GestaoCategorias />}
      </HomeLayout>
    </div>
  );
};

// --- COMPONENTE INTERNO: ROTA PROTEGIDA ---
// Só deixa acessar se tiver usuário, senão manda pro Login
const RotaProtegida = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* ROTA 1: HOME PÚBLICA (Endereço: /) */}
        <Route 
          path="/" 
          element={ user ? <Navigate to="/painel" /> : <HomePublica /> } 
        />

        {/* ROTA 2: LOGIN (Endereço: /login) */}
        <Route 
          path="/login" 
          element={ user ? <Navigate to="/painel" /> : <Login /> } 
        />

        {/* ROTA 3: REGISTRO (Endereço: /register) */}
        <Route 
          path="/register" 
          element={ user ? <Navigate to="/painel" /> : <Register /> } 
        />

        {/* ROTA 4: ÁREA DO SISTEMA (Endereço: /painel) */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <AdminArea />
            </RotaProtegida>
          } 
        />

        {/* ROTA CORINGA: Qualquer erro volta pra Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;