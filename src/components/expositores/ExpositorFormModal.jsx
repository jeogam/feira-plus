// src/components/expositores/ExpositorFormModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap'; 

// DTO atualizado conforme o Backend
const initialFormData = {
    nome: '',
    documentacao: '', // Antigo cpfCnpj
    status: 'PENDENTE', // Valor padrão para novos cadastros
    categoriaId: ''     // Obrigatório
};

// Adicionei a prop 'categorias' para popular o Select
const ExpositorFormModal = ({ show, handleClose, handleSave, expositorParaEditar, categorias = [] }) => {
    
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (expositorParaEditar) {
            setFormData({ 
                nome: expositorParaEditar.nome || '', 
                // Mapeia o campo do GET (que pode vir como 'documentacao')
                documentacao: expositorParaEditar.documentacao || '',
                status: expositorParaEditar.status || 'PENDENTE',
                // Se vier o objeto categoria completo, pegamos o ID, senão pega o campo ID direto
                categoriaId: expositorParaEditar.categoriaId || (expositorParaEditar.categoria ? expositorParaEditar.categoria.id : '')
            });
        } else {
            setFormData(initialFormData);
        }
    }, [expositorParaEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação simples de categoria
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
                                    <option value="PENDENTE">PENDENTE</option>
                                    <option value="APROVADO">APROVADO</option>
                                    <option value="REJEITADO">REJEITADO</option>
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