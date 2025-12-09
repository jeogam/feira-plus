import React, { useState, useEffect } from 'react';
import { RelatorioService } from '../services/RelatorioService';
import ErrorModal from '../components/common/ErrorModal'; 


// NOVO COMPONENTE: Modal para listar Expositores (implementação simplificada)
const ExpositorListModal = ({ show, handleClose, feira }) => {
    if (!show) return null;

    const ocupados = feira.espacosOcupados || 0;
    const total = feira.totalEspacos || 0;
    
    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content custom-modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold">Expositores em {feira.nomeFeira}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <p className="mb-3 text-muted small">
                            {ocupados} de {total} espaços ocupados.
                        </p>

                        <ul className="list-group list-group-flush border-top">
                            {(feira.expositores && feira.expositores.length > 0) ? (
                                feira.expositores.map((exp) => (
                                    <li key={exp.id} className="list-group-item d-flex justify-content-between align-items-center ps-0">
                                        <i className="bi bi-person-fill me-2 text-primary"></i>
                                        {exp.nome}
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-center text-muted">
                                    Nenhum expositor atribuído.
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Relatorios = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    
    // NOVO ESTADO: Modal de Lista de Expositores
    const [modalExpositores, setModalExpositores] = useState({ show: false, feira: null });

    const carregarDados = async () => {
        setLoading(true);
        setErro('');
        try {
            const resultado = await RelatorioService.getOcupacao();
            setDados(resultado);
        } catch (error) {
            setErro('Não foi possível carregar os dados do relatório.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // Função para abrir o modal
    const handleShowExpositores = (feira) => {
        setModalExpositores({ show: true, feira });
    };

    // Função auxiliar para definir cor da barra de progresso baseada na porcentagem
    const getProgressColor = (taxa) => {
        if (taxa >= 90) return 'bg-success'; // Verde (Ótimo)
        if (taxa >= 50) return 'bg-primary'; // Azul (Bom)
        if (taxa >= 20) return 'bg-warning'; // Amarelo (Atenção)
        return 'bg-danger';                  // Vermelho (Baixo)
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1F2A37' }}>Relatório de Ocupação</h2>
                <button className="btn btn-outline-secondary" onClick={carregarDados}>
                    <i className="bi bi-arrow-clockwise me-2"></i> Atualizar
                </button>
            </div>

            {erro && (
                <ErrorModal 
                    show={!!erro}
                    handleClose={() => setErro('')}
                    message={erro}
                />
            )}

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Feira</th>
                                    <th className="text-center">Total Espaços</th>
                                    <th className="text-center text-success">Ocupados</th>
                                    <th className="text-center text-muted">Vagos</th>
                                    <th className="ps-4">Taxa de Ocupação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Carregando...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : dados.length > 0 ? (
                                    dados.map((item, index) => (
                                        <tr key={index}>
                                            <td className="ps-4 fw-bold">{item.nomeFeira}</td>
                                            <td className="text-center fw-bold">{item.totalEspacos}</td>
                                            
                                            {/* Coluna Ocupados (AGORA CLICÁVEL) */}
                                            <td className="text-center text-success">
                                                <button 
                                                    className="btn btn-link btn-sm p-0 text-success fw-bold"
                                                    onClick={() => handleShowExpositores(item)}
                                                    title={`Ver ${item.espacosOcupados} expositores`}
                                                >
                                                    {item.espacosOcupados}
                                                    <i className="bi bi-arrow-right-circle-fill ms-1 small"></i>
                                                </button>
                                            </td>
                                            
                                            <td className="text-center text-muted">{item.espacosVagos}</td>
                                            <td className="ps-4" style={{ minWidth: '200px' }}>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2 fw-bold" style={{ width: '45px' }}>{item.taxaOcupacao}%</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div 
                                                            className={`progress-bar ${getProgressColor(item.taxaOcupacao)}`} 
                                                            role="progressbar" 
                                                            style={{ width: `${item.taxaOcupacao}%` }}
                                                            aria-valuenow={item.taxaOcupacao} 
                                                            aria-valuemin="0" 
                                                            aria-valuemax="100"
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            Nenhum dado encontrado para gerar o relatório.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Lista de Expositores */}
            {modalExpositores.show && (
                <ExpositorListModal
                    show={modalExpositores.show}
                    handleClose={() => setModalExpositores({ show: false, feira: null })}
                    feira={modalExpositores.feira}
                />
            )}
        </div>
    );
};

export default Relatorios;