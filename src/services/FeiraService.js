// src/services/FeiraService.js
import api from './api'; // Agora isso vai funcionar!

const ENDPOINT_EVENTOS = '/feiras/eventos';
const ENDPOINT_PERMANENTES = '/feiras/permanentes';

export const FeiraService = {
  
  listarTodas: async () => {
    try {
      // Como o api.js agora retorna o JSON direto (response.json()),
      // não usamos mais ".data" aqui, usamos o resultado direto.
      const [listaEventos, listaPermanentes] = await Promise.all([
        api.get(ENDPOINT_EVENTOS),
        api.get(ENDPOINT_PERMANENTES)
      ]);

      // Verifica se é array antes de dar map (segurança)
      const eventos = Array.isArray(listaEventos) 
          ? listaEventos.map(f => ({ ...f, tipo: 'EVENTO' })) 
          : [];
          
      const permanentes = Array.isArray(listaPermanentes) 
          ? listaPermanentes.map(f => ({ ...f, tipo: 'PERMANENTE' })) 
          : [];

      return [...eventos, ...permanentes];
    } catch (error) {
      console.error("Erro ao buscar feiras:", error);
      throw error;
    }
  },

  // 🔥 ATUALIZADO: Recebe o usuarioId como parâmetro extra
  salvar: async (feira, usuarioIdLogado) => {
    const { tipo, id, ...dadosOriginais } = feira;
    
    const dadosParaEnvio = {
        ...dadosOriginais,
        
        // Usa o ID passado ou assume que o backend pega do Token
        // Se seu backend EXIGE o campo usuarioId no JSON, use a linha abaixo:
        usuarioId: usuarioIdLogado, 

        horaAbertura: dadosOriginais.horaAbertura.length === 5 ? `${dadosOriginais.horaAbertura}:00` : dadosOriginais.horaAbertura,
        horaFechamento: dadosOriginais.horaFechamento.length === 5 ? `${dadosOriginais.horaFechamento}:00` : dadosOriginais.horaFechamento,
    };
    
    if (tipo === 'EVENTO') {
      return await api.post(ENDPOINT_EVENTOS, dadosParaEnvio);
    } else {
      return await api.post(ENDPOINT_PERMANENTES, dadosParaEnvio);
    }
  },

  atualizar: async (id, feira, usuarioIdLogado) => {
    const { tipo, ...dadosParaEnvio } = feira;
    
    // Se precisar passar o ID na edição também:
    // dadosParaEnvio.usuarioId = usuarioIdLogado; 
    
    if (tipo === 'EVENTO') {
      return await api.put(`${ENDPOINT_EVENTOS}/${id}`, dadosParaEnvio);
    } else {
      return await api.put(`${ENDPOINT_PERMANENTES}/${id}`, dadosParaEnvio);
    }
  },

  excluir: async (id, tipo) => {
    if (tipo === 'EVENTO') {
      return await api.delete(`${ENDPOINT_EVENTOS}/${id}`);
    } else {
      return await api.delete(`${ENDPOINT_PERMANENTES}/${id}`);
    }
  }
};