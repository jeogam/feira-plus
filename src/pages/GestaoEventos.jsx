import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import EventoFormModal from "../components/eventos/EventosFormModal";
import { Button, Table, Badge, Card, Spinner } from "react-bootstrap";

const GestaoEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [feiras, setFeiras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // 1. Buscar Eventos
      const resEventos = await api.get("/eventos");
      setEventos(Array.isArray(resEventos) ? resEventos : []);

      // 2. Buscar Feiras (Tenta rota padrão /buscar, se falhar tenta a raiz)
      let listaFeiras = [];
      try {
        const res = await api.get("/feiras/buscar"); // Tenta rota padrão do seu projeto
        listaFeiras = Array.isArray(res) ? res : (res.content || []);
      } catch (e) {
        console.warn("Rota /feiras/buscar falhou, tentando /feiras...");
        const resBackup = await api.get("/feiras");
        listaFeiras = Array.isArray(resBackup) ? resBackup : (resBackup.content || []);
      }
      
      setFeiras(listaFeiras);
      console.log("Feiras carregadas para o select:", listaFeiras);

    } catch (error) {
      console.error("Erro geral ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoEvento = () => {
    setEventoEditando(null);
    setShowModal(true);
  };

  const handleEditar = (evento) => {
    setEventoEditando(evento);
    setShowModal(true);
  };

  const handleDeletar = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await api.delete(`/eventos/remover/${id}`); // Ajuste conforme sua rota no Java (/delete ou /remover)
      carregarDados();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao excluir. Verifique se existem dependências.");
    }
  };

  const handleSalvar = async (dadosEvento) => {
    try {
      if (eventoEditando) {
        // Atualizar
        await api.put(`/eventos/atualizar/${eventoEditando.id}`, dadosEvento);
      } else {
        // Cadastrar
        await api.post("/eventos/cadastrar", dadosEvento);
      }
      setShowModal(false);
      carregarDados(); // Recarrega a tabela
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar evento. Verifique os campos obrigatórios.");
    }
  };

  // Formata data para exibição na tabela (DD/MM/AAAA HH:mm)
  const formatarDataExibicao = (dataIso) => {
    if (!dataIso) return "-";
    return new Date(dataIso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary fw-bold">
          <i className="fas fa-calendar-day me-2"></i> Gestão de Eventos
        </h3>
        <Button variant="success" onClick={handleNovoEvento}>
          <i className="fas fa-plus me-1"></i> Novo Evento
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th>Feira Vinculada</th>
                <th>Início</th>
                <th>Fim</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : eventos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Nenhum evento cadastrado.
                  </td>
                </tr>
              ) : (
                eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td className="fw-bold">{evento.titulo}</td>
                    <td>
                      {/* Tenta pegar nome do objeto feira ou busca pelo ID na lista */}
                      <Badge bg="info" text="dark">
                        {evento.feiraNome || evento.feira?.nome || feiras.find(f => f.id === evento.feiraId)?.nome || "Não definido"}
                      </Badge>
                    </td>
                    <td>{formatarDataExibicao(evento.dataHoraInicio)}</td>
                    <td>{formatarDataExibicao(evento.dataHoraFim)}</td>
                    <td className="text-end">
                      <Button
                        variant="link"
                        className="text-primary p-0 me-3"
                        onClick={() => handleEditar(evento)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => handleDeletar(evento.id)}
                        title="Excluir"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODAL DE FORMULÁRIO */}
      <EventoFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSalvar}
        eventoParaEditar={eventoEditando}
        feirasDisponiveis={feiras}
      />
    </div>
  );
};

export default GestaoEventos;