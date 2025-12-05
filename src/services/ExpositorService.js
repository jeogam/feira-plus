import api from './api'; 

export const ExpositorService = {

    // --- 1. LISTAR TODOS ---
    listarTodos: async () => {
        // O seu api.js já retorna o JSON direto (sem .data)
        const response = await api.get('/expositores/buscar-todos');
        return response; 
    },

    // --- 2. SALVAR (Novo) ---
    // Recebe os dados e o ID do usuário logado (vindo do GestaoExpositores.js)
    salvar: async (dadosExpositor, usuarioId) => {
        const payload = {
            ...dadosExpositor,
            usuarioId: usuarioId // Adiciona o ID do usuário ao objeto enviado
        };
        
        const response = await api.post('/expositores/register', payload);
        return response;
    },

    // --- 3. ATUALIZAR (Existente) ---
    atualizar: async (id, dadosExpositor, usuarioId) => {
        const payload = {
            ...dadosExpositor,
            usuarioId: usuarioId
        };

        const response = await api.put(`/expositores/update/${id}`, payload);
        return response;
    },

    // --- 4. DELETAR ---
    excluir: async (id) => {
        await api.delete(`/expositores/delete/${id}`);
        return true;
    },
    
    // --- 5. BUSCAR POR ID (Opcional) ---
    findById: async (id) => {
        const response = await api.get(`/expositores/${id}`);
        return response;
    }
};