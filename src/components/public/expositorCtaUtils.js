// src/components/public/expositorCtaUtils.js

export const montarPayloadExpositorCTA = (form) => {
  // Cria uma mensagem formatada com todos os dados que não têm campo próprio no banco
  const mensagemFormatada = `
  
DADOS PESSOAIS/EMPRESA:
- Nome/Razão Social: ${form.nome}
- Documento (CPF/CNPJ): ${form.documento}
- Categoria: ${form.categoria}
- Telefone: ${form.telefone}
- E-mail: ${form.email}
- Endereço: ${form.endereco || 'Não informado'}

DETALHES:
- Produtos Principais: ${form.produtosPrincipais || 'Não informado'}
- Status Pretendido: ${form.status} (Nota: Aguardando aprovação)
`.trim();

  // Retorna o objeto exato que o ContatoController espera
  return {
    nome: form.nome,
    email: form.email,
    assunto: "QUERO_SER_EXPOSITOR", // O Enum obrigatório do Java
    mensagem: mensagemFormatada
  };
};