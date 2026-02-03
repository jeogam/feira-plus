import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import ContatoService from "../../services/ContatoService";
import { montarPayloadExpositorCTA } from "./expositorCtaUtils"; // Importa a formatação

const camposIniciais = {
  nome: "",
  documento: "",
  categoria: "",
  telefone: "",
  email: "",
  endereco: "",
  status: "ATIVO",
  produtosPrincipais: "",
};

const categorias = [
  "Alimentos",
  "Artesanato",
  "Vestuário",
  "Serviços",
  "Outros",
];

const ExpositorCtaModal = ({ show, handleClose }) => {
  const [form, setForm] = useState(camposIniciais);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState(false);

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.documento.trim()) e.documento = "Documento é obrigatório";
    if (!form.categoria.trim()) e.categoria = "Selecione uma categoria";
    if (!form.telefone.trim()) e.telefone = "Telefone é obrigatório";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Limpa o erro do campo quando o usuário digita
    if (erros[name]) {
      setErros(e => ({ ...e, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validação
    const eValid = validar();
    if (Object.keys(eValid).length > 0) { 
      setErros(eValid); 
      return; 
    }

    setEnviando(true);
    setErros({}); // Limpa erros gerais anteriores

    try {
      // 2. Transforma os dados para o formato que o Java aceita
      const payload = montarPayloadExpositorCTA(form);
      
      // 3. Envia para o Backend (Verifique se o método no Service é 'criar' ou 'enviarMensagem')
      // Geralmente em REST é criar. Ajuste conforme seu arquivo ContatoService.js
      if (ContatoService.criar) {
          await ContatoService.criar(payload);
      } else if (ContatoService.enviarMensagem) {
          await ContatoService.enviarMensagem(payload);
      } else {
          throw new Error("Método de envio não encontrado no Service");
      }

      setSucesso(true);
      setForm(camposIniciais);
    } catch (err) {
      console.error(err);
      const msgErro = err.response?.data?.message || "Erro ao enviar solicitação. Verifique os dados.";
      setErros({ geral: msgErro });
    } finally {
      setEnviando(false);
    }
  };

  // Função para fechar e resetar o estado
  const handleFecharModal = () => {
    setSucesso(false);
    setErros({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleFecharModal} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title><i className="fas fa-store me-2"></i>Quero ser Expositor</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {sucesso ? (
          <div className="text-center py-4">
            <div className="mb-3 text-success">
              <i className="fas fa-check-circle fa-4x"></i>
            </div>
            <h4>Solicitação Enviada!</h4>
            <p className="text-muted">
              Recebemos seus dados. Nossa equipe analisará sua proposta e entrará em contato pelo e-mail ou telefone informados.
            </p>
            <Button variant="success" onClick={handleFecharModal}>Entendido</Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <p className="text-muted mb-4 small">
              Preencha o formulário abaixo para demonstrar interesse. Se aprovado, criaremos sua conta de acesso.
            </p>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Nome Completo / Razão Social *</Form.Label>
                  <Form.Control 
                    name="nome" 
                    value={form.nome} 
                    onChange={handleChange} 
                    isInvalid={!!erros.nome} 
                    placeholder="Ex: João da Silva MEI"
                  />
                  <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">CPF / CNPJ *</Form.Label>
                  <Form.Control 
                    name="documento" 
                    value={form.documento} 
                    onChange={handleChange} 
                    isInvalid={!!erros.documento}
                    placeholder="Apenas números" 
                  />
                  <Form.Control.Feedback type="invalid">{erros.documento}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">E-mail Comercial *</Form.Label>
                  <Form.Control 
                    name="email" 
                    type="email"
                    value={form.email} 
                    onChange={handleChange} 
                    isInvalid={!!erros.email} 
                    placeholder="contato@empresa.com"
                  />
                  <Form.Control.Feedback type="invalid">{erros.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Telefone / WhatsApp *</Form.Label>
                  <Form.Control 
                    name="telefone" 
                    value={form.telefone} 
                    onChange={handleChange} 
                    isInvalid={!!erros.telefone} 
                    placeholder="(00) 00000-0000"
                  />
                  <Form.Control.Feedback type="invalid">{erros.telefone}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Categoria Principal *</Form.Label>
                  <Form.Select 
                    name="categoria" 
                    value={form.categoria} 
                    onChange={handleChange} 
                    isInvalid={!!erros.categoria}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{erros.categoria}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Endereço (Cidade/Bairro)</Form.Label>
                  <Form.Control 
                    name="endereco" 
                    value={form.endereco} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold small">O que você pretende vender?</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="produtosPrincipais" 
                    value={form.produtosPrincipais} 
                    onChange={handleChange} 
                    placeholder="Descreva brevemente seus produtos..."
                  />
                </Form.Group>
              </Col>
            </Row>

            {erros.geral && (
              <Alert variant="danger" className="mt-3">
                <i className="fas fa-exclamation-triangle me-2"></i>{erros.geral}
              </Alert>
            )}

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <Button variant="light" onClick={handleClose} className="me-2 border">Cancelar</Button>
              <Button type="submit" variant="primary" disabled={enviando} className="px-4 fw-bold">
                {enviando ? <span><i className="fas fa-spinner fa-spin me-2"></i>Enviando...</span> : <span><i className="fas fa-paper-plane me-2"></i>Enviar Solicitação</span>}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ExpositorCtaModal;