import React from 'react';

// Adicione a prop 'onChangePassword'
const UserProfileCard = ({ user, onChangePassword }) => {
    return (
        <div className="card shadow-sm mb-4 border-0" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' }}>
            <div className="card-body text-white p-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    
                    {/* LADO ESQUERDO: Dados do Usuário */}
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <i className="fas fa-user-shield fa-4x opacity-75"></i>
                        </div>
                        <div>
                            <h5 className="mb-1 text-uppercase opacity-75 small">Perfil Logado</h5>
                            <h3 className="mb-0 fw-bold">{user?.nome || 'Usuário'}</h3>
                            <p className="mb-0 opacity-75">{user?.email}</p>
                            
                            <span className="badge bg-light text-dark mt-2">
                                {user?.perfilUsuario || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* LADO DIREITO: Botão de Senha */}
                    <div>
                        <button 
                            className="btn btn-outline-light d-flex align-items-center"
                            onClick={onChangePassword}
                        >
                            <i className="fas fa-key me-2"></i> Alterar Senha
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;