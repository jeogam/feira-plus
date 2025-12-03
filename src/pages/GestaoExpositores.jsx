// src/pages/GestaoExpositores.js

import React, { useState, useEffect, useContext } from 'react';
import ExpositorFormModal from '../components/expositores/ExpositorFormModal'; 
import ConfirmationModal from '../components/common/ConfirmationModal';
import SuccessModal from '../components/common/SuccessModal';


import { ExpositorService } from '../services/ExpositorService'; 

// Contexto de Autenticação para obter dados do usuário logado
import { AuthContext } from '../context/AuthContext'; 

const GestaoExpositores = () => {
    // Obtém o objeto 'user' do contexto de autenticação
    const { user } = useContext(AuthContext); 
    
    // Estado para armazenar a lista de expositores
    const [expositores, setExpositores] = useState([]);
    // Estado para armazenar o termo usado na caixa de busca
    const [termoBusca, setTermoBusca] = useState('');
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
    const [mensagemModal, setMensagemModal] = useState('');

    // --- Lógica de Carregamento de Dados ---
    
    // Função assíncrona para buscar a lista de expositores na API
    const carregarExpositores = async () => {
        setLoading(true);
        try {
            // Chama o serviço para listar todos os expositores
            const dados = await ExpositorService.listarTodos();
            // Atualiza o estado com os dados recebidos
            setExpositores(dados);
        } catch (error) {
            // Define a mensagem de erro e mostra o modal de erro em caso de falha
            setMensagemModal("Não foi possível carregar os expositores. Verifique se o servidor está rodando.");
            setShowErrorModal(true);
        } finally {
            // Finaliza o estado de carregamento, independentemente do resultado
            setLoading(false);
        }
    };

    // Efeito colateral que executa 'carregarExpositores' na montagem inicial do componente
    useEffect(() => {
        carregarExpositores();
    }, []); // O array vazio garante que o efeito rode apenas uma vez

    // --- Funções de Manipulação da Interface e Dados ---

    // Handler para abrir o modal de formulário para criar um novo expositor
    const handleNovo = () => {
        // Limpa o expositor selecionado (para indicar que é um novo cadastro)
        setExpositorSelecionado(null);
        setShowFormModal(true);
    };

    // Handler para abrir o modal de formulário para editar um expositor existente
    const handleEditar = (expositor) => {
        // Define o expositor a ser editado
        setExpositorSelecionado(expositor);
        setShowFormModal(true);
    };

    // Handler para abrir o modal de confirmação antes de excluir
    const handleConfirmarExclusao = (expositor) => {
        // Define o expositor a ser excluído
        setExpositorSelecionado(expositor);
        setShowDeleteModal(true);
    };

    // Handler para salvar ou atualizar os dados de um expositor
    const handleSalvar = async (dadosExpositor) => {
        // Verifica se o ID do usuário logado está disponível antes de prosseguir
        if (!user || !user.id) {
            setMensagemModal("Erro: Usuário não identificado. Faça login novamente.");
            setShowErrorModal(true);
            return;
        }

        try {
            if (expositorSelecionado) {
                // Lógica de Atualização
                // Chama o serviço para atualizar o expositor, passando o ID do usuário
                await ExpositorService.atualizar(expositorSelecionado.id, dadosExpositor, user.id);
                setMensagemModal('Expositor atualizado com sucesso!');
            } else {
                // Lógica de Criação
                // Chama o serviço para salvar o novo expositor, passando o ID do usuário
                await ExpositorService.salvar(dadosExpositor, user.id); 
                setMensagemModal('Expositor cadastrado com sucesso!');
            }
            
            // Fecha o modal de formulário, mostra o modal de sucesso e recarrega a lista
            setShowFormModal(false); 
            setShowSuccessModal(true);
            carregarExpositores(); 
        } catch (error) {
            // Exibe erro de console e modal de erro em caso de falha no save/update
            console.error(error);
            setMensagemModal("Erro ao salvar os dados do expositor. Verifique os campos.");
            setShowErrorModal(true);
        }
    };

    // Handler para excluir um expositor
    const handleExcluir = async () => {
        try {
            if (expositorSelecionado) {
                // Chama o serviço para exclusão
                await ExpositorService.excluir(expositorSelecionado.id);
                setMensagemModal('Expositor removido com sucesso!');
                setShowSuccessModal(true);
                setShowDeleteModal(false); // Fecha o modal de confirmação
                carregarExpositores();
            }
        } catch (error) {
            // Exibe erro de console e modal de erro em caso de falha na exclusão
            console.error(error);
            setMensagemModal("Erro ao excluir o expositor.");
            setShowErrorModal(true);
        }
    };

    // --- Filtros e Renderização Condicional ---
    
    // Filtra a lista de expositores baseada no termo de busca (nome, email ou CPF/CNPJ)
    const expositoresFiltrados = expositores.filter(expositor => 
        expositor.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        expositor.email?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        expositor.cpfCnpj?.includes(termoBusca)
    );

    // Estrutura JSX do componente
    return (
        <div className="container-fluid p-4">
            
            {/* Título e Botão de Ação (Novo Expositor) */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1F2A37' }}>Gestão de Expositores</h2>
                <button className="btn custom-btn-primary" onClick={handleNovo}>
                    <i className="bi bi-person-plus-fill me-2"></i> Novo Expositor
                </button>
            </div>

            {/* Componente de Busca */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Buscar por nome, email ou CPF/CNPJ..." 
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabela de Expositores */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Nome / Empresa</th>
                                    <th>Email</th>
                                    <th>CPF / CNPJ</th>
                                    <th>Feiras Ativas</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Renderização condicional baseada no estado de loading e dados */}
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-4">Carregando...</td></tr>
                                ) : expositoresFiltrados.length > 0 ? (
                                    // Mapeia os expositores filtrados para linhas da tabela
                                    expositoresFiltrados.map((expositor) => (
                                        <tr key={expositor.id}>
                                            <td className="ps-4 fw-bold text-dark">{expositor.nome || expositor.razaoSocial}</td>
                                            <td>{expositor.email}</td>
                                            <td>{expositor.cpfCnpj}</td>
                                            <td><span className="badge bg-success">{expositor.feirasAtivas || 0}</span></td>
                                            <td className="text-end pe-4">
                                                {/* Botão de Editar */}
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(expositor)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                {/* Botão de Excluir */}
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleConfirmarExclusao(expositor)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // Mensagem exibida se não houver resultados após o carregamento
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">Nenhum expositor encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modais de Interface */}
            
            {/* Modal de Cadastro/Edição de Expositor */}
            <ExpositorFormModal 
                show={showFormModal}
                handleClose={() => setShowFormModal(false)}
                handleSave={handleSalvar}
                expositorParaEditar={expositorSelecionado}
            />

            {/* Modal de Confirmação de Exclusão */}
            <ConfirmationModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                onConfirm={handleExcluir}
                title="Excluir Expositor"
                // Exibe o nome ou razão social do expositor selecionado na mensagem
                message={`Tem certeza que deseja excluir o expositor "${expositorSelecionado?.nome || expositorSelecionado?.razaoSocial}"?`}
            />

            {/* Modal de Sucesso */}
            <SuccessModal
                show={showSuccessModal}
                handleClose={() => setShowSuccessModal(false)}
                message={mensagemModal}
            />
            
            {/* Modal/Alerta de Erro (Renderização condicional) */}
            {showErrorModal && (
                <div className="alert alert-danger fixed-bottom m-4" role="alert">
                   {mensagemModal}
                   <button type="button" className="btn-close float-end" onClick={() => setShowErrorModal(false)}></button>
                </div>
            )}
        </div>
    );
};

export default GestaoExpositores;