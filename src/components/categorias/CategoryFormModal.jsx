import React, { useState, useEffect } from "react";

const CategoryFormModal = ({ show, handleClose, handleSubmit, initialData, title }) => {
  // Estado local do formulário
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  // Sempre que o modal abre ou os dados mudam, atualiza o campo
  useEffect(() => {
    if (show) {
      setNome(initialData ? initialData.nome : "");
      setErro("");
    }
  }, [show, initialData]);

  // Função interna de submit para validar antes de enviar ao pai
  const onSubmit = () => {
    if (!nome.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }
    // Envia o objeto para o componente pai salvar
    handleSubmit({ nome });
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          
          {/* Cabeçalho */}
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-tag-fill me-2"></i>
              {title}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>

          {/* Corpo */}
          <div className="modal-body p-4">
            <form>
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary">Nome da Categoria</label>
                <input
                  type="text"
                  className={`form-control ${erro ? "is-invalid" : ""}`}
                  placeholder="Ex: Artesanato, Alimentação..."
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (e.target.value) setErro(""); // Limpa erro ao digitar
                  }}
                  autoFocus
                />
                {erro && <div className="invalid-feedback">{erro}</div>}
              </div>
            </form>
          </div>

          {/* Rodapé */}
          <div className="modal-footer bg-light">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-success fw-bold px-4" 
              onClick={onSubmit}
            >
              <i className="bi bi-check-lg me-1"></i>
              Salvar
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;