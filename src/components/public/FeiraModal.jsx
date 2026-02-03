import React, { useState } from "react";

const FeiraModal = ({ feira, onClose }) => {
  const [expositorSelecionado, setExpositorSelecionado] = useState(null);
  const [activeTab, setActiveTab] = useState("geral"); // 'geral' ou 'eventos'

  if (!feira) return null;

  // --- FUNÇÕES DE FORMATAÇÃO ---

  const formatarPreco = (valor) => {
    if (valor === null || valor === undefined) return "0,00";
    const numero = typeof valor === "string" ? parseFloat(valor) : valor;
    return isNaN(numero) ? "0,00" : numero.toFixed(2).replace(".", ",");
  };

  const formatarDataGeral = (dataString) => {
    if (!dataString) return "";
    const date = new Date(dataString);
    return date.toLocaleDateString("pt-BR");
  };

  // Extrai o DIA (ex: 12)
  const getDia = (dataString) => {
    if (!dataString) return "--";
    return new Date(dataString).getDate().toString().padStart(2, "0");
  };

  // Extrai o MÊS abreviado (ex: AGO)
  const getMes = (dataString) => {
    if (!dataString) return "";
    return new Date(dataString)
      .toLocaleDateString("pt-BR", { month: "short" })
      .toUpperCase()
      .replace(".", "");
  };

  // Extrai a HORA (ex: 14:30)
  const getHora = (dataString) => {
    if (!dataString) return "";
    return new Date(dataString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClose = () => {
    setExpositorSelecionado(null);
    setActiveTab("geral");
    onClose();
  };

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(feira.local || "Irecê, Bahia")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // Lista de eventos vindo do DTO
  const listaEventos = feira.eventos || [];

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(5px)",
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div
          className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          {/* --- CABEÇALHO --- */}
          <div className="modal-header bg-white border-0 py-3">
            <h5 className="modal-title fw-bold text-dark">
              {expositorSelecionado ? (
                <span>
                  <i className="fas fa-store me-2 text-primary"></i>
                  {expositorSelecionado.nome}
                </span>
              ) : (
                <span>
                  <i className="fas fa-calendar-day me-2 text-primary"></i>
                  {feira.nome}
                </span>
              )}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body p-0 bg-light">
            {/* 1. VISÃO DE PRODUTOS DO EXPOSITOR (Mantida) */}
            {expositorSelecionado ? (
              <div className="p-4 animate__animated animate__fadeIn">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4 mb-4"
                  onClick={() => setExpositorSelecionado(null)}
                >
                  <i className="fas fa-arrow-left me-2"></i> Voltar
                </button>

                <h5 className="fw-bold mb-3">
                  Produtos de {expositorSelecionado.nome}
                </h5>
                <div className="row g-4">
                  {expositorSelecionado.produtos &&
                  expositorSelecionado.produtos.length > 0 ? (
                    expositorSelecionado.produtos.map((produto) => (
                      <div key={produto.id} className="col-md-3 col-sm-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div
                            className="position-relative overflow-hidden rounded-top"
                            style={{ height: "150px" }}
                          >
                            {produto.foto ? (
                              <img
                                src={produto.foto}
                                className="w-100 h-100 object-fit-cover"
                                alt=""
                              />
                            ) : (
                              <div className="bg-light h-100 d-flex align-items-center justify-content-center">
                                <i className="fas fa-camera text-muted"></i>
                              </div>
                            )}
                          </div>
                          <div className="card-body">
                            <h6 className="fw-bold text-truncate">
                              {produto.nome}
                            </h6>
                            <p className="text-success fw-bold">
                              R$ {formatarPreco(produto.preco)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5 text-muted">
                      Este expositor não possui produtos cadastrados.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 2. VISÃO PRINCIPAL (COM ABAS) */
              <div className="d-flex flex-column h-100">
                {/* BARRA DE ABAS */}
                <div className="bg-white px-4 border-bottom">
                  <ul className="nav nav-tabs border-0 gap-3">
                    <li className="nav-item">
                      <button
                        className={`nav-link border-0 py-3 px-2 fw-bold ${activeTab === "geral" ? "active text-primary border-bottom border-primary border-3" : "text-muted"}`}
                        onClick={() => setActiveTab("geral")}
                      >
                        <i className="fas fa-info-circle me-2"></i> Geral &
                        Expositores
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link border-0 py-3 px-2 fw-bold ${activeTab === "eventos" ? "active text-primary border-bottom border-primary border-3" : "text-muted"}`}
                        onClick={() => setActiveTab("eventos")}
                      >
                        <i className="fas fa-calendar-alt me-2"></i> Agenda{" "}
                        <span className="badge bg-light text-dark ms-2 border">
                          {listaEventos.length}
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="row g-0 flex-grow-1">
                  {/* CONTEÚDO DA ESQUERDA */}
                  <div
                    className="col-lg-7 p-4 overflow-auto"
                    style={{ maxHeight: "65vh" }}
                  >
                    {/* ABA GERAL */}
                    {activeTab === "geral" && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="d-flex align-items-start mb-4">
                          <div
                            className="bg-white border rounded p-1 me-3 flex-shrink-0"
                            style={{ width: "80px", height: "80px" }}
                          >
                            {feira.imagem ? (
                              <img
                                src={feira.imagem}
                                className="w-100 h-100 object-fit-cover rounded"
                                alt=""
                              />
                            ) : (
                              <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                <i className="fas fa-store text-muted"></i>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-dark mb-2">
                              {feira.descricao || "Venha conhecer esta feira!"}
                            </p>
                            <div className="d-flex gap-3 text-muted small">
                              <span>
                                <i className="fas fa-map-marker-alt me-1 text-danger"></i>{" "}
                                {feira.local}
                              </span>
                              <span>
                                <i className="far fa-calendar me-1"></i>{" "}
                                {formatarDataGeral(feira.dataInicio)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">
                          Expositores Confirmados
                        </h6>
                        <div className="list-group list-group-flush">
                          {(() => {
                            const lista = feira.expositores || []; // DTO Atualizado usa 'expositores'
                            if (lista.length > 0) {
                              return lista.map((exp) => (
                                <div
                                  key={exp.id}
                                  className="list-group-item border-bottom-0 py-2 d-flex justify-content-between align-items-center px-0 hover-bg-light rounded px-2"
                                >
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                                      style={{ width: "40px", height: "40px" }}
                                    >
                                      {exp.foto ? (
                                        <img
                                          src={exp.foto}
                                          className="w-100 h-100 rounded-circle object-fit-cover"
                                          alt=""
                                        />
                                      ) : (
                                        exp.nome?.[0] || "?"
                                      )}
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-bold text-dark">
                                        {exp.nome}
                                      </h6>
                                      <small
                                        className="text-muted"
                                        style={{ fontSize: "0.8rem" }}
                                      >
                                        {exp.categoriaNome || "Expositor"}
                                      </small>
                                    </div>
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-primary rounded-pill"
                                    onClick={() => setExpositorSelecionado(exp)}
                                  >
                                    Ver Produtos
                                  </button>
                                </div>
                              ));
                            }
                            return (
                              <div className="text-muted small py-2 text-center border rounded bg-light">
                                Nenhum expositor confirmado.
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* --- ABA EVENTOS (ATUALIZADA) --- */}
                    {activeTab === "eventos" && (
                      <div className="animate__animated animate__fadeIn">
                        <h6 className="fw-bold mb-4 text-dark">
                          Cronograma de Atividades
                        </h6>

                        <div className="d-flex flex-column gap-3">
                          {listaEventos.length > 0 ? (
                            listaEventos.map((evento, index) => (
                              <div
                                key={index}
                                className="card border-0 shadow-sm"
                              >
                                <div className="card-body d-flex align-items-center p-3">
                                  {/* BLOCO DE DATA (ESQUERDA) */}
                                  <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex flex-column align-items-center justify-content-center me-3 flex-shrink-0"
                                    style={{ width: "60px", height: "60px" }}
                                  >
                                    <span
                                      className="fw-bold h5 mb-0"
                                      style={{ lineHeight: 1 }}
                                    >
                                      {getDia(evento.dataHoraInicio)}
                                    </span>
                                    <span
                                      className="small text-uppercase fw-bold"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      {getMes(evento.dataHoraInicio)}
                                    </span>
                                  </div>

                                  {/* CONTEÚDO DO EVENTO */}
                                  <div className="flex-grow-1 border-start ps-3">
                                    <h6 className="fw-bold text-dark mb-1">
                                      {evento.titulo || "Evento sem título"}
                                    </h6>

                                    {/* Horário */}
                                    <div className="text-muted small mb-1">
                                      <i className="far fa-clock me-1 text-primary"></i>
                                      {getHora(evento.dataHoraInicio)}
                                      {evento.dataHoraFim &&
                                        ` - ${getHora(evento.dataHoraFim)}`}
                                    </div>

                                    {/* Descrição */}
                                    {evento.descricao && (
                                      <p
                                        className="text-secondary small mb-0 text-truncate"
                                        style={{ maxWidth: "350px" }}
                                        title={evento.descricao}
                                      >
                                        {evento.descricao}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="alert alert-light text-center py-4">
                              <i className="far fa-calendar-times fa-2x mb-3 text-muted opacity-50"></i>
                              <p className="mb-0 text-muted">
                                Nenhuma atividade programada.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LADO DIREITO: MAPA (Fixo) */}
                  <div className="col-lg-5 bg-light d-none d-lg-block position-relative">
                    <iframe
                      title="mapa"
                      width="100%"
                      height="100%"
                      src={mapSrc}
                      style={{ border: 0 }}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeiraModal;
