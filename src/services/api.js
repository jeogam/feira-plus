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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
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

// AQUI ESTÁ A MÁGICA: Exportamos um objeto "api" padrão com os métodos
const api = {
  get: (endpoint) => apiFetch(endpoint, { method: "GET" }),
  
  // No POST/PUT, se não for FormData, transformamos em JSON string
  post: (endpoint, body) => apiFetch(endpoint, { 
    method: "POST", 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  
  put: (endpoint, body) => apiFetch(endpoint, { 
    method: "PUT", 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  
  delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
};

export default api;