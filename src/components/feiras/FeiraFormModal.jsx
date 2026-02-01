import React, { useState, useEffect } from "react";

const FeiraFormModal = ({
  show,
  handleClose,
  handleSave,
  feiraParaEditar,
  expositoresDisponiveis = [],
  loadingExpositores = false,
}) => {
  const PLACEHOLDER_IMG = "https://via.placeholder.com/80?text=Foto";

  const frequencias = [
    "DIARIO",
    "SEMANAL",
    "QUINZENAL",
    "MENSAL",
    "BIMESTRAL",
    "TRIMESTRAL",
    "SEMESTRAL",
    "ANUAL",
  ];

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
    nota: 0, // ✅ NOVO: Estado inicial da nota
  };

  const [formData, setFormData] = useState(initialFormState);

  const previewSrc = formData.foto?.trim()
    ? formData.foto.trim()
    : PLACEHOLDER_IMG;

  useEffect(() => {
    if (feiraParaEditar) {
      const tipoDetectado = feiraParaEditar.frequencia ? "PERMANENTE" : "EVENTO";

      const idsAtuais = feiraParaEditar.expositores
        ? feiraParaEditar.expositores.map((exp) => exp.id)
        : [];

      setFormData({
        ...feiraParaEditar,
        tipo: tipoDetectado,
        espacos: Number(feiraParaEditar.espacos || 0),
        foto: feiraParaEditar.foto || "", 
        expositorIds: idsAtuais,
        nota: feiraParaEditar.nota || 0, // ✅ Carrega a nota existente
      });
    } else {
      setFormData(initialFormState);
    }
  }, [feiraParaEditar, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "expositorIds") {
      const selectedOptions = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => Number(option.value));
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      const finalValue = name === "espacos" ? Number(value) : value;
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  // ✅ Função para clicar na estrela e definir a nota
  const handleStarClick = (valor) => {
    setFormData((prev) => ({ ...prev, nota: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dadosFinais = { ...formData };

    if (formData.tipo === "EVENTO") {
      delete dadosFinais.frequencia;
    } else {
      delete dadosFinais.dataInicio;
      delete dadosFinais.dataFim;
    }

    handleSave(dadosFinais);
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content custom-modal-content">
          <div className="modal-header border-0">
            <h5
              className="modal-title fw-bold"
              style={{ color: "var(--primary-color)" }}
            >
              {feiraParaEditar ? "Editar Feira" : "Nova Feira"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
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
                      id="tipoEvento"
                      value="EVENTO"
                      checked={formData.tipo === "EVENTO"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="tipoEvento">
                      Feira Evento (Datas Específicas)
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="tipo"
                      id="tipoPermanente"
                      value="PERMANENTE"
                      checked={formData.tipo === "PERMANENTE"}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="tipoPermanente"
                    >
                      Feira Permanente (Recorrente)
                    </label>
                  </div>
                </div>
              )}

              {/* CAMPOS PRINCIPAIS */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nome da Feira</label>
                  <input
                    type="text"
                    name="nome"
                    className="form-control custom-input"
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
                    className="form-control custom-input"
                    value={formData.local}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label fw-bold">URL da Foto</label>
                  <div className="d-flex gap-3 align-items-center">
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="rounded border"
                      style={{ width: 56, height: 56, objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMG;
                      }}
                    />
                    <input
                      type="text"
                      name="foto"
                      className="form-control custom-input"
                      value={formData.foto}
                      onChange={handleChange}
                      placeholder="https://... (ou base64)"
                    />
                  </div>
                </div>

                {/* ✅ CAMPO DE AVALIAÇÃO (ESTRELAS) */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Avaliação (1-5)</label>
                  <div className="d-flex align-items-center gap-1 fs-4" style={{ cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star ${star <= formData.nota ? 'text-warning' : 'text-muted opacity-25'}`}
                        onClick={() => handleStarClick(star)}
                        title={`Avaliar com ${star} estrela(s)`}
                      ></i>
                    ))}
                    <span className="ms-2 fs-6 text-muted">
                        ({Number(formData.nota).toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Hora Abertura</label>
                  <input
                    type="time"
                    name="horaAbertura"
                    className="form-control custom-input"
                    value={formData.horaAbertura}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Hora Fechamento</label>
                  <input
                    type="time"
                    name="horaFechamento"
                    className="form-control custom-input"
                    value={formData.horaFechamento}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Total de Espaços</label>
                  <input
                    type="number"
                    name="espacos"
                    className="form-control custom-input"
                    value={formData.espacos}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <hr />
              <div className="row">
                <div className="col-md-6">
                  {formData.tipo === "EVENTO" ? (
                    <div className="row fade-in">
                      <h6 className="text-muted mb-3">Datas do Evento</h6>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">
                          Data Início
                        </label>
                        <input
                          type="date"
                          name="dataInicio"
                          className="form-control custom-input"
                          value={formData.dataInicio}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Data Fim</label>
                        <input
                          type="date"
                          name="dataFim"
                          className="form-control custom-input"
                          value={formData.dataFim}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row fade-in">
                      <h6 className="text-muted mb-3">Frequência</h6>
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Frequência</label>
                        <select
                          name="frequencia"
                          className="form-select custom-input"
                          value={formData.frequencia}
                          onChange={handleChange}
                          required
                        >
                          {frequencias.map((freq) => (
                            <option key={freq} value={freq}>
                              {freq}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted mb-3">Expositores Participantes</h6>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">
                      Selecione (Ctrl/Cmd para múltiplos)
                    </label>

                    {loadingExpositores ? (
                      <div className="text-center text-muted">
                        Carregando lista de expositores...
                      </div>
                    ) : (
                      <select
                        name="expositorIds"
                        className="form-select custom-input"
                        multiple
                        value={formData.expositorIds.map(String)}
                        onChange={handleChange}
                        size="8"
                        style={{ minHeight: "200px" }}
                      >
                        {expositoresDisponiveis.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.nome}
                          </option>
                        ))}
                      </select>
                    )}
                    <div className="form-text text-muted">
                      Use Ctrl/Cmd para selecionar ou desmarcar múltiplos
                      expositores.
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn custom-btn-primary fw-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeiraFormModal;