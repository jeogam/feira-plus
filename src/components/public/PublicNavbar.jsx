import React from 'react';

const PublicNavbar = ({ onNavigateLogin }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="#" style={{ color: '#1e2939' }}>
          <i className="fas fa-store me-2 text-primary"></i> 
          Feira<span className="text-primary">+</span>
        </a>
        <div className="d-flex">
          <button 
            className="btn btn-primary rounded-pill px-4 fw-bold" 
            onClick={onNavigateLogin}
            style={{ backgroundColor: '#1e2939', borderColor: '#1e2939' }}
          >
            <i className="fas fa-store me-2"></i>
            ADMs
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;