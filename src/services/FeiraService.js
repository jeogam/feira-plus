import api from './api';

const ENDPOINT_EVENTOS = '/feiras/eventos';
const ENDPOINT_PERMANENTES = '/feiras/permanentes';

export const FeiraService = {
  
  // BUSCAR TODAS
  listarTodas: async () => {
    try {
      const [resEventos, resPermanentes] = await Promise.all([
        api.get(ENDPOINT_EVENTOS),
        api.get(ENDPOINT_PERMANENTES)
      ]);

      const eventos = resEventos.data.map(f => ({ ...f, tipo: 'EVENTO' }));
      const permanentes = resPermanentes.data.map(f => ({ ...f, tipo: 'PERMANENTE' }));

      return [...eventos, ...permanentes];
    } catch (error) {
      console.error("Erro ao buscar feiras:", error);
      throw error;
    }
  },

  // --- AQUI ESTÁ A FUNÇÃO SALVAR COM O "JEITINHO" ---
  salvar: async (feira) => {
    const { tipo, id, ...dadosOriginais } = feira;
    
    // Preparação dos dados
    const dadosParaEnvio = {
        ...dadosOriginais,
        
        // 1. INSERINDO O ID FIXO AQUI (Obrigatório enquanto não tem login)
        usuarioId: 1, 

        // 2. Tratamento das horas (Adiciona :00 se faltar)
        horaAbertura: dadosOriginais.horaAbertura.length === 5 ? `${dadosOriginais.horaAbertura}:00` : dadosOriginais.horaAbertura,
        horaFechamento: dadosOriginais.horaFechamento.length === 5 ? `${dadosOriginais.horaFechamento}:00` : dadosOriginais.horaFechamento,
    };
    
    // Decisão do endpoint
    if (tipo === 'EVENTO') {
      return await api.post(ENDPOINT_EVENTOS, dadosParaEnvio);
    } else {
      return await api.post(ENDPOINT_PERMANENTES, dadosParaEnvio);
    }
  },
  // -----------------------------------------------------

  // ATUALIZAR
  atualizar: async (id, feira) => {
    const { tipo, ...dadosParaEnvio } = feira;
    
    // Nota: Na atualização, talvez você precise mandar o usuarioId também, dependendo do seu Backend.
    // Se der erro ao editar, adicione "usuarioId: 1," aqui também.
    
    if (tipo === 'EVENTO') {
      return await api.put(`${ENDPOINT_EVENTOS}/${id}`, dadosParaEnvio);
    } else {
      return await api.put(`${ENDPOINT_PERMANENTES}/${id}`, dadosParaEnvio);
    }
  },

  // EXCLUIR
  excluir: async (id, tipo) => {
    if (tipo === 'EVENTO') {
      return await api.delete(`${ENDPOINT_EVENTOS}/${id}`);
    } else {
      return await api.delete(`${ENDPOINT_PERMANENTES}/${id}`);
    }
  }
};