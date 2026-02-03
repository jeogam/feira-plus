import React from 'react';

const MessageViewer = ({ mensagem, assunto }) => {
  if (!mensagem) return null;

  // Verifica se é o formato especial de Expositor
  const isSolicitacaoExpositor = assunto === "QUERO_SER_EXPOSITOR" || mensagem.includes("SOLICITAÇÃO DE CADASTRO");

  // Se for mensagem normal, exibe texto simples
  if (!isSolicitacaoExpositor) {
    return <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{mensagem}</p>;
  }

  // --- LÓGICA DE PARSER (Transforma texto em dados) ---
  const parseDados = (texto) => {
    const linhas = texto.split('\n');
    const dados = {};
    
    linhas.forEach(linha => {
      // Procura padrões como "- Label: Valor"
      if (linha.trim().startsWith('-')) {
        const partes = linha.split(':');
        if (partes.length >= 2) {
          const chave = partes[0].replace('-', '').trim();
          const valor = partes.slice(1).join(':').trim();
          dados[chave] = valor;
        }
      }
    });
    return dados;
  };

  const dados = parseDados(mensagem);

  return (
    <div className="card border-0 shadow-sm bg-light">
      <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
        <div className="d-flex align-items-center mb-2">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
             <i className="fas fa-store fa-lg"></i>
          </div>
          <div>
            <h5 className="fw-bold text-dark mb-0">Candidato a Expositor</h5>
            <span className="badge bg-warning text-dark mt-1">Aguardando Análise</span>
          </div>
        </div>
      </div>
      
      <div className="card-body pt-3">
        <div className="row g-3">
          
          {/* Dados Principais */}
          <div className="col-md-6">
            <label className="small text-muted fw-bold text-uppercase">Nome / Razão Social</label>
            <p className="fw-semibold text-dark mb-0">{dados['Nome/Razão Social'] || dados['Nome'] || '--'}</p>
          </div>

          <div className="col-md-6">
             <label className="small text-muted fw-bold text-uppercase">Documento</label>
             <p className="fw-semibold text-dark mb-0">{dados['Documento (CPF/CNPJ)'] || '--'}</p>
          </div>

          <div className="col-md-6">
             <label className="small text-muted fw-bold text-uppercase">Categoria</label>
             <p className="text-primary fw-bold mb-0">{dados['Categoria'] || '--'}</p>
          </div>

          <div className="col-md-6">
             <label className="small text-muted fw-bold text-uppercase">Telefone</label>
             <div className="d-flex align-items-center">
                <i className="fab fa-whatsapp text-success me-2"></i>
                <span className="fw-semibold">{dados['Telefone'] || '--'}</span>
             </div>
          </div>

          <div className="col-12">
             <label className="small text-muted fw-bold text-uppercase">E-mail</label>
             <p className="mb-0"><a href={`mailto:${dados['E-mail']}`} className="text-decoration-none">{dados['E-mail']}</a></p>
          </div>
          
          <div className="col-12">
             <label className="small text-muted fw-bold text-uppercase">Endereço</label>
             <p className="mb-0 text-dark">{dados['Endereço'] || '--'}</p>
          </div>

          <hr className="my-2 border-secondary opacity-25"/>

          <div className="col-12">
             <label className="small text-muted fw-bold text-uppercase">Produtos / Detalhes</label>
             <div className="bg-white p-3 rounded border">
                {dados['Produtos Principais'] || 'Sem detalhes informados.'}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessageViewer;