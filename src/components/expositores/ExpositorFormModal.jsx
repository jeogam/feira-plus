// src/components/expositores/ExpositorFormModal.js

import React, { useState, useEffect } from 'react';

import { Modal, Form, Button } from 'react-bootstrap'; 

const initialFormData = {
    nome: '',
    email: '',
    cpfCnpj: '',
    telefone: '',
    
};

const ExpositorFormModal = ({ show, handleClose, handleSave, expositorParaEditar }) => {
    // Estado que armazena os dados do formulário
    const [formData, setFormData] = useState(initialFormData);

    // Efeito para preencher o formulário quando um expositor é passado para edição
    useEffect(() => {
        if (expositorParaEditar) {
            setFormData({ 
                nome: expositorParaEditar.nome || '', 
                email: expositorParaEditar.email || '',
                cpfCnpj: expositorParaEditar.cpfCnpj || '',
                telefone: expositorParaEditar.telefone || '',
            });
        } else {
            // Limpa o formulário se estiver em modo de criação
            setFormData(initialFormData);
        }
    }, [expositorParaEditar]);

    // Handler genérico para atualizar o estado ao digitar nos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler para submissão do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        // Chama a função handleSave (do componente pai GestaoExpositores) com os dados
        handleSave(formData);
        // O handleSave no pai fechará o modal em caso de sucesso
    };

    // Estrutura JSX do Modal
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    {expositorParaEditar ? 'Editar Expositor' : 'Cadastrar Novo Expositor'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Campo Nome / Razão Social */}
                    <Form.Group className="mb-3">
                        <Form.Label>Nome / Razão Social *</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nome"
                            value={formData.nome} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ex: Fazenda Orgânica LTDA"
                        />
                    </Form.Group>
                    
                    {/* Campo Email */}
                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="expositor@contato.com"
                        />
                    </Form.Group>

                    {/* Campo CPF / CNPJ */}
                    <Form.Group className="mb-3">
                        <Form.Label>CPF / CNPJ *</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="cpfCnpj"
                            value={formData.cpfCnpj} 
                            onChange={handleChange} 
                            required 
                            placeholder="00.000.000/0001-00 ou 000.000.000-00"
                        />
                    </Form.Group>
                    
                    {/* Campo Telefone */}
                    <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="telefone"
                            value={formData.telefone} 
                            onChange={handleChange} 
                            placeholder="(00) 90000-0000"
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="custom-btn-primary" 
                            style={{ backgroundColor: '#8e44ad', border: 'none' }}>
                        {expositorParaEditar ? 'Salvar Alterações' : 'Cadastrar Expositor'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ExpositorFormModal;