// src/services/ContatoService.js
import api from './api';

export const ContatoService = {
  /**
   * Envia uma mensagem de contato/sugestão
   * @param {Object} contato - {nome, email, assunto, mensagem}
   * @returns {Promise<Object>}
   */
  enviarMensagem: async (contato) => {
    try {
      const response = await api.post('/contato', contato);
      return response;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  /**
   * Lista todas as mensagens (admin)
   * @returns {Promise<Array>}
   */
  listarMensagens: async () => {
    try {
      const response = await api.get('/contato');
      return response;
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      throw error;
    }
  },

  /**
   * Marca mensagem como lida (admin)
   * @param {number} id
   * @returns {Promise<void>}
   */
  marcarComoLida: async (id) => {
    try {
      await api.patch(`/contato/${id}/lida`);
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      throw error;
    }
  },

  marcarComoNaoLida: async (id) => {
    try {
      await api.patch(`/contato/${id}/nao-lida`);
    } catch (error) {
      console.error('Erro ao marcar mensagem como não lida:', error);
      throw error;
    }
  },

  /**
   * Exclui uma mensagem (admin)
   * @param {number} id
   * @returns {Promise<void>}
   */
  excluir: async (id) => {
    try {
      await api.delete(`/api/contato/${id}`);
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      throw error;
    }
  }
};

export default ContatoService;
