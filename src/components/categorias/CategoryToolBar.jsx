import React from "react";

const CategoryToolbar = ({ busca, setBusca }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3">
        {/* Agora só tem a Search Bar, ocupando 100% */}
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 shadow-none"
            placeholder="Pesquisar categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryToolbar;