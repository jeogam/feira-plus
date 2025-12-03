// src/services/ExpositorService.js

import api from './api'; // Sua instância configurada de axios/fetch para a API

// Dados de simulação para desenvolvimento
const mockExpositores = [
    { 
        id: 1, 
        nome: 'Arte Artesanal', 
        email: 'contato@arte.com', 
        cpfCnpj: '12.345.678/0001-90', 
        telefone: '(11) 98765-4321', 
        feirasAtivas: 2 
    },
    { 
        id: 2, 
        nome: 'João da Silva', 
        email: 'joao.silva@expositor.com', 
        cpfCnpj: '987.654.321-00', 
        telefone: '(21) 99999-8888', 
        feirasAtivas: 1 
    },
    { 
        id: 3, 
        nome: 'Tecno Verde Soluções', 
        email: 'info@tecnoverde.com', 
        cpfCnpj: '00.111.222/0001-50', 
        telefone: '(31) 97777-6666', 
        feirasAtivas: 0 
    },
];

export const ExpositorService = {
    
    // Simula a busca de todos os expositores
    listarTodos: async () => {
        console.log("MOCK: Listando todos os expositores.");
        // Em um projeto real, seria: return api.get('/expositores').then(res => res.data);
        return new Promise(resolve => setTimeout(() => resolve(mockExpositores), 500)); 
    },

    // Simula a criação de um novo expositor
    salvar: async (dados, userId) => {
        console.log("MOCK: Salvando novo expositor:", dados, "por user:", userId);
        // Gera um ID simulado e adiciona à lista para manter o estado da simulação
        const novoId = Date.now();
        const novoExpositor = { ...dados, id: novoId, feirasAtivas: 0 };
        mockExpositores.push(novoExpositor);
        
        // Em um projeto real, seria: return api.post('/expositores', { ...dados, userId });
        return new Promise(resolve => setTimeout(() => resolve({ id: novoId }), 500)); 
    },

    // Simula a atualização de um expositor
    atualizar: async (id, dados, userId) => {
        console.log(`MOCK: Atualizando expositor ID ${id}:`, dados, "por user:", userId);
        // Encontra o índice e substitui os dados (simulação)
        const index = mockExpositores.findIndex(e => e.id === id);
        if (index !== -1) {
            mockExpositores[index] = { ...mockExpositores[index], ...dados };
        }

        // Em um projeto real, seria: return api.put(`/expositores/${id}`, { ...dados, userId });
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)); 
    },

    // Simula a exclusão de um expositor
    excluir: async (id) => {
        console.log(`MOCK: Excluindo expositor ID ${id}.`);
        // Remove da lista (simulação)
        const index = mockExpositores.findIndex(e => e.id === id);
        if (index !== -1) {
             mockExpositores.splice(index, 1);
        }

        // Em um projeto real, seria: return api.delete(`/expositores/${id}`);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)); 
    },
};