import React, { useState, useEffect } from "react";
import api from "../services/api";

// Componentes Visuais
import CategoryToolbar from "../components/categorias/CategoryToolBar";
import CategoryTable from "../components/categorias/CategoryTable";
import CategoryFormModal from "../components/categorias/CategoryFormModal";

// Modais de Feedback
import ConfirmationModal from "../components/common/ConfirmationModal";
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal";

const GestaoCategorias = () => {
  // --- Estados ---
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [modalConfirm, setModalConfirm] = useState({ show: false, data: null });
  const [modalSuccess, setModalSuccess] = useState({ show: false, message: "" });
  const [modalError, setModalError] = useState({ show: false, message: "" });
  const [modalForm, setModalForm] = useState({ 
    show: false, 
    mode: "create", 
    data: null 
  });

  // --- Carregamento de Dados ---
  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categorias/buscar");
      let dados;

      // Normaliza a resposta (Array direto, Axios .data ou Spring Page .content)
      if (Array.isArray(response)) {
        dados = response;
      } else if (Array.isArray(response.data)) {
        dados = response.data;
      } else if (response.data && Array.isArray(response.data.content)) {
        dados = response.data.content;
      } else {
        dados = [];
      }

      setCategorias(dados);

    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setModalError({ show: true, message: "Não foi possível carregar a lista de categorias." });
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  // Filtro local (Case Insensitive)
  const categoriasFiltradas = (categorias || []).filter((cat) =>
    cat.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  // --- Handlers de Ação ---

  const handleCriar = () => {
    setModalForm({ show: true, mode: "create", data: null });
  };

  const handleEditar = (id) => {
    const categoriaParaEditar = categorias.find(c => c.id === id);
    if (categoriaParaEditar) {
      setModalForm({ show: true, mode: "edit", data: categoriaParaEditar });
    }
  };

  const handleSolicitarExclusao = (categoria) => {
    setModalConfirm({ show: true, data: categoria });
  };

  // --- Operações de API (Create/Update/Delete) ---

  const handleFormSubmit = async (formData) => {
    try {
      if (modalForm.mode === "create") {
        await api.post("/categorias/cadastrar", formData);
        setModalSuccess({ show: true, message: "Categoria criada com sucesso!" });
      } else {
        const id = modalForm.data.id;
        await api.put(`/categorias/update/${id}`, formData);
        setModalSuccess({ show: true, message: "Categoria atualizada com sucesso!" });
      }

      setModalForm({ show: false, mode: "create", data: null });
      carregarCategorias();

    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setModalError({ 
        show: true, 
        message: "Erro ao salvar. Verifique se os dados estão corretos." 
      });
    }
  };

  const executarExclusao = async () => {
    const categoria = modalConfirm.data;
    if (!categoria) return;

    try {
      await api.delete(`/categorias/delete/${categoria.id}`);
      
      setModalConfirm({ show: false, data: null });
      setModalSuccess({ 
        show: true, 
        message: `A categoria "${categoria.nome}" foi excluída com sucesso!` 
      });
      
      carregarCategorias();

    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setModalConfirm({ show: false, data: null });
      
      let msg = "Ocorreu um erro ao tentar excluir.";
      
      // Tratamento específico para erro de chave estrangeira (FK)
      if (error.response && (error.response.status === 409 || error.response.status === 500)) {
        msg = "Esta categoria possui expositores vinculados e não pode ser excluída.";
      }
      
      setModalError({ show: true, message: msg });
    }
  };

  return (
    <div className="container mt-5">
      
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-secondary mb-0" style={{ fontSize: '1.75rem' }}>
            Gestão de Categorias
          </h2>
          <p className="text-muted mb-0 d-none d-md-block">
            Gerencie as categorias de expositores da Feira+.
          </p>
        </div>

        <button 
          className="btn btn-success d-flex align-items-center gap-2 shadow-sm"
          onClick={handleCriar}
          title="Nova Categoria"
          style={{ height: "fit-content" }}
        >
          <i className="bi bi-plus-circle fs-5"></i>
          <span className="d-none d-sm-block fw-medium">Nova Categoria</span>
        </button>
      </div>

      {/* Toolbar de Pesquisa */}
      <CategoryToolbar busca={busca} setBusca={setBusca} />

      {/* Tabela de Dados */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <CategoryTable 
          categorias={categoriasFiltradas} 
          onEdit={handleEditar} 
          onDelete={handleSolicitarExclusao} 
        />
      )}

      {/* --- Modais --- */}

      <CategoryFormModal 
        show={modalForm.show}
        handleClose={() => setModalForm({ ...modalForm, show: false })}
        handleSubmit={handleFormSubmit}
        initialData={modalForm.data}
        title={modalForm.mode === "create" ? "Nova Categoria" : "Editar Categoria"}
      />

      <ConfirmationModal
        show={modalConfirm.show}
        title="Excluir Categoria"
        message={`Tem certeza que deseja apagar "${modalConfirm.data?.nome}"?`}
        handleClose={() => setModalConfirm({ show: false, data: null })}
        onConfirm={executarExclusao}
      />

      <SuccessModal
        show={modalSuccess.show}
        message={modalSuccess.message}
        handleClose={() => setModalSuccess({ show: false, message: "" })}
      />

      <ErrorModal
        show={modalError.show}
        message={modalError.message}
        handleClose={() => setModalError({ show: false, message: "" })}
      />
    </div>
  );
};

export default GestaoCategorias;