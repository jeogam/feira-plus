// src/components/expositores/ExpositorFormModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

/**
 * Estado inicial do formulário.
 * Estruturado para refletir o DTO do backend e garantir consistência.
 */
const initialFormData = {
    nome: '',
    documentacao: '',
    status: 'ATIVO',     // Valor padrão conforme enum do backend (StatusExpositor)
    categoriaId: ''
};

/**
 * Modal para criação e edição de Expositores.
 *
 * Props:
 * - show: controla a exibição do modal.
 * - handleClose: função para fechar o modal.
 * - handleSave: callback para salvar os dados.
 * - expositorParaEditar: objeto enviado quando o usuário opta por editar.
 * - categorias: lista utilizada para preencher o select de categoria.
 */


const ExpositorFormModal = ({ show, handleClose, handleSave, expositorParaEditar, categorias = [] }) => {

    const [formData, setFormData] = useState(initialFormData);

    /**
     * Preenche o formulário automaticamente caso esteja editando.
     * Mantém compatibilidade tanto com objetos flat quanto com relações via objeto "categoria".
     */
    useEffect(() => {
        if (expositorParaEditar) {
            setFormData({
                nome: expositorParaEditar.nome || '',
                documentacao: expositorParaEditar.documentacao || '',
                status: expositorParaEditar.status || 'ATIVO',
                categoriaId:
                    expositorParaEditar.categoriaId ||
                    (expositorParaEditar.categoria ? expositorParaEditar.categoria.id : '')
            });
        } else {
            setFormData(initialFormData);
        }
    }, [expositorParaEditar]);

    /** Atualiza o estado do formulário de maneira controlada */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Envia os dados validados para o handler externo.
     * Realiza validação mínima para evitar inconsistências antes da API.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.categoriaId) {
            alert("Por favor, selecione uma categoria.");
            return;
        }

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

                    {/* Campo: Nome */}
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

                    {/* Campo: Documentação */}
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

                        {/* Select: Categoria (chave estrangeira obrigatória) */}
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

                        {/* Select: Status (mapeado diretamente do enum StatusExpositor) */}
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Status *</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    {/* Os valores devem refletir exatamente o enum do backend */}
                                    <option value="ATIVO">ATIVO</option>
                                    <option value="INATIVO">INATIVO</option>
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
