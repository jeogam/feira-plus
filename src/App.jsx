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

const AdminArea = () => {
  const { user, logout } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("dashboard");

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

// ✅ CORREÇÃO NA ROTA PROTEGIDA
const RotaProtegida = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // SE FOR USUÁRIO COMUM, NÃO DEIXA ENTRAR NO PAINEL -> MANDA PRA HOME
  if (user.perfilUsuario === 'USUARIO') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  // Função auxiliar para redirecionar quem já está logado
  const getRedirectPath = () => {
    if (!user) return "/login";
    // Admin vai pro painel, Usuário vai pra home
    return user.perfilUsuario === 'ADMIN' ? "/painel" : "/";
  };

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomePublica />} />

        {/* ✅ LOGIC: Redireciona baseado no perfil se já estiver logado */}
        <Route 
          path="/login" 
          element={ user ? <Navigate to={getRedirectPath()} /> : <Login /> } 
        />

        <Route 
          path="/register" 
          element={ user ? <Navigate to={getRedirectPath()} /> : <Register /> } 
        />

        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <AdminArea />
            </RotaProtegida>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;