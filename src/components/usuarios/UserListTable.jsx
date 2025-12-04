import React from "react";

// Agora este componente retorna APENAS a tabela, sem card em volta
const UserListTable = ({
  users = [],
  loading,
  currentUser,
  onEdit,
  onDelete,
}) => {
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
            <th className="text-end pe-4 col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users?.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id || index}>
                <td className="ps-4 fw-bold">#{index + 1}</td>
                <td className="fw-semibold text-nowrap">{user.nome}</td>
                <td>{user.email}</td>
                <td className="text-center">
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      user.perfilUsuario === "ADMIN"
                        ? "bg-primary"
                        : "bg-primary"
                    }`}
                  >
                    {user.perfilUsuario}
                  </span>
                </td>
                <td className="text-end pe-4 col-actions">
                  <div className="d-flex justify-content-end gap-2">
                    {/* Botão Editar (borda azul) */}
                    <button
                      className="btn btn-sm border border-primary text-primary d-flex align-items-center gap-1"
                      onClick={() => onEdit(user)}
                      title="Editar"
                      style={{ background: "transparent" }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    {/* Botão Excluir (borda vermelha) */}
                    <button
                      className="btn btn-sm border border-danger text-danger d-flex align-items-center gap-1"
                      onClick={() => onDelete(user.id)}
                      disabled={user.id === currentUser?.id}
                      title="Excluir"
                      style={{ background: "transparent" }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-state-container">
                {/* Ícone de caixa vazia do Bootstrap */}
                <i className="bi bi-inbox empty-state-icon"></i>
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
