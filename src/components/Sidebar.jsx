import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ activePage, onNavigate }) => {
  // Configuração de navegação - simplifica adição de novos itens
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'feiras', label: 'Gestão de Feiras', icon: '📅' },
    { id: 'expositores', label: 'Expositores', icon: '👥' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Feira+</h1>
        <p className="sidebar-subtitle">Módulo Administrativo</p>
      </div>

      {/* Navegação dinâmica renderizada do array menuItems */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Seção de usuário sticky ao final da sidebar */}
      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-icon">👤</span>
          <div>
            <p className="user-name">João</p>
            <p className="user-role">(Coordenador)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
