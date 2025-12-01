// URL base da sua API backend
const API_URL = "http://localhost:8080"

// Função genérica para realizar requisições HTTP usando fetch
export const apiFetch = async (endpoint, options = {}) => {

  // Recupera o token salvo no localStorage (para autenticação JWT)
  const token = localStorage.getItem("feiraPlus_token");

  // Verifica se o corpo da requisição é um FormData
  // FormData é usado em uploads de arquivos e NÃO pode ter Content-Type manual
  const isFormData = options.body instanceof FormData;

  // Cabeçalhos padrão da requisição
  const defaultHeaders = {
    // Se NÃO for FormData, define JSON como Content-Type
    ...( !isFormData && { "Content-Type": "application/json" }),

    // Se houver token, adiciona o cabeçalho Authorization
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Monta a configuração final para o fetch,
  // combinando opções recebidas + cabeçalhos padrão + cabeçalhos customizados
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // caso o usuário sobrescreva algo
    },
  };

  try {
    // Executa a requisição para a API
    const response = await fetch(API_URL + endpoint, config);

    // Se a resposta NÃO estiver OK (status 4xx ou 5xx)
    if (!response.ok) {
      // Tenta extrair o JSON de erro vindo do backend
      const errorData = await response.json().catch(() => ({}));
      
      // Lança um erro com a mensagem retornada ou com o status da resposta
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }

    // Verifica o tipo de conteúdo retornado pela API
    const contentType = response.headers.get("content-type");

    // Se for JSON, retorna o conteúdo convertido
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    // Se não for JSON, retorna null (útil para respostas vazias, como DELETE)
    return null;

  } catch (error) {
    // Repassa o erro para quem chamou a função tratar
    throw error;
  }
};
