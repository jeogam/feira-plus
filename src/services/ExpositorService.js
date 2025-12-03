// src/services/ExpositorService.js

// Assumindo que você tem uma instância do axios configurada como 'api'
import api from './api'; 

export const ExpositorService = {

    // --- 1. LISTAR TODOS (GET /expositores) ---
    listarTodos: async () => {
        // Faz a chamada real para o seu Controller Spring Boot.
        // Espera receber a lista de ExpositorGetDto[]
        const response = await api.get('/expositores');
        return response.data; 
    },

    // --- 2. SALVAR/ATUALIZAR (POST /expositores ou PUT /expositores/{id}) ---
    // Esta função lida tanto com a criação quanto com a atualização,
    // usando a presença do 'id' nos dados.
    salvar: async (dadosExpositor) => {
        // Se o objeto tiver ID, é um update (PUT); caso contrário, é um novo registro (POST).
        const id = dadosExpositor.id;
        const endpoint = id ? `/expositores/${id}` : '/expositores';
        const method = id ? 'put' : 'post'; // PUT para update, POST para novo

        // Envia o ExpositorPostDto para o Controller
        const response = await api[method](endpoint, dadosExpositor); 
        
        // Retorna o ExpositorGetDto que o Controller envia na resposta
        return response.data;
    },

    // --- 3. DELETAR (DELETE /expositores/{id}) ---
    excluir: async (id) => {
        // Faz a chamada DELETE. O Controller retornará 204 No Content.
        await api.delete(`/expositores/${id}`);
        return true;
    },
    
    // --- 4. BUSCAR POR ID (GET /expositores/{id}) ---
    // Necessário se houver alguma tela que carregue um único expositor
    findById: async (id) => {
        const response = await api.get(`/expositores/${id}`);
        return response.data; // Retorna o ExpositorGetDto
    }
};