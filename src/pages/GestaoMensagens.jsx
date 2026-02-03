import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Form, Row, Col, Card, Badge } from "react-bootstrap";
import ContatoService from "../services/ContatoService"; // Verifique se o caminho está correto
import MessageViewer from "../components/common/MessageViewer"; // O componente que criamos antes

// --- MODAL DE DETALHES (Agora com o Leitor Inteligente) ---
const MensagemDetalheModal = ({ show, handleClose, mensagem }) => {
  if (!mensagem) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className="far fa-envelope-open me-2"></i>Detalhes da Mensagem
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        
        {/* Cabeçalho da Mensagem */}
        <div className="bg-white p-3 rounded shadow-sm mb-3 border">
          <div className="row g-2">
            <div className="col-md-6">
              <small className="text-muted fw-bold text-uppercase">Remetente</small>
              <p className="mb-0 text-dark fw-semibold">{mensagem.nome}</p>
            </div>
            <div className="col-md-6">
              <small className="text-muted fw-bold text-uppercase">E-mail</small>
              <p className="mb-0"><a href={`mailto:${mensagem.email}`} className="text-decoration-none">{mensagem.email}</a></p>
            </div>
            <div className="col-md-6 mt-2">
              <small className="text-muted fw-bold text-uppercase">Assunto</small>
              <p className="mb-0 text-primary fw-bold">{mensagem.assunto}</p>
            </div>
            <div className="col-md-6 mt-2">
              <small className="text-muted fw-bold text-uppercase">Data do Envio</small>
              <p className="mb-0 text-secondary">
                {mensagem.dataEnvio ? new Date(mensagem.dataEnvio).toLocaleString('pt-BR') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* --- AQUI ENTRA O LEITOR INTELIGENTE --- */}
        <h6 className="fw-bold ms-1 mb-2 text-secondary">Conteúdo:</h6>
        <MessageViewer 
            mensagem={mensagem.mensagem} 
            assunto={mensagem.assunto} 
        />

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};

