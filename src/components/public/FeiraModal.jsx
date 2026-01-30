import React, { useState } from 'react';

const FeiraModal = ({ feira, onClose }) => {
  const [expositorSelecionado, setExpositorSelecionado] = useState(null);

  if (!feira) return null;

  // Formata datas
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const date = new Date(dataString);
    return date.toLocaleDateString('pt-BR');
  };

  // Formata preço com segurança (evita erro .toFixed)
  const formatarPreco = (valor) => {
    if (valor === null || valor === undefined) return '0,00';
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    return isNaN(numero) ? '0,00' : numero.toFixed(2).replace('.', ',');
  };

  const handleClose = () => {
    setExpositorSelecionado(null);
    onClose();
  };

  // Maps Link
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(feira.local || "Irecê, Bahia")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(feira.local || "Irecê, Bahia")}`;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* --- CABEÇALHO --- */}
          <div className="modal-header bg-white border-0 py-3">
            <h5 className="modal-title fw-bold text-dark">
              {expositorSelecionado ? (
                <span><i className="fas fa-store me-2 text-primary"></i>{expositorSelecionado.nome}</span>
              ) : (
                <span><i className="fas fa-calendar-day me-2 text-primary"></i>Detalhes do Evento</span>
              )}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body p-0 bg-light">
            
            {/* =======================================================
                TELA 1: LISTA DE PRODUTOS (Quando clica em "Ver Produtos")
               ======================================================= */}
            {expositorSelecionado ? (
              <div className="p-4 animate__animated animate__fadeIn">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <button 
                    className="btn btn-outline-secondary rounded-pill px-4" 
                    onClick={() => setExpositorSelecionado(null)}
                  >
                    <i className="fas fa-arrow-left me-2"></i> Voltar
                  </button>
                  <span className="badge bg-primary fs-6">{expositorSelecionado.categoriaNome || "Expositor"}</span>
                </div>

                {/* Descrição do Expositor no topo dos produtos */}
                {expositorSelecionado.descricao && (
                  <div className="alert alert-light border mb-4">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    {expositorSelecionado.descricao}
                  </div>
                )}

                <h5 className="fw-bold mb-3">Produtos Disponíveis</h5>

                <div className="row g-4">
                  {(expositorSelecionado.produtos && expositorSelecionado.produtos.length > 0) ? (
                    expositorSelecionado.produtos.map((produto) => (
                      <div key={produto.id} className="col-md-3 col-sm-6">
                        <div className="card h-100 border-0 shadow-sm hover-scale">
                          <div className="position-relative overflow-hidden rounded-top" style={{height: '180px'}}>
                             {/* FOTO DO PRODUTO */}
                             {produto.foto ? (
                               <img src={produto.foto} alt={produto.nome} className="w-100 h-100 object-fit-cover" />
                             ) : (
                               <div className="w-100 h-100 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center text-muted">
                                 <i className="fas fa-camera fa-2x"></i>
                               </div>
                             )}
                          </div>
                          <div className="card-body">
                            <h6 className="fw-bold mb-1 text-truncate" title={produto.nome}>{produto.nome}</h6>
                            <p className="text-muted small mb-2 text-truncate" title={produto.descricao}>
                              {produto.descricao || "Sem descrição detalhada"}
                            </p>
                            <h5 className="text-success fw-bold mb-0">
                              R$ {formatarPreco(produto.preco)}
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <div className="mb-3 text-muted opacity-25">
                         <i className="fas fa-box-open fa-4x"></i>
                      </div>
                      <h5 className="text-muted">Este expositor ainda não cadastrou produtos.</h5>
                    </div>
                  )}
                </div>
              </div>

            ) : (

              /* =======================================================
                 TELA 2: VISUALIZAÇÃO PADRÃO (Detalhes da Feira + Lista Expositores)
                 ======================================================= */
              <div className="row g-0 animate__animated animate__fadeIn" style={{ minHeight: '500px' }}>
                
                {/* LADO ESQUERDO: Info e Expositores */}
                <div className="col-lg-7 p-4 border-end bg-white overflow-auto" style={{ maxHeight: '70vh' }}>
                  
                  {/* Cabeçalho da Feira */}
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 me-3 border" style={{width: '80px', height: '80px'}}>
                      {feira.imagem ? (
                        <img src={feira.imagem} className="w-100 h-100 object-fit-cover rounded-3" alt="" />
                      ) : (
                        <i className="fas fa-store fa-2x text-muted opacity-50"></i>
                      )}
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-1">{feira.nome}</h3>
                      <div className="d-flex flex-wrap gap-2 text-muted small mb-2">
                        <span><i className="far fa-calendar me-1"></i> {formatarData(feira.dataInicio)}</span>
                        <span>•</span>
                        <span><i className="fas fa-map-marker-alt me-1"></i> {feira.local}</span>
                      </div>
                      <p className="text-muted mb-0 small">{feira.descricao || "Venha prestigiar este evento!"}</p>
                    </div>
                  </div>

                  <hr className="my-4 text-secondary opacity-10" />

                  {/* Lista de Expositores */}
                  <h5 className="fw-bold mb-3 text-dark d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-users me-2 text-primary"></i>Expositores</span>
                    <span className="badge bg-light text-dark border">
                      { (feira.associados || feira.expositores || feira.usuarios || []).length } confirmados
                    </span>
                  </h5>
                  
                  <div className="list-group list-group-flush rounded-3 border-0">
                    {(() => {
                        const listaExpositores = feira.associados || feira.expositores || feira.usuarios || [];
                        
                        if (listaExpositores.length > 0) {
                          return listaExpositores.map((associado) => (
                            <div key={associado.id} className="list-group-item border-bottom py-3 px-0">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  
                                  {/* FOTO DO EXPOSITOR */}
                                  <div className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center rounded-circle fw-bold border border-white shadow-sm" style={{width: '50px', height: '50px', minWidth: '50px'}}>
                                    {associado.foto ? (
                                       <img src={associado.foto} className="w-100 h-100 rounded-circle object-fit-cover" alt={associado.nome} /> 
                                    ) : (
                                       <span style={{fontSize: '1.2rem'}}>{(associado.nome || "?").charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>

                                  <div>
                                    <h6 className="mb-0 fw-bold text-dark">{associado.nome || "Nome não informado"}</h6>
                                    
                                    {/* Categoria e Status */}
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                      {associado.categoriaNome && (
                                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill" style={{fontSize: '0.7rem'}}>
                                          {associado.categoriaNome}
                                        </span>
                                      )}
                                      {!associado.categoriaNome && (
                                        <small className="text-muted" style={{fontSize: '0.8rem'}}>Expositor</small>
                                      )}
                                    </div>

                                    {/* Descrição Curta (Se houver) */}
                                    {associado.descricao && (
                                      <p className="text-muted small mb-0 mt-1 text-truncate" style={{maxWidth: '250px'}}>
                                        {associado.descricao}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <button 
                                  className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm"
                                  onClick={() => setExpositorSelecionado(associado)}
                                >
                                  Ver Produtos
                                </button>
                              </div>
                            </div>
                          ));
                        } else {
                           return (
                             <div className="alert alert-light text-center border-0 py-4">
                               <i className="fas fa-user-slash fa-2x text-muted opacity-25 mb-2"></i>
                               <p className="text-muted mb-0">Nenhum expositor confirmado ainda.</p>
                             </div>
                           );
                        }
                    })()}
                  </div>
                </div>

                {/* LADO DIREITO: Mapa Google */}
                <div className="col-lg-5 bg-light p-0 position-relative d-none d-lg-block">
                  <div className="h-100 w-100 position-absolute top-0 start-0">
                    <iframe 
                      title="Localização da Feira"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      loading="lazy" 
                      allowFullScreen 
                      src={mapSrc}
                    ></iframe>
                    
                    <div 
                      className="position-absolute bottom-0 start-0 w-100 p-3"
                      style={{ 
                        zIndex: 10, 
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0) 100%)' 
                      }}
                    >
                       <a 
                         href={mapLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="btn btn-white shadow-sm w-100 fw-bold border"
                       >
                         <i className="fas fa-directions me-2 text-primary"></i> Como Chegar
                       </a>
                    </div>
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