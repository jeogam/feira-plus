import React from "react";

const CategoryTable = ({ categorias = [], onEdit, onDelete }) => {
  // Se a lista for nula ou vazia, mostramos o estado vazio dentro da tabela
  // (O controle de Loading geralmente fica na página pai, mas se quiser pode por aqui também)
  
  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped mb-0 align-middle">
        <thead className="table-light">
          <tr>
            <th className="ps-4" style={{ width: "10%" }}>ID</th>
            <th style={{ width: "60%" }}>Nome</th>
            <th className="text-end pe-4" style={{ width: "30%" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias?.length > 0 ? (
            categorias.map((categoria, index) => (
              <tr key={categoria.id || index}>
                {/* ID com negrito */}
                <td className="ps-4 fw-bold">#{categoria.id}</td>
                
                {/* Nome da Categoria */}
                <td className="fw-semibold text-nowrap">
                   {/* Badge opcional para dar destaque visual */}
                   <span className="badge bg-light text-dark border border-secondary fw-normal">
                      <i className="bi bi-tag-fill me-1 text-secondary"></i>
                      {categoria.nome}
                   </span>
                </td>

                {/* Coluna de Ações alinhada à direita */}
                <td className="text-end pe-4">
                  <div className="d-flex justify-content-end gap-2">
                    
                    {/* Botão Editar (Borda Azul) */}
                    <button
                      className="btn btn-sm border border-primary text-primary d-flex align-items-center gap-1"
                      onClick={() => onEdit(categoria.id)}
                      title="Editar"
                      style={{ background: "transparent" }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    {/* Botão Excluir (Borda Vermelha) */}
                    <button
                      className="btn btn-sm border border-danger text-danger d-flex align-items-center gap-1"
                      onClick={() => onDelete(categoria)}
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
            // Estado Vazio (Empty State)
            <tr>
              <td colSpan="3" className="text-center p-5 text-muted">
                <div className="mb-2">
                  <i className="bi bi-inbox" style={{ fontSize: "2rem" }}></i>
                </div>
                Nenhuma categoria encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;