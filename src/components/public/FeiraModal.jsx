import React, { useState } from 'react';
import { FeiraService } from '../../services/FeiraService'; // ✅ Importar Services
import { ExpositorService } from '../../services/ExpositorService';
import Swal from 'sweetalert2'; // Opcional, para feedback visual

const FeiraModal = ({ feira, onClose }) => {
  const [expositorSelecionado, setExpositorSelecionado] = useState(null);
  
  // Estados locais para controlar a nota exibida instantaneamente após votar
  const [notaFeira, setNotaFeira] = useState(feira ? feira.nota : 0);
  const [notaExpositor, setNotaExpositor] = useState(0);

  // Atualiza nota local se a feira mudar
  React.useEffect(() => {
    if (feira) setNotaFeira(feira.nota || 0);
  }, [feira]);

  React.useEffect(() => {
    if (expositorSelecionado) setNotaExpositor(expositorSelecionado.nota || 0);
  }, [expositorSelecionado]);

  if (!feira) return null;

  // --- LÓGICA DE AVALIAÇÃO ---
  const handleAvaliarFeira = async (novaNota) => {
    try {
        await FeiraService.avaliar(feira.id, feira.tipoFeira || (feira.frequencia ? "PERMANENTE" : "EVENTO"), novaNota);
        setNotaFeira(novaNota); // Atualiza UI
        Swal.fire({
            icon: 'success',
            title: 'Avaliação enviada!',
            text: `Você avaliou a feira com ${novaNota} estrelas.`,
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Erro ao avaliar feira:", error);
        Swal.fire('Erro', 'Não foi possível registrar sua avaliação.', 'error');
    }
  };

  const handleAvaliarExpositor = async (novaNota) => {
    if (!expositorSelecionado) return;
    try {
        await ExpositorService.avaliar(expositorSelecionado.id, novaNota);
        setNotaExpositor(novaNota); // Atualiza UI local
        
        // Atualiza o objeto do expositor selecionado para manter consistência se navegar
        setExpositorSelecionado(prev => ({...prev, nota: novaNota}));
        
        Swal.fire({
            icon: 'success',
            title: 'Avaliação enviada!',
            text: `Você avaliou o expositor com ${novaNota} estrelas.`,
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Erro ao avaliar expositor:", error);
        Swal.fire('Erro', 'Não foi possível registrar sua avaliação.', 'error');
    }
  };

  // --- COMPONENTE VISUAL DE ESTRELAS ---
  // Adicionei o parametro 'onClick' para permitir interação
  const RenderEstrelas = ({ nota, tamanho = "", onClick = null }) => {
    const estrelas = [];
    const valor = nota || 0;
    
    // Define se é interativo (tem função onClick)
    const isInteractive = !!onClick; 
    const cursorStyle = isInteractive ? { cursor: 'pointer' } : {};

    for (let i = 1; i <= 5; i++) {
        let classeIcone = "far fa-star text-muted opacity-25"; // Vazia padrão

        if (i <= valor) {
            classeIcone = "fas fa-star text-warning"; // Cheia
        } else if (i - 0.5 <= valor) {
            classeIcone = "fas fa-star-half-alt text-warning"; // Meia
        }

        estrelas.push(
            <i 
                key={i} 
                className={`${classeIcone} ${tamanho}`} 
                style={cursorStyle}
                onClick={isInteractive ? () => onClick(i) : undefined}
                title={isInteractive ? `Avaliar com ${i}` : ''}
            ></i>
        );
    }
    return (
        <span className="ms-2 text-nowrap">
            {estrelas} 
            <small className="text-muted ms-1 fs-6">({Number(valor).toFixed(1)})</small>
        </span>
    );
  };

  // ... (formatarData e formatarPreco mantidos)
  const formatarData = (dataArray) => {
      if (!dataArray) return "";
      if (Array.isArray(dataArray)) {
        const [ano, mes, dia] = dataArray;
        return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
      }
      return dataArray; 
  };
  
  const formatarPreco = (preco) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
  };

  // ... (handleClose mantido)
    const handleModalClose = () => {
    setExpositorSelecionado(null);
    onClose();
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          <div className="modal-header border-0 bg-white pb-0">
             <button type="button" className="btn-close" onClick={handleModalClose}></button>
          </div>

          <div className="modal-body p-0 bg-light">
            
            {/* TELA 1: DETALHES DO EXPOSITOR (Se selecionado) */}
            {expositorSelecionado ? (
              <div className="p-4 animate__animated animate__fadeIn">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={() => setExpositorSelecionado(null)}
                  >
                    <i className="bi bi-arrow-left me-2"></i> Voltar para Feira
                  </button>
                </div>

                {/* Info do Expositor com Avaliação Interativa */}
                <div className="mb-4 bg-white p-4 rounded shadow-sm">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <h4 className="fw-bold mb-0">
                            {expositorSelecionado.nome}
                        </h4>
                        {/* ✅ Estrelas Interativas */}
                        <div>
                            <span className="me-2 text-muted small">Sua avaliação:</span>
                            <RenderEstrelas 
                                nota={notaExpositor} 
                                tamanho="fs-4" 
                                onClick={handleAvaliarExpositor} 
                            />
                        </div>
                    </div>
                    {expositorSelecionado.descricao && (
                        <p className="text-muted mt-2">{expositorSelecionado.descricao}</p>
                    )}
                </div>

                <h5 className="fw-bold mb-3">Produtos Disponíveis</h5>
                {/* ... (Renderização de produtos mantida) ... */}
                 <div className="row g-4">
                  {(expositorSelecionado.produtos && expositorSelecionado.produtos.length > 0) ? (
                    expositorSelecionado.produtos.map((produto) => (
                      <div key={produto.id} className="col-md-3 col-sm-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <img 
                            src={produto.foto || "https://via.placeholder.com/150"} 
                            className="card-img-top" 
                            alt={produto.nome}
                            style={{height: '150px', objectFit: 'cover'}}
                          />
                          <div className="card-body">
                            <h6 className="fw-bold mb-1 text-truncate" title={produto.nome}>{produto.nome}</h6>
                            <p className="text-muted small mb-2 text-truncate">{produto.descricao}</p>
                            <p className="fw-bold text-success mb-0">{formatarPreco(produto.preco)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5 text-muted">Este expositor ainda não cadastrou produtos.</div>
                  )}
                </div>

              </div>

            ) : (

              /* TELA 2: VISUALIZAÇÃO DA FEIRA (PADRÃO) */
              <div className="row g-0 animate__animated animate__fadeIn" style={{ minHeight: '500px' }}>
                
                <div className="col-lg-7 p-4 border-end bg-white overflow-auto" style={{ maxHeight: '80vh' }}>
                  
                  {/* Cabeçalho da Feira com Avaliação */}
                  <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3 className="fw-bold text-dark mb-1">{feira.nome}</h3>
                         {/* ✅ Estrelas Interativas da Feira */}
                         <div className="text-end">
                            <small className="d-block text-muted" style={{fontSize: '0.75rem'}}>Avalie esta feira:</small>
                            <RenderEstrelas 
                                nota={notaFeira} 
                                tamanho="fs-5" 
                                onClick={handleAvaliarFeira} 
                            />
                         </div>
                      </div>
                      
                      <p className="text-muted mb-2">
                        <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                        {feira.local}
                      </p>
                      
                      <div className="d-flex gap-3 text-small text-muted mb-3">
                        {feira.tipoFeira === "EVENTO" ? (
                            <span><i className="bi bi-calendar-event me-1"></i> {formatarData(feira.dataInicio)} até {formatarData(feira.dataFim)}</span>
                        ) : (
                            <span><i className="bi bi-arrow-repeat me-1"></i> {feira.frequencia}</span>
                        )}
                         <span><i className="bi bi-clock me-1"></i> {feira.horaAbertura} - {feira.horaFechamento}</span>
                      </div>
                  </div>

                  <h5 className="fw-bold mb-3 border-bottom pb-2">Expositores</h5>
                  
                  <div className="list-group list-group-flush rounded-3 border-0">
                    {(() => {
                        const listaExpositores = feira.associados || feira.expositores || feira.usuarios || [];
                        
                        if (listaExpositores.length > 0) {
                          return listaExpositores.map((associado) => (
                            <div key={associado.id} className="list-group-item border-bottom py-3 px-0">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={associado.foto || "https://via.placeholder.com/50"} 
                                    className="rounded-circle me-3 border" 
                                    width="50" height="50" 
                                    alt="Expositor" 
                                    style={{objectFit: 'cover'}}
                                  />
                                  <div>
                                    <h6 className="mb-0 fw-bold text-dark">
                                        {associado.nome}
                                        {/* Apenas exibe nota aqui, não interativo na lista para não poluir */}
                                        <RenderEstrelas nota={associado.nota} tamanho="small" /> 
                                    </h6>
                                    <small className="text-muted">{associado.descricao || "Sem descrição"}</small>
                                  </div>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                  onClick={() => setExpositorSelecionado(associado)}
                                >
                                  Ver Produtos
                                </button>
                              </div>
                            </div>
                          ));
                        } else {
                           return <div className="text-center py-4 text-muted">Nenhum expositor confirmado ainda.</div>
                        }
                    })()}
                  </div>
                </div>

                {/* Coluna Direita (Mapa ou Foto Grande) */}
                <div className="col-lg-5 bg-light d-none d-lg-block" style={{ 
                    backgroundImage: `url(${feira.foto || 'https://via.placeholder.com/600x800'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100%'
                }}>
                   <div className="h-100 w-100" style={{background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7))'}}></div>
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