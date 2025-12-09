import api from './api';

const ENDPOINT = '/espacos';

export const EspacoService = {
  
  // Lista todos e filtra pelo ID da feira no lado do cliente
  // (Nota: Idealmente, crie um endpoint @GetMapping("/feira/{feiraId}") no Java para performance)
  listarPorFeira: async (feiraId) => {
    try {
      const todosEspacos = await api.get(ENDPOINT);
      
      // Verifica se é array e filtra
      if (Array.isArray(todosEspacos)) {
        // Compara convertendo para string/int para garantir
        return todosEspacos.filter(e => e.feiraId == feiraId);
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar espaços:", error);
      throw error;
    }
  },

  // Salva enviando o feiraId junto, conforme o Controller Java espera
  salvar: async (espaco) => {
    return await api.post(ENDPOINT, espaco);
  },

  // Atualiza dados (usado para mudar status também)
  atualizar: async (id, espaco) => {
    return await api.put(`${ENDPOINT}/${id}`, espaco);
  },

  excluir: async (id) => {
    return await api.delete(`${ENDPOINT}/${id}`);
  },
  
  // Lógica para alternar status (Ocupar / Liberar)
  alternarStatus: async (espaco) => {
    const novoStatus = espaco.status === 'LIVRE' ? 'OCUPADO' : 'LIVRE';
    // Precisamos enviar o objeto completo atualizado
    const payload = { ...espaco, status: novoStatus };
    return await api.put(`${ENDPOINT}/${espaco.id}`, payload);
  }
};