import React from 'react';

// Agora este componente retorna APENAS a tabela, sem card em volta
const UserListTable = ({ users = [], loading, currentUser, onEdit, onDelete }) => {
    
    if (loading) {
        return (
            <div className="p-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <p className="text-muted">Carregando usuários...</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-light">
                    <tr>
                        <th className="ps-4">ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th className="text-center">Perfil</th>
                        <th className="text-end pe-4">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.id || index}>
                                <td className="ps-4 fw-bold">#{index + 1}</td>
                                <td className="fw-semibold">{user.nome}</td>
                                <td>{user.email}</td>
                                <td className="text-center">
                                    <span className={`badge rounded-pill px-3 py-2 ${user.perfilUsuario === 'ADMIN' ? 'bg-primary' : 'bg-primary'}`}>
                                        {user.perfilUsuario}
                                    </span>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button 
                                            className="btn btn-primary btn-sm d-flex align-items-center"
                                            onClick={() => onEdit(user)}
                                            title="Editar"
                                            style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
                                        >
                                            <i className="fas fa-pen-to-square me-1"></i> Editar
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm d-flex align-items-center"
                                            onClick={() => onDelete(user.id)}
                                            disabled={user.id === currentUser?.id}
                                            title="Excluir"
                                            style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
                                        >
                                            <i className="fas fa-trash-can me-1"></i> Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-5 text-muted fw-bold">
                                <i className="fas fa-inbox fa-3x mb-3 d-block opacity-50"></i>
                                Nenhum usuário encontrado com esse filtro.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserListTable;