import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ContatoService from "../../services/ContatoService";
import { montarPayloadExpositorCTA } from "./expositorCtaUtils";

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
    if (!form.nome.trim()) e.nome = "Obrigatório";
    if (!form.documento.trim()) e.documento = "Obrigatório";
    if (!form.categoria.trim()) e.categoria = "Obrigatório";
    if (!form.telefone.trim()) e.telefone = "Obrigatório";
    if (!form.email.trim()) e.email = "Obrigatório";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErros(e => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eValid = validar();
    if (Object.keys(eValid).length > 0) { setErros(eValid); return; }
    setEnviando(true);
    try {
      const payload = montarPayloadExpositorCTA(form);
      await ContatoService.enviarMensagem(payload);
      setSucesso(true);
      setForm(camposIniciais);
    } catch (err) {
      setErros({ geral: "Erro ao enviar. Tente novamente." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Quero ser Expositor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sucesso ? (
          <div className="alert alert-success">Solicitação enviada! Entraremos em contato.</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Nome completo ou Razão Social *</Form.Label>
                  <Form.Control name="nome" value={form.nome} onChange={handleChange} isInvalid={!!erros.nome} />
                  <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>CPF/CNPJ *</Form.Label>
                  <Form.Control name="documento" value={form.documento} onChange={handleChange} isInvalid={!!erros.documento} />
                  <Form.Control.Feedback type="invalid">{erros.documento}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Categoria de atuação *</Form.Label>
                  <Form.Select name="categoria" value={form.categoria} onChange={handleChange} isInvalid={!!erros.categoria}>
                    <option value="">Selecione...</option>
                    {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{erros.categoria}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Telefone de contato *</Form.Label>
                  <Form.Control name="telefone" value={form.telefone} onChange={handleChange} isInvalid={!!erros.telefone} />
                  <Form.Control.Feedback type="invalid">{erros.telefone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>E-mail *</Form.Label>
                  <Form.Control name="email" value={form.email} onChange={handleChange} isInvalid={!!erros.email} />
                  <Form.Control.Feedback type="invalid">{erros.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Endereço (opcional)</Form.Label>
                  <Form.Control name="endereco" value={form.endereco} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Status inicial</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange}>
                    <option value="ATIVO">ATIVO</option>
                    <option value="INATIVO">INATIVO</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Produtos principais (opcional)</Form.Label>
                  <Form.Control name="produtosPrincipais" value={form.produtosPrincipais} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            {erros.geral && <div className="alert alert-danger mt-2">{erros.geral}</div>}
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleClose} className="me-2">Cancelar</Button>
              <Button type="submit" variant="success" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar'}</Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ExpositorCtaModal;
