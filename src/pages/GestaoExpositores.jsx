// src/pages/GestaoExpositores.js

import React, { useState, useEffect, useContext } from "react";
import ExpositorFormModal from "../components/expositores/ExpositorFormModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal"; // Importando o ErrorModal que você já tem

import { ExpositorService } from "../services/ExpositorService";
import api from "../services/api"; // Importando api para buscar categorias

// Contexto de Autenticação para obter dados do usuário logado
import { AuthContext } from "../context/AuthContext";

const GestaoExpositores = () => {
  // Obtém o objeto 'user' do contexto de autenticação
  const { user } = useContext(AuthContext);

  // Estado para armazenar a lista de expositores
  const [expositores, setExpositores] = useState([]);
  // Estado para armazenar a lista de categorias (NOVO)
  const [categorias, setCategorias] = useState([]);

  // Estado para armazenar o termo usado na caixa de busca
  const [termoBusca, setTermoBusca] = useState("");
  // Estado para controlar o status de carregamento dos dados
  const [loading, setLoading] = useState(true);

  // Estados para controlar a visibilidade dos modais de interface
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Estado para armazenar o expositor sendo editado ou excluído
  const [expositorSelecionado, setExpositorSelecionado] = useState(null);
  // Estado para armazenar a mensagem exibida nos modais (sucesso/erro)
  const [mensagemModal, setMensagemModal] = useState("");

  // --- Lógica de Carregamento de Dados ---

  // 1. Carregar Expositores
  const carregarExpositores = async () => {
    setLoading(true);
    try {
      const dados = await ExpositorService.listarTodos();
      setExpositores(dados);
    } catch (error) {
      setMensagemModal("Não foi possível carregar os expositores.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 2. Carregar Categorias (NOVO)
  const carregarCategorias = async () => {
    try {
      const response = await api.get("/categorias/buscar");
      let dados;

      // Lógica robusta igual fizemos na tela de Gestão de Categorias
      if (Array.isArray(response)) dados = response;
      else if (Array.isArray(response.data)) dados = response.data;
      else if (response.data && Array.isArray(response.data.content))
        dados = response.data.content;
      else dados = [];

      setCategorias(dados);
    } catch (error) {
      console.error("Erro ao carregar categorias para o select:", error);
      // Não bloqueamos a tela se falhar, apenas o select ficará vazio
    }
  };

  // Efeito colateral que executa na montagem
  useEffect(() => {
    carregarExpositores();
    carregarCategorias(); // Busca as categorias também
  }, []);

  // --- Funções de Manipulação da Interface e Dados ---

  const handleNovo = () => {
    setExpositorSelecionado(null);
    setShowFormModal(true);
  };

  const handleEditar = (expositor) => {
    setExpositorSelecionado(expositor);
    setShowFormModal(true);
  };

  const handleConfirmarExclusao = (expositor) => {
    setExpositorSelecionado(expositor);
    setShowDeleteModal(true);
  };

  const handleSalvar = async (dadosExpositor) => {
    if (!user || !user.id) {
      setMensagemModal("Erro: Usuário não identificado. Faça login novamente.");
      setShowErrorModal(true);
      return;
    }

    try {
      if (expositorSelecionado) {
        // Atualizar
        await ExpositorService.atualizar(
          expositorSelecionado.id,
          dadosExpositor,
          user.id,
        );
        setMensagemModal("Expositor atualizado com sucesso!");
      } else {
        // Criar
        await ExpositorService.salvar(dadosExpositor, user.id);
        setMensagemModal("Expositor cadastrado com sucesso!");
      }

      setShowFormModal(false);
      setShowSuccessModal(true);
      carregarExpositores();
    } catch (error) {
      console.error(error);
      setMensagemModal("Erro ao salvar os dados. Verifique os campos.");
      setShowErrorModal(true);
    }
  };

  const handleExcluir = async () => {
    try {
      if (expositorSelecionado) {
        await ExpositorService.excluir(expositorSelecionado.id);
        setMensagemModal("Expositor removido com sucesso!");
        setShowSuccessModal(true);
        setShowDeleteModal(false);
        carregarExpositores();
      }
    } catch (error) {
      console.error(error);
      setMensagemModal("Erro ao excluir o expositor.");
      setShowErrorModal(true);
    }
  };

  // --- Filtros ---
  const expositoresFiltrados = expositores.filter(
    (expositor) =>
      expositor.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      expositor.documentacao?.includes(termoBusca), // Atualizado para usar documentacao
  );

  return (
    <div className="container-fluid p-4">
      {/* Título e Botão */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "#1F2A37" }}>
          Gestão de Expositores
        </h2>
        <button className="btn custom-btn-primary" onClick={handleNovo}>
          <i className="bi bi-person-plus-fill me-2"></i> Novo Expositor
        </button>
      </div>

      {/* Busca */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Buscar por nome ou Documentação..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Nome</th>
                  <th>Documentação</th>
                  <th>Status</th>
                  <th>Categoria</th>
                  <th>Tipo de Produto</th>
                  <th>Descrição</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Carregando...
                    </td>
                  </tr>
                ) : expositoresFiltrados.length > 0 ? (
                  expositoresFiltrados.map((expositor) => (
                    <tr key={expositor.id}>
                      <td className="ps-4 fw-bold text-dark">
                        {expositor.nome}
                      </td>
                      <td>{expositor.documentacao}</td>

                      <td>
                        <span
                          className={`badge ${expositor.status === "ATIVO" ? "bg-success" : "bg-secondary"}`}
                        >
                          {expositor.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      <td>
                        {expositor.categoriaNome ||
                          (expositor.categoria
                            ? expositor.categoria.nome
                            : "-")}
                      </td>

                      <td>{expositor.tipoProduto || "-"}</td>

                      <td style={{ maxWidth: 320 }} className="text-truncate">
                        {expositor.descricao || "-"}
                      </td>

                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditar(expositor)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleConfirmarExclusao(expositor)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Nenhum expositor encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Modais --- */}

      {/* Modal de Cadastro/Edição: Agora recebe as CATEGORIAS */}
      <ExpositorFormModal
        show={showFormModal}
        handleClose={() => setShowFormModal(false)}
        handleSave={handleSalvar}
        expositorParaEditar={expositorSelecionado}
        categorias={categorias} // <--- AQUI ESTÁ A CORREÇÃO PRINCIPAL
      />

      <ConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={handleExcluir}
        title="Excluir Expositor"
        message={`Tem certeza que deseja excluir o expositor "${expositorSelecionado?.nome}"?`}
      />

      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        message={mensagemModal}
      />

      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        message={mensagemModal}
      />
    </div>
  );
};

export default GestaoExpositores;
