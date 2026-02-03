import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

// Páginas de Autenticação e Públicas
import Register from "./pages/Register"; 
import Login from "./pages/Login";
import HomePublica from "./pages/HomePublica"; 

// Componentes de Layout
import Sidebar from "./components/Sidebar";
import HomeLayout from "./components/HomeLayout";

// Páginas do Painel Administrativo
import Dashboard from "./pages/Home/Dashboard";
import GestaoFeiras from "./pages/GestaoFeiras"; 
import Relatorios from "./pages/Relatorios"; 
import GestaoExpositores from "./pages/GestaoExpositores"; 
import GestaoUsuarios from "./pages/GestaoUsuarios";
import GestaoCategorias from "./pages/GestaoCategorias";
import GestaoMensagens from "./pages/GestaoMensagens";
import GestaoEventos from "./pages/GestaoEventos"; 

// Contexto e Estilos
import { AuthContext } from "./context/AuthContext";
import "./styles/App.css";

// --- COMPONENTE DA ÁREA ADMINISTRATIVA ---
const AdminArea = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Define qual tela será renderizada dentro do painel
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
        {currentPage === "mensagens" && <GestaoMensagens />}
        {currentPage === "eventos" && <GestaoEventos />} 
      </HomeLayout>
    </div>
  );
};

// --- COMPONENTE DE PROTEÇÃO DE ROTAS ---
const RotaProtegida = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se for usuário comum, não deixa entrar no painel -> Manda pra Home
  if (user.perfilUsuario === 'USUARIO') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  const { user } = useContext(AuthContext);

  // Função auxiliar para redirecionar quem já está logado
  const getRedirectPath = () => {
    if (!user) return "/login";
    // Admin/Expositor vai pro painel, Usuário comum vai pra home
    return user.perfilUsuario === 'ADMIN' || user.perfilUsuario === 'EXPOSITOR' ? "/painel" : "/";
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rota Pública (Home do Site) */}
        <Route path="/" element={<HomePublica />} />

        {/* Login e Registro (Redirecionam se já logado) */}
        <Route 
          path="/login" 
          element={ user ? <Navigate to={getRedirectPath()} /> : <Login /> } 
        />

        <Route 
          path="/register" 
          element={ user ? <Navigate to={getRedirectPath()} /> : <Register /> } 
        />

        {/* Rota Privada (Painel Administrativo) */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <AdminArea />
            </RotaProtegida>
          } 
        />

        {/* Rota Coringa (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;