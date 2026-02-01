import api from "./api";

const ENDPOINT_EVENTOS = "/feiras/eventos";
const ENDPOINT_PERMANENTES = "/feiras/permanentes";

export const FeiraService = {
  listarTodas: async () => {
    // ... (código existente mantido)
    try {
      const [listaEventos, listaPermanentes] = await Promise.all([
        api.get(ENDPOINT_EVENTOS),
        api.get(ENDPOINT_PERMANENTES),
      ]);

      const eventos = Array.isArray(listaEventos)
        ? listaEventos.map((f) => ({ ...f, tipo: "EVENTO" }))
        : [];

      const permanentes = Array.isArray(listaPermanentes)
        ? listaPermanentes.map((f) => ({ ...f, tipo: "PERMANENTE" }))
        : [];

      return [...eventos, ...permanentes];
    } catch (error) {
      console.error("Erro ao buscar feiras:", error);
      throw error;
    }
  },

  salvar: async (feira, usuarioIdLogado) => {
    // ... (código existente mantido)
    const { tipo, id, ...dadosOriginais } = feira;
    const dadosParaEnvio = {
      ...dadosOriginais,
      foto: dadosOriginais.foto || null,
      nota: dadosOriginais.nota || 0,
      usuarioId: usuarioIdLogado,
      horaAbertura: dadosOriginais.horaAbertura?.length === 5 ? `${dadosOriginais.horaAbertura}:00` : dadosOriginais.horaAbertura,
      horaFechamento: dadosOriginais.horaFechamento?.length === 5 ? `${dadosOriginais.horaFechamento}:00` : dadosOriginais.horaFechamento,
    };

    if (tipo === "EVENTO") return await api.post(ENDPOINT_EVENTOS, dadosParaEnvio);
    return await api.post(ENDPOINT_PERMANENTES, dadosParaEnvio);
  },

  atualizar: async (id, feira, usuarioIdLogado) => {
    // ... (código existente mantido)
    const { tipo, ...dadosParaEnvio } = feira;
    dadosParaEnvio.foto = dadosParaEnvio.foto || null;
    
    // Garante formato de hora
    if(dadosParaEnvio.horaAbertura?.length === 5) dadosParaEnvio.horaAbertura += ':00';
    if(dadosParaEnvio.horaFechamento?.length === 5) dadosParaEnvio.horaFechamento += ':00';

    if (tipo === "EVENTO") return await api.put(`${ENDPOINT_EVENTOS}/${id}`, dadosParaEnvio);
    return await api.put(`${ENDPOINT_PERMANENTES}/${id}`, dadosParaEnvio);
  },

  excluir: async (id, tipo) => {
    if (tipo === "EVENTO") return await api.delete(`${ENDPOINT_EVENTOS}/${id}`);
    return await api.delete(`${ENDPOINT_PERMANENTES}/${id}`);
  },

  // ✅ NOVO MÉTODO PARA AVALIAR
  avaliar: async (id, tipo, novaNota) => {
    // 1. Busca a feira atual para não perder dados
    const endpoint = tipo === "EVENTO" ? `${ENDPOINT_EVENTOS}/${id}` : `${ENDPOINT_PERMANENTES}/${id}`;
    const feiraAtual = await api.get(endpoint);

    // 2. Atualiza apenas a nota
    const dadosAtualizados = {
        ...feiraAtual,
        nota: novaNota,
        // Garante formatação de hora se necessário
        horaAbertura: feiraAtual.horaAbertura?.length === 5 ? `${feiraAtual.horaAbertura}:00` : feiraAtual.horaAbertura,
        horaFechamento: feiraAtual.horaFechamento?.length === 5 ? `${feiraAtual.horaFechamento}:00` : feiraAtual.horaFechamento,
    };
    
    // Tratamento específico para listas (backend espera IDs, não objetos completos)
    if (dadosAtualizados.expositores) {
        dadosAtualizados.expositorIds = dadosAtualizados.expositores.map(e => e.id);
        delete dadosAtualizados.expositores;
    }

    // 3. Envia o PUT
    return await api.put(endpoint, dadosAtualizados);
  }
};