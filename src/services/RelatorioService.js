import api from './api';

export const RelatorioService = {
  // Busca os dados de ocupação
  // Endpoint: GET /relatorios/ocupacao
  getOcupacao: async () => {
    try {
      // O api.js já trata o retorno e devolve o JSON direto
      return await api.get('/relatorios/ocupacao');
    } catch (error) {
      console.error("Erro ao buscar relatório de ocupação:", error);
      throw error;
    }
  }
};