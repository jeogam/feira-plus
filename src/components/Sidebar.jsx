import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from "../context/AuthContext";
import './Sidebar.css'; 

const Sidebar = ({ activePage, onNavigate }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 
  
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Ir para Home', icon: 'fas fa-home' }, 
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'feiras', label: 'Gestão de Feiras', icon: 'fas fa-calendar-check' },
    { id: 'eventos', label: 'Gestão de Eventos', icon: 'fas fa-calendar-day' }, 
    { id: 'categorias', label: 'Categorias', icon: 'fas fa-tags' }, 
    { id: 'relatorios', label: 'Relatórios', icon: 'fas fa-chart-pie' },
    { id: 'expositores', label: 'Expositores', icon: 'fas fa-store' },
    { id: 'mensagens', label: 'Mensagens', icon: 'fas fa-envelope' },
    { id: 'usuarios', label: 'Usuários', icon: 'fas fa-users-cog' },
    
    { id: 'sair', label: 'Sair', icon: 'fas fa-sign-out-alt' },
  ];

  const handleClick = (id) => {
    if (id === "sair") {
      logout();
    } else if (id === "home") { 
      navigate('/'); 
    } else {
      onNavigate(id);
    }
    
    setIsOpen(false);
  };

  return (
    <>
      {/* --- BOTÃO HAMBÚRGUER (MOBILE) --- */}
      <button 
        className="btn btn-dark d-md-none mobile-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', top: '15px', left: '15px', zIndex: 1050 }}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* --- OVERLAY (MOBILE) --- */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-md-none" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <div 
        className={`d-flex flex-column p-3 text-white sidebar-container ${isOpen ? 'mobile-open' : ''}`}
        style={{ backgroundColor: '#2c3e50' }} 
      >
        {/* Cabeçalho */}
        <div className="mb-4 text-center text-md-start mt-5 mt-md-0">
          <div className="d-flex align-items-center mb-2 mb-md-0 text-white text-decoration-none justify-content-center justify-content-md-start">
            <span className="fs-4 fw-bold">Feira+</span>
          </div>
          <div className="text-center text-md-start">
             <small className="text-white-50 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                Módulo Admin
             </small>
          </div>
        </div>

        <hr className="text-white-50" />

        {/* Menu */}
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <li className="nav-item mb-1" key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`nav-link w-100 text-start d-flex align-items-center ${activePage === item.id ? 'active' : 'text-white'}`}
                // Destaca visualmente o botão Home
                style={item.id === 'home' ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
              >
                <div style={{ width: '24px' }} className="me-2 text-center">
                  <i className={`${item.icon}`}></i>
                </div>
                <span className="d-block">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <hr className="text-white-50" />

        {/* Footer User */}
        <div className="dropdown">
          <div className="d-flex align-items-center text-white text-decoration-none p-2 rounded hover-bg-light">
            <i className="fas fa-user-circle fa-2x me-2 text-white-50"></i>
            <div className="d-block"> 
              <strong className="d-block text-truncate" style={{ maxWidth: '160px' }}>
                  {user?.nome ?? "Usuário"}
              </strong>
              <small className="text-white-50" style={{ fontSize: '0.8rem' }}>
                  {user?.perfilUsuario ?? "Perfil"}
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;