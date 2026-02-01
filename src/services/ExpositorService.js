import api from "./api";

export const ExpositorService = {
  // ... (métodos listarTodos, salvar, atualizar, excluir, findById mantidos)
  listarTodos: async () => {
    const response = await api.get("/expositores/buscar-todos");
    return response;
  },

  salvar: async (dadosExpositor, usuarioId) => {
    const payload = {
      ...dadosExpositor,
      tipoProduto: dadosExpositor.tipoProduto || "Geral",
      foto: dadosExpositor.foto || null,
      nota: dadosExpositor.nota || 0,
      usuarioId: usuarioId,
    };
    return await api.post("/expositores/register", payload);
  },

  atualizar: async (id, dadosExpositor, usuarioId) => {
    const payload = {
      ...dadosExpositor,
      foto: dadosExpositor.foto || null,
      nota: dadosExpositor.nota || 0,
      usuarioId: usuarioId,
    };
    return await api.put(`/expositores/update/${id}`, payload);
  },

  excluir: async (id) => {
    await api.delete(`/expositores/delete/${id}`);
    return true;
  },

  findById: async (id) => {
    return await api.get(`/expositores/${id}`);
  },

  // ✅ NOVO MÉTODO PARA AVALIAR
  avaliar: async (id, novaNota) => {
    // 1. Busca o expositor atual
    const expositorAtual = await api.get(`/expositores/${id}`);

    // 2. Monta payload mantendo os dados e atualizando a nota
    const payload = {
        id: expositorAtual.id,
        nome: expositorAtual.nome,
        documentacao: expositorAtual.documentacao,
        status: expositorAtual.status,
        categoriaId: expositorAtual.categoriaId || expositorAtual.categoria?.id, // Ajuste dependendo do retorno do GET
        descricao: expositorAtual.descricao,
        tipoProduto: expositorAtual.tipoProduto,
        foto: expositorAtual.foto,
        nota: novaNota, // Atualiza nota
        usuarioId: expositorAtual.usuarioId // Se disponível
    };

    // 3. Envia atualização
    return await api.put(`/expositores/update/${id}`, payload);
  }
};