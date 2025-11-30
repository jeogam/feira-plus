import { useState } from 'react'
import Login from "./pages/Login"
import Sidebar from './components/Sidebar'
import HomeLayout from './components/HomeLayout'
import Dashboard from './pages/Home/Dashboard'
import './styles/App.css'

function App() {
  // Estados de autenticação e navegação
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Guard clause: redireciona para login se não autenticado
  if (!isLoggedIn) {
    return <Login />
  }

  // Renderiza layout principal com navegação e conteúdo dinâmico
  return (
    <div className="app-container">
      <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
      <HomeLayout>
        {/* Router condicional - renderiza página conforme estado currentPage */}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'feiras' && <div style={{ padding: '20px' }}>Gestão de Feiras</div>}
        {currentPage === 'expositores' && <div style={{ padding: '20px' }}>Expositores</div>}
        {currentPage === 'configuracoes' && <div style={{ padding: '20px' }}>Configurações</div>}
      </HomeLayout>
    </div>
  )
}

export default App
