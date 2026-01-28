import api from "./api";

export const ExpositorService = {
  listarTodos: async () => {
    const response = await api.get("/expositores/buscar-todos");
    return response;
  },

  salvar: async (dadosExpositor, usuarioId) => {
    const payload = {
      nome: dadosExpositor.nome,
      documentacao: dadosExpositor.documentacao,
      status: dadosExpositor.status,
      categoriaId: dadosExpositor.categoriaId,
      descricao: dadosExpositor.descricao,
      tipoProduto: dadosExpositor.tipoProduto,
      foto: dadosExpositor.foto || null, 
      usuarioId: usuarioId,
    };

    const response = await api.post("/expositores/register", payload);
    return response;
  },

  atualizar: async (id, dadosExpositor, usuarioId) => {
    const payload = {
      nome: dadosExpositor.nome,
      documentacao: dadosExpositor.documentacao,
      status: dadosExpositor.status,
      categoriaId: dadosExpositor.categoriaId,
      descricao: dadosExpositor.descricao,
      tipoProduto: dadosExpositor.tipoProduto,
      foto: dadosExpositor.foto || null, // ✅ NOVO
      usuarioId: usuarioId,
    };

    const response = await api.put(`/expositores/update/${id}`, payload);
    return response;
  },

  excluir: async (id) => {
    await api.delete(`/expositores/delete/${id}`);
    return true;
  },

  findById: async (id) => {
    const response = await api.get(`/expositores/${id}`);
    return response;
  },
};
