import React, { useEffect, useState } from "react";
import { ContatoService } from "../services/ContatoService";
import { Modal, Button, Spinner, Form, Row, Col, Card, Badge } from "react-bootstrap";

const MensagemDetalheModal = ({ show, handleClose, mensagem }) => {
  if (!mensagem) return null;
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Mensagem</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>Nome:</b> {mensagem.nome}</p>
        <p><b>Email:</b> {mensagem.email}</p>
        <p><b>Assunto:</b> {mensagem.assunto}</p>
        <p><b>Mensagem:</b><br />{mensagem.mensagem}</p>
        <p><b>Data:</b> {mensagem.dataEnvio ? new Date(mensagem.dataEnvio).toLocaleString() : '-'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestaoMensagens = () => {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState({ nome: "", email: "", assunto: "" });
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    carregarMensagens();
  }, []);

  const carregarMensagens = async () => {
    setLoading(true);
    setErro("");
    try {
      const lista = await ContatoService.listarMensagens();
      setMensagens(lista);
    } catch (e) {
      setErro("Erro ao carregar mensagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhe = (msg) => {
    setMensagemSelecionada(msg);
    setShowModal(true);
  };


  // Função para marcar como lida (simulação local, ajuste para backend se necessário)
  const marcarComoLida = async (msg) => {
    setAtualizando(true);
    try {
      await ContatoService.marcarComoLida(msg.id);
      // Atualiza localmente para feedback imediato
      setMensagens(mensagens.map(m => m.id === msg.id ? { ...m, lida: true } : m));
    } catch (e) {
      setErro("Erro ao marcar como lida.");
    } finally {
      setAtualizando(false);
    }
  };

  // Filtro aplicado
  // Suporte a campo lida (simulação se não existir)
  const mensagensComLida = mensagens.map(m => ({ ...m, lida: m.lida ?? m.lida === false ? m.lida : !!m.lida }));
  const mensagensFiltradas = mensagensComLida.filter((msg) =>
    msg.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
    msg.email.toLowerCase().includes(filtro.email.toLowerCase()) &&
    msg.assunto.toLowerCase().includes(filtro.assunto.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Mensagens de Contato</h2>
      <Card className="mb-4 p-3 shadow-sm">
        <Form>
          <Row className="g-2 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filtrar por Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.nome}
                  onChange={e => setFiltro(f => ({ ...f, nome: e.target.value }))}
                  placeholder="Digite o nome..."
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filtrar por Email</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.email}
                  onChange={e => setFiltro(f => ({ ...f, email: e.target.value }))}
                  placeholder="Digite o email..."
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filtrar por Assunto</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.assunto}
                  onChange={e => setFiltro(f => ({ ...f, assunto: e.target.value }))}
                  placeholder="Digite o assunto..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : mensagensFiltradas.length === 0 ? (
        <div className="alert alert-info">Nenhuma mensagem encontrada.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {mensagensFiltradas.map((msg) => (
            <div
              key={msg.id}
              className={`card shadow-sm p-0 border-0 mensagem-card ${!msg.lida ? 'bg-light-green' : ''}`}
              style={{ cursor: "pointer", borderLeft: !msg.lida ? '4px solid #22c55e' : '4px solid #e5e7eb', transition: 'background 0.2s' }}
              onClick={() => handleVerDetalhe(msg)}
            >
              <div className="d-flex align-items-center p-3">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, borderRadius: 24, background: !msg.lida ? '#e6fcef' : '#f3f4f6' }}>
                  <i className={`bi ${!msg.lida ? 'bi-bell-fill text-success' : 'bi-bell text-secondary'}`} style={{ fontSize: 24 }}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-bold">Notificação</span>
                    {!msg.lida && <Badge bg="success">NOVA</Badge>}
                  </div>
                  <div className="text-secondary small mb-1" style={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.mensagem.length > 80 ? msg.mensagem.slice(0, 80) + '...' : msg.mensagem}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-normal" style={{ fontSize: 12 }}>{msg.assunto}</span>
                    {!msg.lida && (
                      <Button
                        size="sm"
                        variant="outline-success"
                        className="py-0 px-2 ms-2"
                        disabled={atualizando}
                        onClick={e => { e.stopPropagation(); marcarComoLida(msg); }}
                      >
                        <i className="bi bi-check2 me-1"></i> Marcar como lida
                      </Button>
                    )}
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <div className="text-muted small">{msg.dataEnvio ? new Date(msg.dataEnvio).toLocaleString() : '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <MensagemDetalheModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        mensagem={mensagemSelecionada}
      />
    </div>
  );


  // CSS extra para visual
  // .bg-light-green { background: #f6fef9 !important; }
}

export default GestaoMensagens;
