// Utilitário para montar payload do expositor a partir do formulário do CTA
export function montarPayloadExpositorCTA(form) {
  return {
    nome: form.nome,
    documento: form.documento,
    categoria: form.categoria,
    telefone: form.telefone,
    email: form.email,
    endereco: form.endereco || '',
    status: form.status || 'ATIVO',
    produtosPrincipais: form.produtosPrincipais || '',
    origem: 'CTA_QUERO_SER_EXPOSITOR', // para diferenciar no backend
    mensagem: 'Quero ser expositor',
  };
}
