import React from 'react';

const CallToAction = ({ onRegisterClick }) => {
  return (
    <div className="bg-brand text-white py-5 mt-5">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-3">Você é um Artesão ou Expositor?</h2>
            <p className="lead mb-4 text-white-50">
              Junte-se à plataforma Feira+ e divulgue seus produtos para milhares de pessoas. 
              Gerencie suas participações e cresça seu negócio.
            </p>
            <button 
              className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-brand shadow hover-scale"
              onClick={onRegisterClick}
            >
              <i className="fas fa-rocket me-2"></i>
              Quero ser Expositor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;