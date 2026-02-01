import api from "./api";

const ENDPOINT_EVENTOS = "/feiras/eventos";
const ENDPOINT_PERMANENTES = "/feiras/permanentes";

export const FeiraService = {
  listarTodas: async () => {
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
    const { tipo, id, ...dadosOriginais } = feira;

    const dadosParaEnvio = {
      ...dadosOriginais,
      foto: dadosOriginais.foto || null,
      nota: dadosOriginais.nota || 0,  houver nota
      usuarioId: usuarioIdLogado,

      horaAbertura:
        dadosOriginais.horaAbertura?.length === 5
          ? `${dadosOriginais.horaAbertura}:00`
          : dadosOriginais.horaAbertura,
      horaFechamento:
        dadosOriginais.horaFechamento?.length === 5
          ? `${dadosOriginais.horaFechamento}:00`
          : dadosOriginais.horaFechamento,
    };

    if (tipo === "EVENTO") return await api.post(ENDPOINT_EVENTOS, dadosParaEnvio);
    return await api.post(ENDPOINT_PERMANENTES, dadosParaEnvio);
  },

  atualizar: async (id, feira, usuarioIdLogado) => {
    const { tipo, ...dadosParaEnvio } = feira;

    // ✅ NOVO (garante que vai)
    dadosParaEnvio.foto = dadosParaEnvio.foto || null;

    if (tipo === "EVENTO") return await api.put(`${ENDPOINT_EVENTOS}/${id}`, dadosParaEnvio);
    return await api.put(`${ENDPOINT_PERMANENTES}/${id}`, dadosParaEnvio);
  },

  excluir: async (id, tipo) => {
    if (tipo === "EVENTO") return await api.delete(`${ENDPOINT_EVENTOS}/${id}`);
    return await api.delete(`${ENDPOINT_PERMANENTES}/${id}`);
  },
};