// --- PÁGINA PRINCIPAL DE GESTÃO ---
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
      // Ajuste o nome do método conforme seu ContatoService.js (listar ou listarMensagens)
      const lista = await ContatoService.listarMensagens ? await ContatoService.listarMensagens() : await ContatoService.listar();
      // Ordena por data (mais recente primeiro)
      const listaOrdenada = Array.isArray(lista) ? lista.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio)) : [];
      setMensagens(listaOrdenada);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar mensagens. Verifique a conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhe = (msg) => {
    setMensagemSelecionada(msg);
    setShowModal(true);

    // Se não foi lida, marca como lida ao abrir
    if (!msg.lida) {
      marcarComoLida(msg);
    }
  };

  const marcarComoLida = async (msg) => {
    if (atualizando) return;
    setAtualizando(true);
    try {
      // Chama o backend para atualizar status
      if (ContatoService.marcarComoLida) {
          await ContatoService.marcarComoLida(msg.id);
      }
      // Atualiza localmente
      setMensagens(prev => prev.map(m => m.id === msg.id ? { ...m, lida: true } : m));
      // Se estiver visualizando a mesma mensagem, atualiza o objeto selecionado também
      if (mensagemSelecionada && mensagemSelecionada.id === msg.id) {
          setMensagemSelecionada(prev => ({...prev, lida: true}));
      }
    } catch (e) {
      console.error("Erro ao marcar como lida", e);
    } finally {
      setAtualizando(false);
    }
  };

  // Filtros
  const mensagensFiltradas = mensagens.filter((msg) => {
    const nomeMatch = msg.nome?.toLowerCase().includes(filtro.nome.toLowerCase()) ?? false;
    const emailMatch = msg.email?.toLowerCase().includes(filtro.email.toLowerCase()) ?? false;
    const assuntoMatch = msg.assunto?.toLowerCase().includes(filtro.assunto.toLowerCase()) ?? false;
    return nomeMatch && emailMatch && assuntoMatch;
  });

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Caixa de Mensagens</h2>
        <Button variant="outline-primary" size="sm" onClick={carregarMensagens} disabled={loading}>
          <i className="fas fa-sync-alt me-2"></i> Atualizar
        </Button>
      </div>

      {/* Card de Filtros */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-3 bg-white rounded">
          <Form>
            <Row className="g-3">
              <Col md={4}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="fas fa-search text-muted"></i></span>
                  <Form.Control
                    type="text"
                    className="border-start-0 ps-0"
                    value={filtro.nome}
                    onChange={e => setFiltro(f => ({ ...f, nome: e.target.value }))}
                    placeholder="Buscar por Nome..."
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="far fa-envelope text-muted"></i></span>
                  <Form.Control
                    type="text"
                    className="border-start-0 ps-0"
                    value={filtro.email}
                    onChange={e => setFiltro(f => ({ ...f, email: e.target.value }))}
                    placeholder="Buscar por Email..."
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="input-group">
                   <span className="input-group-text bg-light border-end-0"><i className="fas fa-tag text-muted"></i></span>
                   <Form.Control
                    type="text"
                    className="border-start-0 ps-0"
                    value={filtro.assunto}
                    onChange={e => setFiltro(f => ({ ...f, assunto: e.target.value }))}
                    placeholder="Buscar por Assunto..."
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Lista de Mensagens */}
      {erro && <div className="alert alert-danger shadow-sm"><i className="fas fa-exclamation-circle me-2"></i>{erro}</div>}
      
      {loading ? (
        <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Carregando mensagens...</p>
        </div>
      ) : mensagensFiltradas.length === 0 ? (
        <div className="text-center py-5 text-muted bg-light rounded border border-dashed">
            <i className="far fa-folder-open fa-3x mb-3 opacity-50"></i>
            <p>Nenhuma mensagem encontrada com esses filtros.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {mensagensFiltradas.map((msg) => (
            <div
              key={msg.id}
              className="card shadow-sm border-0 mensagem-card position-relative overflow-hidden"
              style={{ 
                  cursor: "pointer", 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  backgroundColor: !msg.lida ? '#f0f9ff' : '#ffffff' // Azul bem claro para não lidas
              }}
              onClick={() => handleVerDetalhe(msg)}
              onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
              }}
              onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
              }}
            >
              {/* Indicador lateral colorido */}
              <div 
                className="position-absolute top-0 bottom-0 start-0" 
                style={{ width: '4px', backgroundColor: !msg.lida ? '#0d6efd' : '#e9ecef' }}
              ></div>

              <div className="card-body p-3 ps-4">
                <div className="d-flex align-items-center">
                  
                  {/* Ícone / Avatar */}
                  <div className={`me-3 d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 ${!msg.lida ? 'bg-primary text-white shadow-sm' : 'bg-light text-secondary'}`} style={{ width: 48, height: 48 }}>
                    <i className={`fas ${msg.assunto === 'QUERO_SER_EXPOSITOR' ? 'fa-store' : 'fa-envelope'}`} style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  
                  {/* Conteúdo Central */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: '200px'}}>{msg.nome}</h6>
                      {!msg.lida && <Badge bg="primary" className="rounded-pill" style={{fontSize: '0.65rem'}}>NOVA</Badge>}
                      {msg.assunto === 'QUERO_SER_EXPOSITOR' && <Badge bg="warning" text="dark" className="rounded-pill" style={{fontSize: '0.65rem'}}>CANDIDATO</Badge>}
                    </div>
                    
                    <div className="text-secondary small text-truncate" style={{ maxWidth: '80%' }}>
                      <span className="fw-bold text-dark me-1">[{msg.assunto}]</span> 
                      {msg.mensagem.replace(/[\n\r]/g, ' ').substring(0, 100)}...
                    </div>
                  </div>

                  {/* Data e Ações */}
                  <div className="ms-3 text-end flex-shrink-0">
                    <div className="text-muted small mb-2">
                        {msg.dataEnvio ? new Date(msg.dataEnvio).toLocaleDateString('pt-BR') : '-'}
                    </div>
                    
                    {!msg.lida && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="py-0 px-2 rounded-pill"
                        style={{fontSize: '0.75rem'}}
                        onClick={(e) => { e.stopPropagation(); marcarComoLida(msg); }}
                      >
                        <i className="fas fa-check me-1"></i> Marcar Lida
                      </Button>
                    )}
                    {msg.lida && <span className="text-muted small"><i className="fas fa-check-double text-success me-1"></i>Lida</span>}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal de Detalhes Integrado */}
      <MensagemDetalheModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        mensagem={mensagemSelecionada}
      />
    </div>
  );
};

export default GestaoMensagens;