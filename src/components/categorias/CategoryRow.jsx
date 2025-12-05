import React from "react";

const CategoryRow = ({ categoria, onEdit, onDelete }) => {
  return (
    <tr>
      <td className="align-middle">{categoria.id}</td>
      <td className="align-middle">{categoria.nome}</td>
      <td className="text-center">
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => onEdit(categoria.id)}
          title="Editar"
        >
          <i className="bi bi-pencil-square"></i> Editar
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(categoria)}
          title="Excluir"
        >
          <i className="bi bi-trash"></i> Excluir
        </button>
      </td>
    </tr>
  );
};

export default CategoryRow;