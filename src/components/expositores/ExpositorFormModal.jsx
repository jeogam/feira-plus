// src/components/expositores/ExpositorFormModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap'; 

// DTO inicial que mapeia para o ExpositorPostDto do backend
const initialFormData = {
    nome: '',
    documentacao: '', 
    status: 'PENDENTE', // Valor padrão para novos cadastros
    categoriaId: ''     // 
};

/**
 * Modal de formulário para cadastro e edição de expositores.
 * * @param {boolean} show - Controla a visibilidade do modal.
 * @param {function} handleClose - Fecha o modal.
 * @param {function} handleSave - Função de callback para salvar (POST/PUT) no backend.
 * @param {object | null} expositorParaEditar - Dados do expositor se estiver em modo edição.
 * @param {Array<object>} categorias - Lista de categorias para popular o select.
 */
const ExpositorFormModal = ({ show, handleClose, handleSave, expositorParaEditar, categorias = [] }) => {
    
    const [formData, setFormData] = useState(initialFormData);

    // Efeito para carregar os dados ao editar
    useEffect(() => {
        if (expositorParaEditar) {
            setFormData({ 
                // Adiciona o 'id' ao DTO apenas se estiver editando
                id: expositorParaEditar.id, 
                nome: expositorParaEditar.nome || '', 
                documentacao: expositorParaEditar.documentacao || '',
                status: expositorParaEditar.status || 'PENDENTE',
                // Pega o ID da categoria do DTO de GET (que você já ajustou)
                categoriaId: expositorParaEditar.categoriaId || ''
            });
        } else {
            // Reseta para o estado inicial ao abrir para novo cadastro
            setFormData(initialFormData);
        }
    }, [expositorParaEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Atualiza qualquer campo do formulário
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação simples de categoria antes de enviar
        if (!formData.categoriaId) {
            alert("Por favor, selecione uma categoria.");
            return;
        }

        // Chama a função de salvamento do componente pai, passando todos os dados
        handleSave(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold text-secondary">
                    {expositorParaEditar ? 'Editar Expositor' : 'Cadastrar Novo Expositor'}
                </Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    
                    {/* --- NOME --- */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Nome do Expositor *</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nome"
                            value={formData.nome} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ex: Barraca da Maria"
                        />
                    </Form.Group>

                    {/* --- DOCUMENTAÇÃO (CPF/CNPJ) --- */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Documentação (CPF/CNPJ) *</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="documentacao"
                            value={formData.documentacao} 
                            onChange={handleChange} 
                            required 
                            placeholder="000.000.000-00"
                        />
                    </Form.Group>

                    <div className="row">
                        {/* --- SELECT DE CATEGORIA --- */}
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Categoria *</Form.Label>
                                <Form.Select 
                                    name="categoriaId"
                                    value={formData.categoriaId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {categorias.map((cat) => (
                                        // O valor é o ID, o que o backend espera
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                                {categorias.length === 0 && (
                                    <Form.Text className="text-danger">
                                        Nenhuma categoria carregada.
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </div>

                        {/* --- SELECT DE STATUS --- */}
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Status *</Form.Label>
                                <Form.Select 
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    {/* Os values devem corresponder aos nomes do Enum StatusExpositor em Java */}
                                    <option value="INATIVO">INATIVO</option>
                                    <option value="ATIVO">ATIVO</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="success" className="fw-bold">
                        {expositorParaEditar ? 'Salvar Alterações' : 'Cadastrar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ExpositorFormModal;