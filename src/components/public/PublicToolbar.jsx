import React from 'react';

const PublicToolbar = ({ filtroTipo, setFiltroTipo }) => {
  return (
    <div className="d-flex justify-content-center gap-3 mb-5">
      <button 
        className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${filtroTipo === 'TODOS' ? 'btn-primary bg-dark border-dark' : 'btn-light border'}`}
        onClick={() => setFiltroTipo('TODOS')}
      >
        Todas
      </button>
      <button 
        className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${filtroTipo === 'EVENTO' ? 'btn-primary bg-dark border-dark' : 'btn-light border'}`}
        onClick={() => setFiltroTipo('EVENTO')}
      >
        <i className="far fa-calendar-alt me-2"></i> Eventuais
      </button>
      <button 
        className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${filtroTipo === 'PERMANENTE' ? 'btn-primary bg-dark border-dark' : 'btn-light border'}`}
        onClick={() => setFiltroTipo('PERMANENTE')}
      >
        <i className="fas fa-store me-2"></i> Permanentes
      </button>
    </div>
  );
};

export default PublicToolbar;