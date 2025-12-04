// src/services/api.js
const API_URL = "http://localhost:8080";

// Função interna que faz o trabalho pesado
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("feiraPlus_token");
  const isFormData = options.body instanceof FormData;

  const defaultHeaders = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(API_URL + endpoint, config);

    if (!response.ok) {
      // Tenta ler o erro como JSON, se falhar, usa texto vazio
      const errorData = await response.json().catch(() => ({}));
      // Lança o erro com a mensagem do backend ou status genérico
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }

    // Se for 204 (No Content), não tenta fazer parse do JSON
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json(); // Retorna os DADOS direto
    }
    
    return null;
  } catch (error) {
    throw error;
  }
};

// Exportamos um objeto "api" padrão com os métodos
const api = {
  get: (endpoint) => apiFetch(endpoint, { method: "GET" }),
  
  post: (endpoint, body) => apiFetch(endpoint, { 
    method: "POST", 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  
  put: (endpoint, body) => apiFetch(endpoint, { 
    method: "PUT", 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),

  // --- CORREÇÃO AQUI ---
  // 1. Mudamos de 'request' para 'apiFetch'
  // 2. Mantivemos a lógica de JSON.stringify igual ao post/put
  patch: (endpoint, body) => apiFetch(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
  }),
  
  delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
};

export default api;