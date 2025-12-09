import React, { useState, useEffect, useContext } from 'react';
import ExpositorFormModal from '../components/expositores/ExpositorFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SuccessModal from '../components/common/SuccessModal';
import ErrorModal from '../components/common/ErrorModal';

import { ExpositorService } from '../services/ExpositorService';
import api from '../services/api';

import { AuthContext } from '../context/AuthContext';

const GestaoExpositores = () => {
    // Obtém o objeto 'user' do contexto de autenticação
    const { user } = useContext(AuthContext);

    // --- ESTADOS DE DADOS E PAGINAÇÃO ---
    const [expositores, setExpositores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [loading, setLoading] = useState(true);

    // NOVO: Estados para Filtro e Paginação
    const [categoriaFiltro, setCategoriaFiltro] = useState(''); // ID ou nome da categoria para filtrar
    const [currentPage, setCurrentPage] = useState(0); // Página atual (começa em 0 no backend)
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const pageSize = 10; // Tamanho da página fixo (pode ser ajustado)

    // --- ESTADOS DE MODAIS E MENSAGENS ---
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [expositorSelecionado, setExpositorSelecionado] = useState(null);
    const [mensagemModal, setMensagemModal] = useState('');

    // --- Lógica de Carregamento de Dados ---

    // 1. Carregar Expositores (MODIFICADO para suportar Filtro/Paginação)
    const carregarExpositores = async (page = 0, categoriaNome = '') => {
        setLoading(true);
        try {
            let dados;

            if (categoriaNome) {
                // Se houver filtro por categoria, usa o endpoint paginado
                const response = await ExpositorService.buscarPorCategoriaPaginado(categoriaNome, page, pageSize);

                dados = response.content || [];
                setCurrentPage(response.number || 0);
                setTotalPages(response.totalPages || 0);

            } else {
                // Se não houver filtro, usa o findAll (sem paginação/filtro)
                // OBS: O ideal seria ter um findAll paginado também, mas seguindo o backend atual:
                dados = await ExpositorService.listarTodos();
                setCurrentPage(0);
                setTotalPages(1); // Simula 1 página no total
            }

            setExpositores(dados);

        } catch (error) {
            console.error("Erro ao carregar expositores:", error);
            setMensagemModal("Não foi possível carregar os expositores.");
            setShowErrorModal(true);
            setExpositores([]); // Garante que a lista fique vazia em caso de erro
        } finally {
            setLoading(false);
        }
    };

    // 2. Carregar Categorias (Inalterado, mas crucial para o filtro)
    const carregarCategorias = async () => {
        try {
            const response = await api.get("/categorias/buscar"); // Assumindo que este endpoint retorna a lista
            let dados;

            if (Array.isArray(response)) dados = response;
            else if (Array.isArray(response.data)) dados = response.data;
            else if (response.data && Array.isArray(response.data.content)) dados = response.data.content;
            else dados = [];

            setCategorias(dados);
        } catch (error) {
            console.error("Erro ao carregar categorias para o select:", error);
        }
    };

    // Efeito colateral que executa na montagem e na mudança da página/filtro
    useEffect(() => {
        // Recarrega sempre que a página atual ou o filtro de categoria mudar
        carregarExpositores(currentPage, categoriaFiltro);
    }, [currentPage, categoriaFiltro]);

    // Efeito para carregar as categorias apenas na montagem
    useEffect(() => {
        carregarCategorias();
    }, []);

    // --- Funções de Manipulação da Interface e Dados (MUITO SIMILARES) ---

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
                await ExpositorService.atualizar(expositorSelecionado.id, dadosExpositor, user.id);
                setMensagemModal('Expositor atualizado com sucesso!');
            } else {
                // Criar
                await ExpositorService.salvar(dadosExpositor, user.id);
                setMensagemModal('Expositor cadastrado com sucesso!');
            }

            setShowFormModal(false);
            setShowSuccessModal(true);
            // Recarrega a lista na página e filtro atuais
            carregarExpositores(currentPage, categoriaFiltro);
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
                setMensagemModal('Expositor removido com sucesso!');
                setShowSuccessModal(true);
                setShowDeleteModal(false);
                // Recarrega a lista
                carregarExpositores(currentPage, categoriaFiltro);
            }
        } catch (error) {
            console.error(error);
            setMensagemModal("Erro ao excluir o expositor.");
            setShowErrorModal(true);
        }
    };

    // --- Funções de Manipulação de Filtro/Paginação ---

    const handleFiltroCategoriaChange = (e) => {
        const novoFiltro = e.target.value;
        setCategoriaFiltro(novoFiltro);
        setCurrentPage(0); // Sempre volta para a primeira página ao mudar o filtro
    }

    const handleProximaPagina = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePaginaAnterior = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // --- Filtros (Mantido, mas só funciona na lista em memória se o findAll for usado) ---
    // NOTA: Se o filtro de categoria estiver ativo, o filtro por termo é aplicado
    // APENAS nos resultados da página atual. O ideal seria fazer a busca no backend.
    const expositoresFiltrados = expositores.filter(expositor =>
        expositor.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        expositor.documentacao?.includes(termoBusca)
    );

    return (
        <div className="container-fluid p-4">

            {/* Título e Botão */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1F2A37' }}>Gestão de Expositores</h2>
                <button className="btn custom-btn-primary" onClick={handleNovo}>
                    <i className="bi bi-person-plus-fill me-2"></i> Novo Expositor
                </button>
            </div>

            {/* Busca e Filtro de Categoria (MODIFICADO) */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        {/* Campo de Busca por Nome/Documentação */}
                        <div className="col-md-8">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Buscar por nome ou Documentação (Filtra na lista atual)..."
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Dropdown de Filtro por Categoria */}
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={categoriaFiltro}
                                onChange={handleFiltroCategoriaChange}
                            >
                                <option value="">Todas as Categorias</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.nome}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                    <th className="text-end pe-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-4">Carregando...</td></tr>
                                ) : expositoresFiltrados.length > 0 ? (
                                    expositoresFiltrados.map((expositor) => (
                                        <tr key={expositor.id}>
                                            <td className="ps-4 fw-bold text-dark">{expositor.nome}</td>
                                            <td>{expositor.documentacao}</td>
                                            <td>
                                                <span className={`badge ${expositor.status === 'APROVADO' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {expositor.status}
                                                </span>
                                            </td>
                                            <td>
                                                {/* Exibe a categoria do DTO (categoriaNome) */}
                                                {expositor.categoriaNome || '-'}
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(expositor)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleConfirmarExclusao(expositor)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">Nenhum expositor encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Controles de Paginação (NOVO) */}
            {categoriaFiltro && totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4">
                    <button
                        className="btn btn-outline-secondary me-3"
                        onClick={handlePaginaAnterior}
                        disabled={currentPage === 0 || loading}
                    >
                        Anterior
                    </button>
                    <span className="text-muted">
                        Página {currentPage + 1} de {totalPages}
                    </span>
                    <button
                        className="btn btn-outline-secondary ms-3"
                        onClick={handleProximaPagina}
                        disabled={currentPage === totalPages - 1 || loading}
                    >
                        Próxima
                    </button>
                </div>
            )}

            {/* --- Modais --- */}

            <ExpositorFormModal
                show={showFormModal}
                handleClose={() => setShowFormModal(false)}
                handleSave={handleSalvar}
                expositorParaEditar={expositorSelecionado}
                categorias={categorias}
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