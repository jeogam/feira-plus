// Sidebar.jsx
import React, { useContext } from 'react';
import './Sidebar.css';
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ activePage, onNavigate }) => {
  const { user, logout } = useContext(AuthContext);

  // Configuração de navegação
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'feiras', label: 'Gestão de Feiras', icon: '📅' },
    { id: 'expositores', label: 'Expositores', icon: '👥' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
    { id: 'sair', label: 'Sair', icon: '' },
  ];

  const handleClick = (id) => {
    if (id === "sair") {
      logout();
      return;
    }
    onNavigate(id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Feira+</h1>
        <p className="sidebar-subtitle">Módulo Administrativo</p>
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => handleClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Seção de usuário */}
      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-icon">👤</span>
          <div>
            <p className="user-name">{user?.nome ?? "Usuário"}</p>
            <p className="user-role">({user?.perfilUsuario ?? "Perfil"})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
