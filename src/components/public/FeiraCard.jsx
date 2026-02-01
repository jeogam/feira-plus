import React from "react";

const FeiraCard = ({ feira, onVerDetalhes }) => {
  // Função auxiliar interna para formatar data
  const formatarData = (dataArray) => {
    if (!dataArray) return "N/A";
    if (Array.isArray(dataArray)) {
      return new Date(
        dataArray[0],
        dataArray[1] - 1,
        dataArray[2],
      ).toLocaleDateString();
    }
    return new Date(dataArray).toLocaleDateString();
  };

  // ✅ Função para renderizar estrelas (somente leitura)
  const renderEstrelas = (nota) => {
    const estrelas = [];
    const valor = nota || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= valor) {
        estrelas.push(<i key={i} className="fas fa-star text-warning small"></i>);
      } else if (i - 0.5 <= valor) {
        estrelas.push(<i key={i} className="fas fa-star-half-alt text-warning small"></i>);
      } else {
        estrelas.push(<i key={i} className="far fa-star text-muted opacity-25 small"></i>);
      }
    }
    return (
        <div className="mb-2" title={`Nota: ${valor.toFixed(1)}`}>
            {estrelas} 
            <small className="text-muted ms-1" style={{fontSize: '0.8rem'}}>
                ({valor.toFixed(1)})
            </small>
        </div>
    );
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm border-0 card-hover">
        {/* Imagem */}
        <div
          className="card-img-top bg-light d-flex align-items-center justify-content-center"
          style={{ height: "200px", overflow: "hidden" }}
        >
          {feira.foto ? (
            <img
              src={feira.foto}
              alt={feira.nome}
              className="w-100 h-100 object-fit-cover"
            />
          ) : (
            <div className="text-center text-muted">
              <i className="bi bi-image fs-1"></i>
              <p className="m-0 small">Sem Foto</p>
            </div>
          )}
        </div>

        {/* Corpo */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-brand fw-bold mb-1">{feira.nome}</h5>

          {/* ✅ EXIBE AS ESTRELAS ABAIXO DO TÍTULO */}
          {renderEstrelas(feira.nota)}

          <p className="card-text text-muted mb-2">
            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
            {feira.local}
          </p>

          <div className="mb-3">
            {feira.tipo === "EVENTO" ? (
              <span className="badge badge-evento rounded-pill">
                <i className="bi bi-calendar-event me-1"></i>
                {formatarData(feira.dataInicio)}
              </span>
            ) : (
              <span className="badge badge-permanente rounded-pill">
                <i className="fas fa-building me-1"></i>
                Permanente
              </span>
            )}
          </div>

          <button
            className="btn btn-brand mt-auto w-100 btn border"
            onClick={() => onVerDetalhes(feira)}
          >
            <i className="far fa-eye me-2"></i>
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeiraCard;