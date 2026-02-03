import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Modal, Button, Form, Tab, Tabs, Table } from "react-bootstrap";

const FeiraFormModal = ({
  show,
  handleClose,
  handleSave,
  feiraParaEditar,
  expositoresDisponiveis = [],
  loadingExpositores = false,
}) => {
  const PLACEHOLDER_IMG = "https://via.placeholder.com/80?text=Foto";
  const frequencias = ["DIARIO", "SEMANAL", "QUINZENAL", "MENSAL", "ANUAL"];

  // --- ESTADOS DA FEIRA ---
  const initialFormState = {
    tipo: "EVENTO",
    nome: "",
    local: "",
    espacos: 0,
    horaAbertura: "",
    horaFechamento: "",
    dataInicio: "",
    dataFim: "",
    frequencia: "SEMANAL",
    foto: "",
    expositorIds: [],
    nota: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [expositorSelecionado, setExpositorSelecionado] = useState("");
  const [tabKey, setTabKey] = useState("geral");

  // --- ESTADOS DOS EVENTOS ---
  const [eventosDaFeira, setEventosDaFeira] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    descricao: "",
  });

  const [mostrarPassados, setMostrarPassados] = useState(false);

  const previewSrc = formData.foto?.trim()
    ? formData.foto.trim()
    : PLACEHOLDER_IMG;

  // --- EFEITO: CARREGAR DADOS ---
  useEffect(() => {
    if (feiraParaEditar) {
      const tipoDetectado = feiraParaEditar.frequencia
        ? "PERMANENTE"
        : "EVENTO";
      const idsAtuais = feiraParaEditar.expositores
        ? feiraParaEditar.expositores.map((exp) => exp.id)
        : [];

      setFormData({
        ...feiraParaEditar,
        tipo: tipoDetectado,
        espacos: Number(feiraParaEditar.espacos || 0),
        foto: feiraParaEditar.foto || "",
        expositorIds: idsAtuais,
        nota: feiraParaEditar.nota || 0,
      });

      // ✅ AGORA CARREGA EVENTOS PARA QUALQUER TIPO DE FEIRA
      carregarEventosDaFeira(feiraParaEditar.id);
    } else {
      setFormData(initialFormState);
      setEventosDaFeira([]);
    }
    setExpositorSelecionado("");
    setTabKey("geral");
  }, [feiraParaEditar, show]);

  // --- LÓGICA DE EVENTOS ---
  const carregarEventosDaFeira = async (feiraId) => {
    setLoadingEventos(true);
    try {
      const response = await api.get(`/eventos/feira/${feiraId}`);
      setEventosDaFeira(response || []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoadingEventos(false);
    }
  };

  const handleAddEventoRapido = async () => {
    if (
      !novoEvento.titulo ||
      !novoEvento.dataHoraInicio ||
      !feiraParaEditar?.id
    ) {
      alert("Preencha Título e Data de Início.");
      return;
    }

    try {
      setLoadingEventos(true);
      const payload = {
        ...novoEvento,
        feiraId: feiraParaEditar.id,
      };

      await api.post("/eventos/cadastrar", payload);

      setNovoEvento({
        titulo: "",
        dataHoraInicio: "",
        dataHoraFim: "",
        descricao: "",
      });
      await carregarEventosDaFeira(feiraParaEditar.id);
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      alert("Erro ao salvar evento.");
    } finally {
      setLoadingEventos(false);
    }
  };

  const handleDeleteEvento = async (eventoId) => {
    if (!window.confirm("Remover este evento?")) return;
    try {
      setLoadingEventos(true);
      await api.delete(`/eventos/remover/${eventoId}`);
      await carregarEventosDaFeira(feiraParaEditar.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEventos(false);
    }
  };

  // --- LÓGICA DE FILTRO ---
  const eventosFiltrados = eventosDaFeira.filter((evento) => {
    if (mostrarPassados) return true;
    const dataReferencia = evento.dataHoraFim
      ? new Date(evento.dataHoraFim)
      : new Date(evento.dataHoraInicio);
    const agora = new Date();
    return dataReferencia > agora;
  });

  // --- LÓGICA DA FEIRA ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "espacos" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleStarClick = (valor) =>
    setFormData((prev) => ({ ...prev, nota: valor }));

  const handleAdicionarExpositor = () => {
    if (!expositorSelecionado) return;
    const id = Number(expositorSelecionado);
    if (!formData.expositorIds.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        expositorIds: [...prev.expositorIds, id],
      }));
    }
    setExpositorSelecionado("");
  };

  const handleRemoverExpositor = (idParaRemover) => {
    setFormData((prev) => ({
      ...prev,
      expositorIds: prev.expositorIds.filter((id) => id !== idParaRemover),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosFinais = { ...formData };
    if (formData.tipo === "EVENTO") delete dadosFinais.frequencia;
    else {
      delete dadosFinais.dataInicio;
      delete dadosFinais.dataFim;
    }
    handleSave(dadosFinais);
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="h5 fw-bold text-primary">
          {feiraParaEditar ? `Editando: ${feiraParaEditar.nome}` : "Nova Feira"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Form onSubmit={handleSubmit}>
          <Tabs
            activeKey={tabKey}
            onSelect={(k) => setTabKey(k)}
            className="mb-3 px-3 pt-3 border-bottom-0"
          >
            {/* ABA 1: GERAL */}
            <Tab eventKey="geral" title="Informações Gerais">
              <div className="px-3 pb-3">
                {/* ... CAMPOS DA FEIRA (SEM ALTERAÇÕES) ... */}
                {!feiraParaEditar && (
                  <div className="mb-4 p-3 bg-light rounded border">
                    <label className="form-label fw-bold d-block">
                      Tipo de Feira
                    </label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        value="EVENTO"
                        checked={formData.tipo === "EVENTO"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Feira Evento</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        value="PERMANENTE"
                        checked={formData.tipo === "PERMANENTE"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        Feira Permanente
                      </label>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      className="form-control"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Local</label>
                    <input
                      type="text"
                      name="local"
                      className="form-control"
                      value={formData.local}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label fw-bold">URL da Foto</label>
                    <div className="d-flex gap-2">
                      <img
                        src={previewSrc}
                        alt="Preview"
                        className="rounded border"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                      />
                      <input
                        type="text"
                        name="foto"
                        className="form-control"
                        value={formData.foto}
                        onChange={handleChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Avaliação</label>
                    <div
                      className="d-flex align-items-center gap-1 fs-5 text-warning"
                      style={{ cursor: "pointer" }}
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className={`fas fa-star ${s <= formData.nota ? "" : "text-muted opacity-25"}`}
                          onClick={() => handleStarClick(s)}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="fw-bold">Abertura</label>
                    <input
                      type="time"
                      name="horaAbertura"
                      className="form-control"
                      value={formData.horaAbertura}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="fw-bold">Fechamento</label>
                    <input
                      type="time"
                      name="horaFechamento"
                      className="form-control"
                      value={formData.horaFechamento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="fw-bold">Espaços</label>
                    <input
                      type="number"
                      name="espacos"
                      className="form-control"
                      value={formData.espacos}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
                {formData.tipo === "EVENTO" ? (
                  <div className="row bg-light p-2 rounded mx-0">
                    <div className="col-md-6">
                      <label className="fw-bold">Data Início</label>
                      <input
                        type="date"
                        name="dataInicio"
                        className="form-control"
                        value={formData.dataInicio}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Data Fim</label>
                      <input
                        type="date"
                        name="dataFim"
                        className="form-control"
                        value={formData.dataFim}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="fw-bold">Frequência</label>
                    <select
                      name="frequencia"
                      className="form-select"
                      value={formData.frequencia}
                      onChange={handleChange}
                      required
                    >
                      {frequencias.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Tab>

            {/* ABA 2: EXPOSITORES */}
            <Tab
              eventKey="expositores"
              title={`Expositores (${formData.expositorIds.length})`}
            >
              <div className="px-3 pb-3">
                <div className="input-group mb-3">
                  <select
                    className="form-select"
                    value={expositorSelecionado}
                    onChange={(e) => setExpositorSelecionado(e.target.value)}
                    disabled={loadingExpositores}
                  >
                    <option value="">Selecione um expositor...</option>
                    {expositoresDisponiveis
                      .filter((exp) => !formData.expositorIds.includes(exp.id))
                      .map((exp) => (
                        <option key={exp.id} value={exp.id}>
                          {exp.nome}
                        </option>
                      ))}
                  </select>
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={handleAdicionarExpositor}
                    disabled={!expositorSelecionado}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div
                  className="border rounded bg-white p-2"
                  style={{ height: "250px", overflowY: "auto" }}
                >
                  {formData.expositorIds.length === 0 ? (
                    <p className="text-muted text-center mt-5 small">
                      Nenhum expositor.
                    </p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {formData.expositorIds.map((id) => {
                        const exp = expositoresDisponiveis.find(
                          (e) => e.id === id,
                        ) || { nome: "Carregando...", id };
                        return (
                          <li
                            key={id}
                            className="list-group-item d-flex justify-content-between align-items-center py-1"
                          >
                            <span>
                              <i className="fas fa-store me-2 text-secondary"></i>
                              {exp.nome}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm text-danger"
                              onClick={() => handleRemoverExpositor(id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </Tab>

            {/* ABA 3: PROGRAMAÇÃO / EVENTOS (Habilitado para TODAS as feiras em edição) */}
            {feiraParaEditar && (
              <Tab eventKey="programacao" title="Programação / Eventos">
                <div className="px-3 pb-3">
                  {/* Formulário de Adicionar */}
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Título do Evento (ex: Show)"
                      value={novoEvento.titulo}
                      onChange={(e) =>
                        setNovoEvento({ ...novoEvento, titulo: e.target.value })
                      }
                    />
                    <input
                      type="datetime-local"
                      className="form-control"
                      style={{ maxWidth: "180px" }}
                      value={novoEvento.dataHoraInicio}
                      onChange={(e) =>
                        setNovoEvento({
                          ...novoEvento,
                          dataHoraInicio: e.target.value,
                        })
                      }
                    />
                    <input
                      type="datetime-local"
                      className="form-control"
                      style={{ maxWidth: "180px" }}
                      value={novoEvento.dataHoraFim}
                      onChange={(e) =>
                        setNovoEvento({
                          ...novoEvento,
                          dataHoraFim: e.target.value,
                        })
                      }
                    />
                    <button
                      className="btn btn-outline-success"
                      type="button"
                      onClick={handleAddEventoRapido}
                      disabled={loadingEventos}
                    >
                      <i className="fas fa-plus me-1"></i> Adicionar
                    </button>
                  </div>

                  {/* Filtro e Lista */}
                  <div className="d-flex justify-content-end mb-2">
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Mostrar eventos encerrados"
                      className="small text-muted"
                      checked={mostrarPassados}
                      onChange={(e) => setMostrarPassados(e.target.checked)}
                    />
                  </div>

                  <div
                    className="border rounded bg-white p-2"
                    style={{ height: "250px", overflowY: "auto" }}
                  >
                    {eventosFiltrados.length === 0 ? (
                      <p className="text-muted text-center mt-5 small">
                        {eventosDaFeira.length > 0
                          ? "Todos os eventos desta feira já foram encerrados."
                          : "Nenhum evento agendado."}
                      </p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {eventosFiltrados.map((ev) => (
                          <li
                            key={ev.id}
                            className="list-group-item d-flex justify-content-between align-items-center py-2"
                          >
                            <div className="d-flex flex-column">
                              <span className="fw-bold">
                                <i className="fas fa-calendar-day me-2 text-primary"></i>
                                {ev.titulo}
                              </span>
                              <span className="small text-muted ms-4">
                                {new Date(ev.dataHoraInicio).toLocaleString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                                {ev.dataHoraFim
                                  ? ` até ${new Date(ev.dataHoraFim).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                  : ""}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger border-0"
                              onClick={() => handleDeleteEvento(ev.id)}
                              title="Remover"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="form-text text-muted text-end mt-1">
                    Eventos passados somem automaticamente da lista pública.
                  </div>
                </div>
              </Tab>
            )}
          </Tabs>

          <div className="modal-footer bg-light">
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="fw-bold">
              Salvar Dados da Feira
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FeiraFormModal;
